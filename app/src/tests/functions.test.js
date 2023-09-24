import axios from 'axios';
import { axiosRequest } from '../functions';

jest.mock('axios');
const url = 'http://localhost';
const testData = { data: 'test data' }
const requestData = { key: 'value' }

describe('axiosRequest Function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request and return data', async () => {
    axios.mockResolvedValue(testData);

    const method = 'GET';
    const response = await axiosRequest(url, method);

    expect(axios).toHaveBeenCalledWith({
      url,
      method,
      data: {}
    });

    expect(response.data).toEqual(testData.data);
  });

  it('should make a DELETE request and return data', async () => {
    axios.mockResolvedValue(testData);

    const method = 'DELETE';
    const response = await axiosRequest(url, method);

    expect(axios).toHaveBeenCalledWith({
      url,
      method,
      data: {}
    });

    expect(response.data).toEqual(testData.data);
  });

  it('should make a POST request and return data', async () => {
    axios.mockResolvedValue(testData);

    const method = 'POST';
    const response = await axiosRequest(url, method, requestData);

    expect(axios).toHaveBeenCalledWith({
      url,
      method,
      data: requestData
    });

    expect(response.data).toEqual(testData.data);
  });

  it('should make a PUT request and return data', async () => {
    axios.mockResolvedValue(testData);

    const method = 'PUT';
    const response = await axiosRequest(url, method, requestData);

    expect(axios).toHaveBeenCalledWith({
      url,
      method,
      data: requestData
    });

    expect(response.data).toEqual(testData.data);
  });

  it('should handle error response', async () => {
    const errorMessage = 'An error occurred';
    const errorStatus = 500;

    axios.mockRejectedValue({
      response: {
        data: { error: errorMessage },
        status: errorStatus,
      },
    });

    const method = 'GET';
    const response = await axiosRequest(url, method);

    expect(axios).toHaveBeenCalledWith({
      url,
      method,
      data: {}
    });

    expect(response.data).toEqual(errorMessage);
    expect(response.status).toEqual(errorStatus);
  });
});
