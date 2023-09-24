/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DevicesGrid from '../components/DevicesGrid';

const mockDeleteFunction = jest.fn();
const mockUpdateFunction = jest.fn();
const mockCreateFunction = jest.fn();
const mockErrorMessageFunction = jest.fn();

const industryDict = { 4: 'industry1', 7: 'industry2' }
const deviceData = [
  { id: 1, name: 'device1', warehouse_addition_time: 2, fee: 3, linked_industry: 4 },
  { id: 2, name: 'device2', warehouse_addition_time: 5, fee: 6, linked_industry: 7 },
]
const newRowData = { name: 'device3', warehouse_addition_time: 8, fee: 9, linked_industry: 7 }

const renderDevicesGrid = () => {
  mockDeleteFunction.mockResolvedValue({ data: {}, status: 200 })
  mockUpdateFunction.mockResolvedValue({ data: {}, status: 200 })
  mockCreateFunction.mockResolvedValue({ data: {}, status: 200 })
  return render(
    <DevicesGrid
      deviceData={deviceData}
      industryDict={industryDict}
      deleteFunction={mockDeleteFunction}
      updateFunction={mockUpdateFunction}
      createFunction={mockCreateFunction}
      showErrorMessage={mockErrorMessageFunction}
    />
  );
};

test('renders the EditableGrid component with given data present', () => {
  renderDevicesGrid()
  deviceData.forEach((value) => {
    expect(screen.getByText(value.name)).toBeInTheDocument()
    expect(screen.getByText(industryDict[value.linked_industry])).toBeInTheDocument()
  })
});

describe('Delete functionality', () => {

  test('delete button triggers delete function', async () => {
    renderDevicesGrid();

    const deleteButtons = screen.getAllByTestId("delete-button");

    await act(() => deleteButtons[0].click());
    expect(mockDeleteFunction).toHaveBeenCalledWith(deviceData[0].id);
  });


  test('delete button removes deleted data', async () => {
    renderDevicesGrid();

    const deleteButtons = screen.getAllByTestId('delete-button');

    expect(screen.getByText(deviceData[0].name)).toBeInTheDocument();
    expect(screen.getByText(deviceData[1].name)).toBeInTheDocument();

    await act(() => deleteButtons[0].click());

    expect(screen.queryByText(deviceData[0].name)).toBeNull();
    expect(screen.getByText(deviceData[1].name)).toBeInTheDocument();

    await act(() => deleteButtons[1].click());

    expect(screen.queryByText(deviceData[0].name)).toBeNull();
    expect(screen.queryByText(deviceData[1].name)).toBeNull();
  });
})

describe('Update functionality', () => {

  test('Save button triggers update function', async () => {
    renderDevicesGrid();

    const editButtons = screen.getAllByTestId('edit-button');
    await act(() => editButtons[0].click());

    const saveButtons = screen.getAllByTestId('save-button');
    await act(() => saveButtons[0].click());

    expect(mockUpdateFunction).toHaveBeenCalledWith(deviceData[0]);
  });

  test('Fields are updated when saved', async () => {
    renderDevicesGrid();

    const newNameValue = 'new name value'

    const editButtons = screen.getAllByTestId('edit-button');
    await act(() => editButtons[0].click());

    const editableField = screen.getByDisplayValue(deviceData[0].name)

    // update name typed in name field
    act(() => {
      userEvent.clear(editableField);
      userEvent.type(editableField, newNameValue);
    })

    const saveButtons = screen.getAllByTestId('save-button', undefined, { timeout: 5000 });
    await act(() => saveButtons[0].click());

    const { id, ...expectedData } = deviceData[0]
    expect(mockUpdateFunction).toHaveBeenCalledWith({ id, ...expectedData, name: newNameValue });
  });
});

describe('Create functionality', () => {

  test('Create button creates input cells', async () => {
    renderDevicesGrid();

    const startInputElements = screen.queryAllByRole('textbox');

    // no editable cells
    expect(startInputElements.length).toBe(0);

    // click create
    const createButton = screen.getByTestId('create-button');
    await act(() => createButton.click());

    const nameInput = screen.getAllByRole('textbox');
    const numberInputs = screen.getAllByRole('spinbutton');

    expect(nameInput.length).toBe(1);
    expect(numberInputs.length).toBe(2);
  });

  test('Save button triggers create function', async () => {
    renderDevicesGrid();
    mockCreateFunction.mockResolvedValue({ data: { insertId: 3 }, status: 200 })
    // click create
    const createButton = screen.getByTestId('create-button');
    await act(() => createButton.click());

    // type a name
    const inputNameElement = screen.getByRole('textbox');
    await act(() => { userEvent.type(inputNameElement, newRowData.name) })

    // enter numbers
    const numberInputs = screen.getAllByRole('spinbutton');
    await act(() => { userEvent.type(numberInputs[0], newRowData.warehouse_addition_time.toString()) })
    await act(() => { userEvent.type(numberInputs[1], newRowData.fee.toString()) })

    // click save
    const saveButton = screen.getByTestId('save-button');
    await act(() => {
      saveButton.click()
    });

    expect(mockCreateFunction).toHaveBeenCalledWith({ ...newRowData, linked_industry: '' });
  });
});

describe('Edit/Cancel Functionality', () => {

  test('Cancel button returns fields to display fields', async () => {
    renderDevicesGrid();

    // name is shown as display field
    expect(screen.getByText(deviceData[0].name)).toBeInTheDocument()

    const editButtons = screen.getAllByTestId('edit-button');
    await act(async () => editButtons[0].click());

    // name is shown as input field
    expect(screen.getByDisplayValue(deviceData[0].name)).toBeInTheDocument()

    const cancelButton = screen.getByTestId('cancel-button')
    await act(async () => cancelButton.click());

    // name is shown as display field
    expect(screen.getByText(deviceData[0].name)).toBeInTheDocument()
  });


  test('Cancel button removes row if it was new', async () => {
    renderDevicesGrid();

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
