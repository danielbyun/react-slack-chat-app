import React, { useState } from "react";
import { Segment, Button, Input, ButtonGroup } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";

const MessageForm = (props) => {
  const { messagesRef, currentUser, currentChannel } = props;
  const [activeChannel, setActiveChannel] = useState(currentChannel);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMessage(value);
  };

  const createMessage = () => {
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: message,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    return newMessage;
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(activeChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
          setErrors([]);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setErrors(errors.concat(error));
          setMessage("");
        });
    } else {
      console.error("add a message");
      setErrors(errors.concat({ message: "Add a message" }));
    }
  };

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
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </ButtonGroup>
    </Segment>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(MessageForm);
