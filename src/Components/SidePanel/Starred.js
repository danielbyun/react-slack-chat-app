import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";
import _ from "lodash";
import firebase from "../../firebase";
import useDeepCompareEffect from "use-deep-compare-effect";

const Starred = ({ currentUser }) => {
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");
  const [activeUser, setActiveUser] = useState();
  const [usersRef] = useState(firebase.database().ref("users"));

  useDeepCompareEffect(() => {
    const updateChannels = (userId) => {
      const channels = [];
      let tempChannel;
      usersRef
        .child(userId)
        .child("starred")
        .on("child_added", (snap) => {
          tempChannel = { id: snap.key, ...snap.val() };
          channels.push(tempChannel);
          setStarredChannels(channels);
        });

      usersRef
        .child(userId)
        .child("starred")
        .on("child_removed", (snap) => {
          const channelToRemove = { id: snap.key, ...snap.val() };
          const filteredChannels = starredChannels.filter((channel) => {
            return channel.id !== channelToRemove.id;
          });
          setStarredChannels(filteredChannels);
        });
    };

    if (!_.isEmpty(currentUser)) {
      setActiveUser(currentUser);
      updateChannels(currentUser.uid);
    }
  }, [currentUser, starredChannels]);

  const changeChannel = (channel) => {
    setActiveChannel(channel);
  };

  const displayChannels = (starredChannels) =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Fragment key={channel.id}>
        {channel !== undefined && (
          <Menu.Item
            onClick={() => changeChannel(channel)}
            name={channel.name.channelName}
            style={{ opacity: 0.7 }}
            active={channel.id === activeChannel}
          >
            # {channel.name.channelName}
          </Menu.Item>
        )}
      </Fragment>
    ));
  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED{" "}
        </span>
        ({starredChannels.length})
      </Menu.Item>
      {/* channels */}
      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Starred);
