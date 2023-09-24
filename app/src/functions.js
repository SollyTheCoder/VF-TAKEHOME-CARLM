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

export const getData = async (apiUrl) => {
  try {
    const devicesResponse = await axiosRequest(`${apiUrl}/device`, 'GET');
    const industriesResponse = await axiosRequest(`${apiUrl}/industry`, 'GET');
    const industriesDict = industriesResponse.data.reduce((dict, industry) => {
      dict[industry.id] = industry.name;
      return dict;
    }, {})
    return { devicesResponse, industriesResponse, industriesDict, fail: false }
  } catch (e) {
    return { fail: true }
  }
}
