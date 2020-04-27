import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import _ from "lodash";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";

const DirectMessages = ({
  currentUser,
  setCurrentChannel,
  setPrivateChannel,
}) => {
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [users, setUsers] = useState([]);
  const [usersRef] = useState(firebase.database().ref("users"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));
  const [activeChannel, setActiveChannel] = useState("");

  const isBlank = (value) => {
    return value === null || value.match(/^ *$/) !== null;
  };

  useEffect(() => {
    if (currentUser) {
      setCurrentUserUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    let loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (!isBlank(currentUserUid)) {
        if (currentUserUid !== snap.key) {
          let user = snap.val();
          user["uid"] = snap.key;
          user["status"] = "offline";
          loadedUsers.push(user);
          setUsers(loadedUsers);
        }
      }
    });
  }, [usersRef, currentUserUid]);

  useEffect(() => {
    const addStatusToUser = (userId, connected = true) => {
      const updatedUsers = users.reduce((acc, user) => {
        if (user.uid === userId) {
          user["status"] = `${connected ? "online" : "offline"}`;
        }
        return acc.concat(user);
      }, []);
      setUsers(updatedUsers);
    };

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        if (!isBlank(currentUserUid)) {
          const ref = presenceRef.child(currentUserUid);
          ref.set(true);
          ref.onDisconnect().remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
        }
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (!isBlank(currentUserUid)) {
        if (currentUserUid !== snap.key) {
          addStatusToUser(snap.key);
        }
      }
    });

    presenceRef.on("child_removed", (snap) => {
      if (!isBlank(currentUserUid)) {
        if (currentUserUid !== snap.key) {
          addStatusToUser(snap.key, false);
        }
      }
    });
  }, [connectedRef, presenceRef, currentUserUid, users]);

  const isUserOnline = (user) => {
    if (!_.isEmpty(user) && !_.isUndefined(user)) {
      if (user.status === "online") {
        return true;
      } else {
        return false;
      }
    }
  };

  const changeChannel = (user) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
    setActiveChannel(user.uid);
  };

  const getChannelId = (userId) => {
    if (!isBlank(currentUserUid)) {
      return userId < currentUserUid
        ? `${userId}/${currentUserUid}`
        : `${currentUserUid}/${userId}`;
    }
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {/* users */}
      {users.map((user) => (
        <Menu.Item
          key={user.uid}
          active={user.uid === activeChannel}
          onClick={() => changeChannel(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} />@{" "}
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(DirectMessages);
