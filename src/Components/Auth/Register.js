import React, { useState, Fragment } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../../App.css";
import firebase from "../../firebase";
import md5 from "md5";

const Register = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const isFormValid = () => {
    let errorsArray = [];
    let error;

    if (isFormEmpty(state)) {
      // throw error
      error = { message: "Fill in all fields" };
      setState({ errors: errorsArray.concat(error) });

      return false;
    } else if (!isPasswordValid(state)) {
      // throw error
      error = { message: "Password is invalid" };
      setState({ errors: errorsArray.concat(error) });

      return false;
    } else {
      // forms valid

      return true;
    }
  };

  const handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  const saveUser = (createdUser) => {
    return state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid()) {
      //   setState({});
      setState({ loading: true });

      firebase
        .auth()
        .createUserWithEmailAndPassword(state.email, state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log("user saved");
                setState({ loading: false });
              });
            })
            .catch((error) => {
              console.error(error);
              setState({ errors: errors.concat(error), loading: false });
            });
        })
        .catch((error) => {
          let errorsArray = [];
          let errorObject;
          errorObject = { message: error.message };

          setState({ errors: errorsArray.concat(errorObject) });
          setState({ loading: false });
        });
    }
  };

  const {
    username,
    email,
    password,
    passwordConfirmation,
    errors,
    loading,
  } = state;

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon colors="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for Slack Chat App
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                label="Username"
                placeholder="Username"
                type="text"
                name="username"
                value={username || ""}
                onChange={(e) => handleChange(e)}
                // className={handleInputError(errors, "username")}
              />

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
              <Form.Input
                label="Password Confirmation"
                placeholder="Password Confirmation"
                type="password"
                name="passwordConfirmation"
                value={passwordConfirmation || ""}
                onChange={(e) => handleChange(e)}
              />
              <Button
                color="orange"
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
                Already a user? <Link to="/login">Login</Link>
              </Message>
            </Segment>
          </Form>
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
