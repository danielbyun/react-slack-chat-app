import React from "react";
import { Header, Segment, Icon, Input } from "semantic-ui-react";

const MessagesHeader = () => {
  return (
    <Segment clearing>
      {/* channel title */}
      <Header fluid={"true"} as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          Channel
          <Icon name={"star outline"} color="black" />
        </span>
        <Header.Subheader>2 Users</Header.Subheader>
      </Header>
      {/* channel Search Input */}
      <Header floated="right">
        <Input
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
