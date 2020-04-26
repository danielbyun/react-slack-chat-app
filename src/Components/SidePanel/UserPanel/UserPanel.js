import React, { useEffect, useState } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../../firebase";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const UserPanel = (props) => {
  const [user, setUser] = useState({});
  const { currentUser, history } = props;

  useEffect(() => {
    if (currentUser !== undefined && currentUser !== null) {
      setUser(currentUser);
    }
  }, [currentUser]);

  const dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>,
    },
  ];

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push("/login");
      });
  };

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>Slack Chat App</Header.Content>
          </Header>
        </Grid.Row>
        <Header style={{ padding: "0.25rem" }} as="h4" inverted>
          <Dropdown
            trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}
              </span>
            }
            options={dropDownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default withRouter(connect(mapStateToProps)(UserPanel));
