import axios from 'axios';

export const axiosRequest = async (url, method, data = {}) => {
  try {
    const response = await axios({
      url: url,
      method: method,
      data: data
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    return { data: error.response.data.error, status: error.response.status }
  }
};
