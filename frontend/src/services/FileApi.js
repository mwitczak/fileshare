import axios from 'axios';

export const getPublicFilesCall = async (token) => {
  const filesResponse = await axios.get('http://localhost:8080/files', {
    headers: {
      token: token,
    },
  });

  return filesResponse.data;
};

export const getFilesCall = async (token) => {
  const filesResponse = await axios.get('http://localhost:8080/user/files', {
    headers: {
      token: token,
    },
  });

  return filesResponse.data;
};

export const deleteFileCall = async (token, id) => {
  await axios.delete(`http://localhost:8080/user/files/${id}`, {
    headers: {
      token: token,
    },
  });
};

export const uploadFileCall = async (token, file) => {
  let formData = new FormData();
  formData.append('image', file);
  await axios.post('http://localhost:8080/user/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: token,
    },
  });
};