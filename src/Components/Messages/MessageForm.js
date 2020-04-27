import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Segment, Button, Input, ButtonGroup } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";
import _ from "lodash";

const MessageForm = (props) => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    getMessagesRef,
  } = props;
  const [activeChannel, setActiveChannel] = useState(currentChannel);
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState();
  const [pathToUpload, setPathToUpload] = useState();
  const [currentMessagesRef, setCurrentMessagesRef] = useState();
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [storageRef] = useState(firebase.storage().ref());

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const createMessage = (fileUrl = null) => {
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      message,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    if (fileUrl !== null) {
      newMessage["image"] = fileUrl;
    } else {
      newMessage["message"] = message;
    }

    return newMessage;
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      getMessagesRef()
        .child(activeChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
          setErrors([]);
          setPathToUpload(null);
          setUploadTask(null);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setErrors(errors.concat(error));
          setMessage("");
          setPathToUpload(null);
          setUploadTask(null);
        });
    } else {
      console.error("add a message");
      setErrors(errors.concat({ message: "Add a message" }));
      setLoading(false);
    }
  };

  const getPath = () => {
    if (isPrivateChannel) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return "chat/public";
    }
  };

  const uploadFile = (file, metadata) => {
    const channelPath = currentChannel.id;
    const ref = getMessagesRef();
    const filePath = `${getPath()}/${uuid()}.jpg`;

    setUploadState("uploading");
    setUploadTask(storageRef.child(filePath).put(file, metadata));
    setPathToUpload(channelPath);
    setCurrentMessagesRef(ref);
  };

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        setUploadState("done");
      })
      .catch((err) => {
        console.error(err);
        setErrors(errors.concat(err));
      });
  };

  useEffect(() => {
    if (!_.isEmpty(uploadTask) && !_.isUndefined(uploadTask)) {
      uploadTask.on(
        "state_changed",
        (snap) => {
          const progress = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setPercentUploaded(progress);
        },
        (err) => {
          console.error(err);
          setErrors(errors.concat(err));
          setUploadState("error");
          setUploadTask(null);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              sendFileMessage(downloadURL, currentMessagesRef, pathToUpload);
            })
            .catch((err) => {
              console.error(err);
              setErrors(errors.concat(err));
              setUploadState("error");
              setUploadTask(null);
            });
        }
      );
    }
  }, [uploadTask]);

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
        onChange={handleChange}
        value={message}
        className={
          errors.some((error) => error.message.includes("message"))
            ? "error"
            : ""
        }
      />
      <ButtonGroup icon widths="2">
        <Button
          onClick={sendMessage}
          disabled={loading}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
        />
        <Button
          onClick={openModal}
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          disabled={uploadState === "uploading"}
        />
      </ButtonGroup>
      <FileModal open={open} closeModal={closeModal} uploadFile={uploadFile} />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(MessageForm);
