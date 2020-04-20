import React from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  Input,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../../App.css";

const handleChange = (e) => {
  const { name, value } = e.target;
};

const Register = () => {
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon colors="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for Slack Chat App
          <Form size="large">
            <Segment stacked>
              <Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="username"
                onChange={handleChange}
                type="text"
              />
              <Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="email"
                onChange={handleChange}
                type="email"
              />
              <Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="password"
                onChange={handleChange}
                type="password"
              />
              <Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={handleChange}
                type="password"
              />
              <Button color="orange" fluid size="large">
                Submit
              </Button>
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
