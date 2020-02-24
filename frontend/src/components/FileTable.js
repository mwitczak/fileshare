import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import React, { useContext, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { UserContext } from '../contexts/UserContext';
import { updateFileCall } from '../services/FileApi';
import { API_URL } from '../Config';

export const FileTable = ({ files, deleteFile, isPublic }) => {
  const { token } = useContext(UserContext);

  const DownloadButton = ({ file }) => {
    if (!file.zipped) {
      return 'File processing in progress...';
    }
    return (<Button
      onClick={() => window.open(`${API_URL}/files/${file.id}`,
        '_blank')}>Download</Button>);
  };

  const updateFile = async (id, description) => {
    await updateFileCall(token, { id: id, description: description });
  };

  const DescriptionField = ({ isPublic, file }) => {
    const [description, setDescription] = useState(file.description);

    if (isPublic) {
      return description;
    }

    return (
      <FormControl type={'textarea'}
                   onChange={e => setDescription(e.target.value)}
                   onBlur={e => updateFile(file.id, description)}
                   value={description}/>
    );
  };

  const fileRows = files.map(file => (
    <tr>
      <td>{file.id}</td>
      <td>{file.originalname}</td>
      <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
      <td><DescriptionField file={file} isPublic={isPublic}/></td>
      <td><DownloadButton file={file}/></td>
      {!isPublic ? <td><Button
        onClick={() => deleteFile(file.id)}>Delete</Button>
      </td> : null}
    </tr>
  ));

  return <Table striped bordered hover>
    <thead>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Size</th>
      <th>Description</th>
      <th>Download</th>
      {!isPublic ? <th>Delete</th> : null}
    </tr>
    </thead>
    <tbody>{fileRows}</tbody>
  </Table>;
};