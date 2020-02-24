import axios from 'axios';
import { API_URL } from '../Config';

export const getPublicFilesCall = async (token) => {
  const filesResponse = await axios.get(`${API_URL}/files`, {
    headers: {
      token: token,
    },
  });

  return filesResponse.data;
};

export const getFilesCall = async (token) => {
  const filesResponse = await axios.get(`${API_URL}/user/files`, {
    headers: {
      token: token,
    },
  });

  return filesResponse.data;
};

export const deleteFileCall = async (token, id) => {
  await axios.delete(`${API_URL}/user/files/${id}`, {
    headers: {
      token: token,
    },
  });
};

export const uploadFileCall = async (token, file) => {
  let formData = new FormData();
  formData.append('image', file);
  await axios.post(`${API_URL}/user/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: token,
    },
  });
};

export const updateFileCall = async (token, file) => {
  return await axios.patch(`${API_URL}/files/${file.id}`, file, {
    headers: {
      token: token,
    },
  });
};
