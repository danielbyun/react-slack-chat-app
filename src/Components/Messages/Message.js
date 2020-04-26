import React, { useEffect } from "react";
import moment from "moment";
import { Comment } from "semantic-ui-react";

const Message = (props) => {
  const { currentUser, message } = props;

  useEffect(() => {
    console.log(currentUser);
    console.log(message);
  }, [currentUser, message]);

  const isOwnMessage = (message, user) => {
    if (message !== undefined && user !== undefined)
      return message.user.id === user.uid ? "message__self" : "";
  };

  const timeFromNow = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message, currentUser)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.MetaData>{timeFromNow(message.timestamp)}</Comment.MetaData>
        <Comment.Text>{message.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default Message;
