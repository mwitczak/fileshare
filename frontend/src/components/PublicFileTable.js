import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import Container from 'react-bootstrap/Container';
import { getPublicFilesCall } from '../services/FileApi';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FileSize } from './FileSize';
import { DownloadButton } from './FileTable';

export const PublicFileTable = () => {
  const [files, setFiles] = useState([]);
  const { token } = useContext(UserContext);

  useEffect(() => {
    getPublicFilesCall(token).then(files => setFiles(files));
  }, []);

  const FileBox = ({ file }) => {
    return (
        <Col xs={12} sm={6} md={4} lg={3}  className={'filebox'}>
          <Row className={'fileDescription'}>
            <Col sm={12}>
              <b>{file.originalname}</b>
            </Col>
            <Col sm={12}>
              {FileSize(file.size)}
            </Col>
            <Col sm={12}>
              {file.description}
            </Col>
            <Col sm={12}>
              <DownloadButton file={file} />
            </Col>
          </Row>
        </Col>
    );
  };

  return (
    <Container>
      <Row>
      {files.map(file => <FileBox file={file}/>)}
      </Row>
    </Container>
  );
};