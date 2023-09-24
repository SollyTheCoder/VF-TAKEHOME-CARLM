import axios from 'axios';
import { axiosRequest, getData } from '../functions';

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


jest.mock('axios');
const apiUrl = 'http://localhost';
const devicesResponseData = [{ id: 1, name: 'Device 1' }];
const industriesResponseData = [{ id: 1, name: 'Industry 1' }];

describe('getData Function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    axios.mockResolvedValueOnce({ data: devicesResponseData, status: 200 });
    axios.mockResolvedValueOnce({ data: industriesResponseData, status: 200 });

    const result = await getData(apiUrl);

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: 'GET',
      url: `${apiUrl}/device`,
      data: {}
    });

    expect(axios).toHaveBeenNthCalledWith(2, {
      url: `${apiUrl}/industry`,
      method: 'GET',
      data: {}
    });

    expect(result.devicesResponse.data).toEqual(devicesResponseData);
    expect(result.industriesResponse.data).toEqual(industriesResponseData);
    expect(result.fail).toBeFalsy();
  });

  it('should handle error response', async () => {
    const errorMessage = 'An error occurred';
    const errorStatus = 500;

    axios.mockRejectedValueOnce({
      response: {
        data: { error: errorMessage },
        status: errorStatus,
      },
    });
    axios.mockRejectedValueOnce({
      response: {
        data: { error: errorMessage },
        status: errorStatus,
      },
    });

    const result = await getData(apiUrl);

    expect(axios).toHaveBeenNthCalledWith(1, {
      url: `${apiUrl}/device`,
      method: 'GET',
      data: {}
    });

    expect(axios).toHaveBeenNthCalledWith(2, {
      url: `${apiUrl}/industry`,
      method: 'GET',
      data: {}
    });

    expect(result.fail).toBeTruthy();
  });
});
