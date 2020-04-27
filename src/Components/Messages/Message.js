import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const Message = (props) => {
  const { user, message } = props;

  const isOwnMessage = (message, user) => {
    if (message !== undefined && user !== undefined)
      return message.user.id === user.uid ? "message__self" : "";
  };

  const timeFromNow = (timestamp) => {
    return <p>{moment(timestamp).fromNow()}</p>;
  };

  const isMessage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message, user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>

        {isMessage(message) ? (
          <Image src={message.image} className="message__image" />
        ) : (
          <Comment.Text>{message.message}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
