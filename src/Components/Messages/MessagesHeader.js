import React, { useEffect } from "react";
import { Header, Segment, Icon, Input } from "semantic-ui-react";

const MessagesHeader = ({
  channelName,
  uniqueUsers,
  handleSearchChange,
  searchLoading,
  isPrivateChannel,
  handleStar,
  isChannelStarred,
}) => {
  useEffect(() => {
    // console.log(channelName);
    // console.log(uniqueUsers);
    // console.log(isChannelStarred);
  }, [channelName, uniqueUsers, isChannelStarred]);
  return (
    <Segment clearing>
      {/* channel title */}
      <Header fluid={"true"} as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!isPrivateChannel && (
            <Icon
              onClick={handleStar}
              style={{ cursor: "pointer" }}
              name={isChannelStarred ? "star" : "star outline"}
              color={isChannelStarred ? "yellow" : "black"}
            />
          )}
        </span>
        <Header.Subheader>{uniqueUsers !== 0 && uniqueUsers}</Header.Subheader>
      </Header>
      {/* channel Search Input */}
      <Header floated="right">
        <Input
          loading={searchLoading}
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
