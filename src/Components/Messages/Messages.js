import React, { Fragment, useEffect, useState, useRef } from "react";
import { Segment, CommentGroup } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import { connect } from "react-redux";
import _ from "lodash";
import Message from "./Message";

const Messages = (props) => {
  const { currentChannel, currentUser, isPrivateChannel } = props;
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [messages, setMessages] = useState();
  const [currentChannelName, setCurrentChannelName] = useState("");
  const [numberOfUniqueUsers, setNumberOfUniqueUsers] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isChannelStarred, setIsChannelStarred] = useState();

  const [usersRef] = useState(firebase.database().ref("users"));
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );

  useEffect(() => {
    if (!_.isEmpty(currentChannel)) {
      setCurrentChannelName(
        currentChannel.name.channelName || currentChannel.name
      );
      const addListeners = (channelId) => {
        // addMessageListener(channelId);
        const ref = getMessagesRef();

        let loadedMessages = [];
        ref.child(channelId).on("child_added", (snap) => {
          if (!_.isEmpty(snap.val())) {
            loadedMessages.push(snap.val());
            setIncomingMessages(incomingMessages.concat(snap.val()));
          }
        });

        setMessages(loadedMessages);
        setMessagesLoading(false);
      };

      const addUserStarsListener = (channelId, userId) => {
        usersRef
          .child(userId)
          .child("starred")
          .once("value")
          .then((data) => {
            if (data.val() !== null) {
              const channelIds = Object.keys(data.val());
              const prevStarred = channelIds.includes(channelId);

              setIsChannelStarred(prevStarred);
            }
          });
      };

      if (currentChannel && currentUser) {
        addListeners(currentChannel.id);
        addUserStarsListener(currentChannel.id, currentUser.uid);
      }
    }

    return () => {
      messagesRef.off();
    };
  }, [currentChannel, currentUser]);

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  useEffect(() => {
    const handleSearchMessages = () => {
      const channelMessages = [...messages];
      const regex = new RegExp(searchText, "gi");
      const searchResults = channelMessages.reduce((acc, message) => {
        if (
          (message.message && message.message.match(regex)) ||
          message.user.name.match(regex)
        ) {
          acc.push(message);
        }
        return acc;
      }, []);
      setSearchResults(searchResults);
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    };

    if (!_.isUndefined(messages) && !_.isEmpty(messages)) {
      handleSearchMessages();
      countUniqueUsers(messages);
    }
  }, [messages, incomingMessages, searchText]);

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((accumulator, message) => {
      if (!accumulator.includes(message.user.name)) {
        accumulator.push(message.user.name);
      }

      return accumulator;
    }, []);

    const plural = uniqueUsers.length > 1;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    setNumberOfUniqueUsers(numUniqueUsers);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setSearchLoading(true);
  };

  const handleStar = () => {
    setIsChannelStarred(!isChannelStarred);
  };

  useEffect(() => {
    const starChannel = () => {
      if (isChannelStarred !== undefined && isChannelStarred === true) {
        usersRef.child(`${currentUser.uid}/starred`).update({
          [currentChannel.id]: {
            name: currentChannel.name,
            details: currentChannel.details,
            createdBy: {
              name: currentChannel.createdBy.name,
              avatar: currentChannel.createdBy.avatar,
            },
          },
        });
      } else if (isChannelStarred !== undefined && isChannelStarred === false) {
        usersRef
          .child(`${currentUser.uid}/starred`)
          .child(currentChannel.id)
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    };

    starChannel();
  }, [isChannelStarred, currentUser, currentChannel, usersRef]);

  const displayMessages = (messages) => {
    return (
      !_.isEmpty(messages) &&
      !_.isEmpty(currentUser) && (
        <span>
          {messages.map((message) => (
            <Message
              key={message.timestamp}
              message={message}
              user={currentUser}
            />
          ))}
        </span>
      )
    );
  };

  return (
    <Fragment>
      <MessagesHeader
        channelName={
          currentChannel !== undefined
            ? `${isPrivateChannel ? "@" : "#"}${currentChannelName}`
            : ""
        }
        uniqueUsers={numberOfUniqueUsers}
        handleSearchChange={handleSearchChange}
        isPrivateChannel={isPrivateChannel}
        searchLoading={searchLoading}
        handleStar={handleStar}
        isChannelStarred={isChannelStarred}
      />
      <Segment>
        <CommentGroup className="messages">
          {searchText
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </CommentGroup>
      </Segment>
      <MessageForm
        messagesRef={messagesRef}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        getMessagesRef={getMessagesRef}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
  currentUser: state.user.currentUser,
  isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps)(Messages);
