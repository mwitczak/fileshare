import React, { useContext, useEffect, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../contexts/UserContext';
import Container from 'react-bootstrap/Container';
import {
  getFilesCall,
  deleteFileCall,
  uploadFileCall,
} from '../services/FileApi';
import { FileTable } from './FileTable';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const UserFiles = () => {
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
      <Row>
        <Col sm={3}>
          <FormControl type={'file'}
                       onChange={e => setFile(e.target.files[0])}/>
        </Col>
        <Col sm={3}>
          <Button variant={'primary'} onClick={uploadFile}>Upload</Button>
        </Col>
      </Row>
      <Row>
        <FileTable files={files} deleteFile={deleteFile}/>
      </Row>
    </Container>
  );
};