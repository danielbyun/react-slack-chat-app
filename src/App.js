import React from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./Components/ColorPanel/ColorPanel";
import SidePanel from "./Components/SidePanel/SidePanel";
import Messages from "./Components/Messages/Messages";
import MetaPanel from "./Components/MetaPanel/MetaPanel";
import { connect } from "react-redux";

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel
          key={currentChannel && currentChannel.id}
          isPrivateChannel={isPrivateChannel}
          userPosts={userPosts}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
});

export default connect(mapStateToProps)(App);
