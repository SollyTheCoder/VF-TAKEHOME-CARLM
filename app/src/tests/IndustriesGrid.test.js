/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IndustriesGrid from '../components/IndustriesGrid';

const mockDeleteFunction = jest.fn(() => Promise.resolve({ data: {}, status: 200 }));
const mockUpdateFunction = jest.fn(() => Promise.resolve({ data: {}, status: 200 }));
const mockCreateFunction = jest.fn(() => Promise.resolve({ data: {}, status: 200 }));
const mockErrorMessageFunction = jest.fn();

const industryData = [{ id: 1, name: 'industry1' }, { id: 2, name: 'industry2' }]
const newRowData = { name: 'industry3' }

const renderIndustriesGrid = () => {
  mockDeleteFunction.mockResolvedValue({ data: {}, status: 200 })
  mockUpdateFunction.mockResolvedValue({ data: {}, status: 200 })
  mockCreateFunction.mockResolvedValue({ data: {}, status: 200 })
  return render(
    <IndustriesGrid
      industryData={industryData}
      deleteFunction={mockDeleteFunction}
      updateFunction={mockUpdateFunction}
      createFunction={mockCreateFunction}
      showErrorMessage={mockErrorMessageFunction}
    />
  );
};

test('renders the EditableGrid component with given data present', () => {
  renderIndustriesGrid()

  industryData.forEach((value) => {
    expect(screen.getByText(value.name)).toBeInTheDocument()
  })
});

describe('Delete functionality', () => {

  test('delete button triggers delete function', async () => {
    renderIndustriesGrid();

    const deleteButtons = screen.getAllByTestId('delete-button');

    await act(() => deleteButtons[0].click());
    expect(mockDeleteFunction).toHaveBeenCalledWith(industryData[0].id);
  });


  test('delete button removes deleted data', async () => {
    renderIndustriesGrid();
    const deleteButtons = screen.getAllByTestId('delete-button');

    expect(screen.getByText(industryData[0].name)).toBeInTheDocument();
    expect(screen.getByText(industryData[1].name)).toBeInTheDocument();

    await act(() => deleteButtons[0].click());

    expect(screen.queryByText(industryData[0].name)).toBeNull();
    expect(screen.getByText(industryData[1].name)).toBeInTheDocument();

    await act(() => deleteButtons[1].click());

    expect(screen.queryByText(industryData[0].name)).toBeNull();
    expect(screen.queryByText(industryData[1].name)).toBeNull();
  });
})

describe('Update functionality', () => {

  test('Save button triggers update function', async () => {
    renderIndustriesGrid();

    const editButtons = screen.getAllByTestId('edit-button');
    await act(() => editButtons[0].click());

    const saveButtons = screen.getAllByTestId('save-button', undefined, { timeout: 5000 });
    await act(() => saveButtons[0].click());

    expect(mockUpdateFunction).toHaveBeenCalledWith(industryData[0]);
  });

  test('Fields are updated when saved', async () => {
    renderIndustriesGrid();

    const newNameValue = 'new name value'

    const editButtons = screen.getAllByTestId('edit-button');
    await act(() => editButtons[0].click());

    const editableField = screen.getByDisplayValue(industryData[0].name)

    // update name typed in name field
    act(() => {
      userEvent.clear(editableField);
      userEvent.type(editableField, newNameValue);
    })

    const saveButtons = screen.getAllByTestId('save-button', undefined, { timeout: 5000 });
    await act(() => saveButtons[0].click());

    const { id, ...expectedData } = industryData[0]
    expect(mockUpdateFunction).toHaveBeenCalledWith({ id, name: newNameValue });
  });
});

describe('Create functionality', () => {

  test('Create button creates input cells', async () => {
    renderIndustriesGrid();

    const startInputElements = screen.queryAllByRole('textbox');

    // no editable cells
    expect(startInputElements.length).toBe(0);

    // click create
    const createButton = screen.getByTestId('create-button');
    await act(() => createButton.click());

    const endInputElements = screen.getAllByRole('textbox');

    // 1 editable cell
    expect(endInputElements.length).toBe(1);
  });

  test('Save button triggers create function', async () => {
    renderIndustriesGrid();
    mockCreateFunction.mockResolvedValue({ data: { insertId: 3 }, status: 200 })

    // click create
    const createButton = screen.getByTestId('create-button');
    await act(() => createButton.click());

    // type a name
    const inputNameElement = screen.getByRole('textbox');
    await act(() => { userEvent.type(inputNameElement, newRowData.name) })

    // click save
    const saveButton = screen.getByTestId('save-button');
    await act(() => {
      saveButton.click()
    });

    expect(mockCreateFunction).toHaveBeenCalledWith(newRowData);
  });
});

describe('Edit/Cancel Functionality', () => {

  test('Cancel button returns fields to display fields', async () => {
    renderIndustriesGrid();

    // name is shown as display field
    expect(screen.getByText(industryData[0].name)).toBeInTheDocument()

    const editButtons = screen.getAllByTestId('edit-button');
    await act(async () => editButtons[0].click());

    // name is shown as input field
    expect(screen.getByDisplayValue(industryData[0].name)).toBeInTheDocument()

    const cancelButton = screen.getByTestId('cancel-button')
    await act(async () => cancelButton.click());

    // name is shown as display field
    expect(screen.getByText(industryData[0].name)).toBeInTheDocument()
  });

  test('Cancel button removes row if it was new', async () => {
    renderIndustriesGrid();

    // click create
    const createButton = screen.getByTestId('create-button');
    await act(async () => createButton.click());

    // type a name
    const inputNameElement = screen.getByRole('textbox');
    await act(() => { userEvent.type(inputNameElement, newRowData.name) })

    // validate name has appeared
    expect(screen.getByDisplayValue(newRowData.name)).toBeInTheDocument()

    // click cancel
    const cancelButton = screen.getByTestId('cancel-button')
    fireEvent.click(cancelButton)

    // expect name not to appear anywhere as removed
    expect(screen.queryByDisplayValue(newRowData.name)).toBeNull()
  });
});
