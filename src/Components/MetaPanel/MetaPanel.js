import React, { useState, useEffect } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
} from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";

const MetaPanel = ({ isPrivateChannel, currentChannel, userPosts }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [privateChannel] = useState(isPrivateChannel);

  const handleActiveIndex = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const formatCount = (num) =>
    num > 1 || num === 0 ? `${num} posts` : `${num} post`;

  const displayTopPosters = (userPosts) =>
    Object.entries(userPosts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], index) => (
        <List.Item key={index}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  if (privateChannel) {
    return null;
  } else
    return (
      <Segment loading={_.isEmpty(currentChannel)}>
        {!_.isEmpty(currentChannel) && (
          <Header as="h3" attached="top">
            About # {currentChannel.name.channelName}
          </Header>
        )}
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={handleActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          {!_.isEmpty(currentChannel) && (
            <Accordion.Content active={activeIndex === 0}>
              {currentChannel.details.channelDetails}
            </Accordion.Content>
          )}
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={handleActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>{userPosts && displayTopPosters(userPosts)}</List>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={handleActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          {!_.isEmpty(currentChannel) && (
            <Accordion.Content active={activeIndex === 2}>
              <Header as="h3">
                <Image circular src={currentChannel.createdBy.avatar} />
                {currentChannel.createdBy.name}
              </Header>
            </Accordion.Content>
          )}
        </Accordion>
      </Segment>
    );
};

const mapStateToProps = (state) => ({
  isPrivateChannel: state.channel.isPrivateChannel,
  currentChannel: state.channel.currentChannel,
  userPosts: state.channel.userPosts,
});

export default connect(mapStateToProps)(MetaPanel);
