import React, { useState } from "react";
import { connect } from "react-redux";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

const FileModal = ({ open, closeModal, currentUser, uploadFile }) => {
  const [fileToSubmit, setFileToSubmit] = useState(null);

  const addFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileToSubmit(file);
    }
  };

  const sendFile = () => {
    if (fileToSubmit !== undefined) {
      // send file
      const metadata = { contentType: mime.lookup(fileToSubmit.name) };
      uploadFile(fileToSubmit, metadata);
      closeModal();
      clearFile();
    } else {
      console.error("No file selected");
    }
  };

  const clearFile = () => {
    setFileToSubmit(null);
  };

  return (
    <Modal basic open={open} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          onChange={addFile}
          fluid
          label="File types: jpg, png"
          accept="image/jpg, image/png"
          name="file"
          type="file"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green" inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(FileModal);
