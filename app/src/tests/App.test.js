import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import App from '../App';

const mockGetData = jest.fn();


const renderApp = (initialData) => {
  mockGetData.mockResolvedValue({
    devicesResponse: { data: [{ id: 1, name: 'Device 1' }] },
    industriesResponse: { data: [{ id: 1, name: 'Industry 1' }] },
    industriesDict: { '1': 'Industry 1' },
    fail: false,
  })
  render(
    <App
      getData={mockGetData}
      initialData={initialData} />
  );
};

it('renders the component', () => {
  renderApp({
    devicesResponse: { data: { id: 1, name: 'Device 1' } },
    industriesResponse: { data: { id: 1, name: 'Industry 1' } },
    industriesDict: { '1': 'Industry 1' },
    fail: false,
  })

  expect(screen.getByText('Business Management Portal')).toBeInTheDocument();
  expect(screen.getByText('devices')).toBeInTheDocument();
  expect(screen.getByText('industries')).toBeInTheDocument();
});

it('renders the component with fail state', () => {
  renderApp({ fail: true })

  expect(screen.getByText('Backend Connection Failure')).toBeInTheDocument();
});

it('triggers getData function on page change', async () => {
  renderApp({
    devicesResponse: { data: [{ id: 1, name: 'Device 1' }] },
    industriesResponse: { data: [{ id: 1, name: 'Industry 1' }] },
    industriesDict: { '1': 'Industry 1' },
    fail: false,
  })

  const deviceButton = screen.getByText('devices')
  await act(() => deviceButton.click())
  expect(mockGetData).toHaveBeenCalledTimes(1)

  const industryButton = screen.getByText('industries')
  await act(() => industryButton.click())
  expect(mockGetData).toHaveBeenCalledTimes(2)
});

