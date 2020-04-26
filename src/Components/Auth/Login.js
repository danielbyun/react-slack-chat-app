import React, { Fragment, useState } from "react";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";

const Login = (props) => {
  const { history } = props;

  const [state, setState] = useState({
    email: "",
    password: "",
    errors: [],
    loading: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const isFormValid = ({ email, password }) => email && password;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid(state)) {
      //   setState({});
      setState({ loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then((signedInUser) => {
          console.log(signedInUser);
          history.push("/");
        })
        .catch((error) => {
          console.error(error);
          setState({
            errors: state.errors.concat(error),
            loading: false,
          });
        });
    }
  };

  const { email, password, errors, loading } = state;

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon colors="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to Slack Chat App
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                label="Email"
                placeholder="Email"
                type="email"
                name="email"
                value={email || ""}
                onChange={(e) => handleChange(e)}
                // className={handleInputError(errors, "email")}
              />

              <Form.Input
                label="Password"
                placeholder="Password"
                type="password"
                name="password"
                value={password || ""}
                onChange={(e) => handleChange(e)}
              />
              <Button
                color="violet"
                fluid
                size="large"
                disabled={loading}
                type="submit"
                className={loading ? "loading" : ""}
              >
                Submit
              </Button>
              {state.errors !== undefined && (
                <Fragment>
                  {state.errors.length > 0 && (
                    <Message negative>
                      <h5>Error</h5>
                      {state.errors.map((error, index) => (
                        <p key={index}>{error.message}</p>
                      ))}
                    </Message>
                  )}
                </Fragment>
              )}

              <Message>
                Don't have an account? <Link to="/register">Register</Link>
              </Message>
            </Segment>
          </Form>
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default withRouter(Login);
