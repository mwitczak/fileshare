import React, { useContext, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

export const Upload = () => {
  const [file, setFile] = useState(null);
  const {token} = useContext(UserContext);

  const uploadFile = () => {
    const uploadFileAsync = async () => {
      let formData = new FormData();
      formData.append("image", file);
      await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token
        }
      })
    };
    uploadFileAsync();
  };

  return (
    <FormGroup>
      <FormControl type={'file'} onChange={e => setFile(e.target.files[0])} />
      <Button variant={'primary'} onClick={uploadFile}>Upload</Button>
    </FormGroup>
  );
};