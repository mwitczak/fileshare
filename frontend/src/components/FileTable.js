import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import React from 'react';

export const FileTable = ({ files, deleteFile, isPublic }) => {
  const DownloadButton = ({file}) => {
    if (!file.zipped) {
      return 'File processing in progress...';
    }
    return (<Button
      onClick={() => window.open(`http://localhost:8080/files/${file.id}`,
        '_blank')}>Download</Button>);
  };

  const fileRows = files.map(file => <tr>
    <td>{file.id}</td>
    <td>{file.originalname}</td>
    <td>{file.size / 1024 / 1024} Mb</td>
    <td><DownloadButton file={file}/></td>
    {!isPublic ? <td><Button onClick={() => deleteFile(file.id)}>Delete</Button>
    </td> : null}
  </tr>);
  return <Table striped bordered hover>
    <thead>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Size</th>
      <th>Download</th>
      {!isPublic ? <th>Delete</th> : null}
    </tr>
    </thead>
    <tbody>{fileRows}</tbody>
  </Table>;
};