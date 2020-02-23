import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import Container from 'react-bootstrap/Container';
import { getPublicFilesCall } from '../services/FileApi';
import { FileTable } from './FileTable';

export const PublicFileTable = () => {
  const [files, setFiles] = useState([]);
  const { token } = useContext(UserContext);

  useEffect(() => {
    getPublicFilesCall(token).then(files => setFiles(files));
  }, []);

  return (
    <Container>
      <FileTable files={files} isPublic={true} />
    </Container>
  );
};