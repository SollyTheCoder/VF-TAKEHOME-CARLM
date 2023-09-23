/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IndustriesGrid from '../components/IndustriesGrid';

const mockDeleteFunction = jest.fn();
const mockUpdateFunction = jest.fn();
const mockCreateFunction = jest.fn();
const mockErrorMessageFunction = jest.fn();

const industryData = [{ id: 1, name: 'industry1' }, { id: 2, name: 'industry2' }]
const newRowData = { name: 'industry3' }

const renderIndustriesGrid = () => {
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

  test('delete button triggers delete function', () => {
    renderIndustriesGrid();
    const deleteButtons = screen.getAllByTestId('delete-button');
    deleteButtons.forEach((deleteButton, index) => {
      fireEvent.click(deleteButton);
      expect(mockDeleteFunction).toHaveBeenCalledWith(industryData[index].id);
    });
  });

  test('delete button removes deleted data', () => {
    renderIndustriesGrid();
    const deleteButtons = screen.getAllByTestId('delete-button');

    expect(screen.getByText(industryData[0].name)).toBeInTheDocument();
    expect(screen.getByText(industryData[1].name)).toBeInTheDocument();

    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText(industryData[0].name)).toBeNull();
    expect(screen.getByText(industryData[1].name)).toBeInTheDocument();

    fireEvent.click(deleteButtons[1]);

    expect(screen.queryByText(industryData[0].name)).toBeNull();
    expect(screen.queryByText(industryData[1].name)).toBeNull();
  });
});

describe('Update functionality', () => {

  test('Save button triggers update function', async () => {
    renderIndustriesGrid();

    // causes changes to state so much be wrapped in act
    const editButtons = screen.getAllByTestId('edit-button');
    await act(async () => editButtons[0].click());

    const saveButtons = screen.getAllByTestId('save-button', undefined, { timeout: 5000 });
    await act(async () => saveButtons[0].click());

    const { id, ...expectedData } = industryData[0]
    expect(mockUpdateFunction).toHaveBeenCalledWith(id, expectedData);
  });

  test('Fields are updated when saved', async () => {
    renderIndustriesGrid();

    const newNameValue = 'new name value'

    const editButtons = screen.getAllByTestId('edit-button');
    await act(async () => editButtons[0].click());

    const editableField = screen.getByDisplayValue(industryData[0].name)

    act(() => {
      userEvent.clear(editableField);
      userEvent.type(editableField, newNameValue);
    })

    const saveButtons = screen.getAllByTestId('save-button', undefined, { timeout: 5000 });
    await act(async () => saveButtons[0].click());

    const { id, ...expectedData } = industryData[0]
    expect(mockUpdateFunction).toHaveBeenCalledWith(id, { ...expectedData, name: newNameValue });
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
    await act(async () => createButton.click());

    const endInputElements = screen.getAllByRole('textbox');

    // 1 editable cell
    expect(endInputElements.length).toBe(1);

  });

  test('Save button triggers create function', async () => {
    renderIndustriesGrid();

    // click create
    const createButton = screen.getByTestId('create-button');
    await act(async () => createButton.click());

    // type a name
    const inputNameElement = screen.getByRole('textbox');
    act(() => { userEvent.type(inputNameElement, newRowData.name) })

    // click save
    const saveButtons = screen.getByTestId('save-button', undefined, { timeout: 5000 });
    await act(async () => saveButtons.click());

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
    console.log(inputNameElement)
    act(() => { userEvent.type(inputNameElement, newRowData.name) })

    // click cancel
    const cancelButton = screen.getByTestId('cancel-button')
    await act(async () => cancelButton.click());

    // expect name not to appear anywhere
    expect(screen.queryByDisplayValue(newRowData.name)).toBeNull()
    expect(screen.queryByText(newRowData.name)).toBeNull()
  });
});


