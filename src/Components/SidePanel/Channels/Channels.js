import React, { useEffect, useState, Fragment } from "react";
import firebase from "../../../firebase";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../../redux/actions";

import _ from "lodash";

const Channels = (props) => {
  const { currentUser, setCurrentChannel, setPrivateChannel } = props;
  const [open, setOpen] = useState();
  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [channelName, setChannelName] = useState();
  const [channelDetails, setChannelDetails] = useState();
  const [currentActiveChannel, setCurrentActiveChannel] = useState();

  const [currentNotifications, setNotifications] = useState([]);

  const [firstLoad, setFirstLoad] = useState(true);

  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(!open);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "channelName") {
      setChannelName({
        ...channelName,
        [name]: value,
      });
    } else if (name === "channelDetails") {
      setChannelDetails({
        ...channelDetails,
        [name]: value,
      });
    }
  };

  const addChannel = () => {
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setChannelDetails();
        setChannelName();
        closeModal();
        console.log("channel added");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isFormValid = (channelName, channelDetails) =>
    channelName && channelDetails;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid(channelName, channelDetails)) {
      console.log("channel added");
      addChannel();
    }
  };

  const setActiveChannel = (channel) => {
    setCurrentActiveChannel(channel.id);
  };

  const getNotificationCount = (channel) => {
    let count = 0;

    currentNotifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  const displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name.channelName}
        style={{ opacity: 0.7 }}
        active={channel.id === currentActiveChannel}
      >
        {getNotificationCount(channel) && (
          <Label color="red">{getNotificationCount(channel)}</Label>
        )}
        # {channel.name.channelName}
      </Menu.Item>
    ));

  const changeChannel = (channel) => {
    setActiveChannel(channel);
    setCurrentChannel(channel);
    setPrivateChannel(false);
    setChannel(channel);
    clearNotifications();
  };

  const clearNotifications = () => {
    let index = currentNotifications.findIndex(
      (notification) => notification.id === channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...currentNotifications];
      updatedNotifications[index].total =
        currentNotifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  useEffect(() => {
    const addListeners = () => {
      let loadedChannels = [];

      channelsRef.on("child_added", (snap) => {
        loadedChannels.push(snap.val());
        setChannels(loadedChannels);
        addNotificationListener(snap.key);
      });
    };

    const addNotificationListener = (channelId) => {
      messagesRef.child(channelId).on("value", (snap) => {
        if (channel) {
          handleNotifications(
            channelId,
            channel.id,
            currentNotifications,
            snap
          );
        }
      });
    };

    addListeners();
  }, [channelsRef, messagesRef, channel, currentNotifications]);

  const handleNotifications = (
    channelId,
    currentChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (index !== -1) {
      if (notifications.length > 0) {
        if (channelId !== currentChannelId) {
          lastTotal = notifications[index].total;

          if (snap.numChildren() - lastTotal > 0) {
            notifications[index].count = snap.numChildren() - lastTotal;
          }
        }

        notifications[index].lastKnownTotal = snap.numChildren();
      }
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }

    setNotifications(notifications);
  };

  useEffect(() => {
    if (!_.isEmpty(channels)) {
      const firstChannel = channels[0];
      if (firstLoad && channels.length > 0) {
        setActiveChannel(firstChannel);
        setCurrentChannel(firstChannel);
        setChannel(firstChannel);
      }
      setFirstLoad(false);
    }
  }, [channels, firstLoad, setCurrentChannel]);

  return (
    <Fragment>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS{" "}
          </span>
          ({channels !== undefined ? channels.length : 0}
          )
          <Icon name="add" onClick={openModal} />
        </Menu.Item>
        {/* channels */}
        {displayChannels(channels)}
      </Menu.Menu>
      {/*  Add Channel Modal */}
      <Modal basic open={open} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of Channel"
                name="channelName"
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the Channel"
                name="channelDetails"
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted type="submit" onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Channels);
