import React, { Fragment, useEffect, useState } from "react";
import { Segment, CommentGroup } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import { connect } from "react-redux";
import _ from "lodash";
import Message from "./Message";

const Messages = (props) => {
  const { currentChannel, currentUser } = props;
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messages, setMessages] = useState();
  const messagesRef = firebase.database().ref("messages");

  useEffect(() => {
    if (!_.isEmpty(currentChannel)) {
      const addListeners = (channelId) => {
        addMessageListener(channelId);
      };

      if (currentChannel && currentUser) {
        addListeners(currentChannel.id);
      }
    }

    return () => {
      messagesRef.off();
    };
  }, []);

  const addMessageListener = (channelId) => {
    let loadedMessages = [];
    messagesRef.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
    });
    setMessages(loadedMessages);
    setMessagesLoading(false);
  };

  // const displayMessages = (messages) =>
  //   messages.length > 0 &&
  //   messages !== undefined &&
  //   messages.map((message) => (
  //     <Message key={message.timestamp} message={message} user={currentUser} />
  //   ));

  const displayMessages = (messages) => {
    console.log(messages);
  };

  return (
    <Fragment>
      <MessagesHeader />
      <Segment>
        <CommentGroup className="messages">
          {!_.isEmpty(messages) && displayMessages(messages)}
        </CommentGroup>
      </Segment>
      <MessageForm messagesRef={messagesRef} currentChannel={currentChannel} />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Messages);
