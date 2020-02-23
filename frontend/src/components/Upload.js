import React, { useContext, useEffect, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../contexts/UserContext';
import Container from 'react-bootstrap/Container';
import { getFilesCall, deleteFileCall, uploadFileCall } from '../services/FileApi';
import { FileTable } from './FileTable';

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const { token } = useContext(UserContext);

  useEffect(() => {
    getFilesCall(token).then(files => setFiles(files));
  }, []);

  const deleteFile = async file => {
    await deleteFileCall(token, file);
    const files = await getFilesCall(token);
    setFiles(files);
  };

  const uploadFile = async () => {
    await uploadFileCall(token, file);
    const files = await getFilesCall(token);
    setFiles(files);
    setFile(null);
  };

  return (
    <Container>
      <FormGroup>
        <FormControl type={'file'} onChange={e => setFile(e.target.files[0])}/>
        <Button variant={'primary'} onClick={uploadFile}>Upload</Button>
      </FormGroup>
      <FileTable files={files} deleteFile={deleteFile}/>
    </Container>
  );
};