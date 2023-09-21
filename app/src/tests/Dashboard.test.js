import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

const mockOnPageChange = jest.fn();
const businessName = 'This is the business name'
const samplePages = {
  industries: {
    icon: <div>Industries Icon</div>,
    content: <div>Industries Content</div>,
  },
  devices: {
    icon: <div>Devices Icon</div>,
    content: <div>Devices Content</div>,
  },
};

test('renders the Dashboard component with page selection options', () => {
  render(
    <Dashboard onPageChange={mockOnPageChange} pages={samplePages} name={businessName} />
  );

  expect(screen.getByText('Industries Icon')).toBeInTheDocument();
  expect(screen.getByText('Devices Icon')).toBeInTheDocument();
});

test('renders the Dashboard component with initial selectedPage', () => {
  render(
    <Dashboard onPageChange={mockOnPageChange} pages={samplePages} name={businessName} />
  );

  expect(screen.getByText('Industries Icon')).toBeInTheDocument();
  expect(screen.getByText('Industries Content')).toBeInTheDocument();
  expect(screen.getByText('Devices Icon')).toBeInTheDocument();

  expect(screen.queryByText('Devices Content')).toBeNull();
});

test('clicking on a page updates the selectedPage', () => {
  render(
    <Dashboard onPageChange={mockOnPageChange} pages={samplePages} name={businessName} />
  );

  fireEvent.click(screen.getByText('Devices Icon'));

  expect(mockOnPageChange).toHaveBeenCalledTimes(1)

  expect(screen.getByText(businessName)).toBeInTheDocument();
  expect(screen.getByText('Industries Icon')).toBeInTheDocument();
  expect(screen.getByText('Devices Icon')).toBeInTheDocument();
  expect(screen.getByText('Devices Content')).toBeInTheDocument();

  expect(screen.queryByText('Industries Content')).toBeNull();
});

test('renders the Dashboard component with title', () => {
  render(
    <Dashboard onPageChange={mockOnPageChange} pages={samplePages} name={businessName} />
  );

  expect(screen.getByText(businessName)).toBeInTheDocument();
});
