import axios from 'axios';

export const axiosRequest = async (url, method, data = {}) => {
  const response = await axios({
    url: url,
    method: method,
    data: data
  });
  return response.data;
};
