/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableGrid from '../components/EditableGrid';

const mockDeleteFunction = jest.fn();
const mockUpdateFunction = jest.fn();
const mockCreateFunction = jest.fn();

const industryData = [{ id: 1, name: 'industry1' }, { id: 2, name: 'industry2' }]
const industryFields = [{ field: 'name', headerName: 'Name', width: 180, editable: true, cellClassName: 'nameField' }]
const industryNewObject = { name: 'starting name' }

const renderEditableGrid = () => {
  return render(
    <EditableGrid
      listData={industryData}
      deleteFunction={mockDeleteFunction}
      updateFunction={mockUpdateFunction}
      createFunction={mockCreateFunction}
      fieldConfig={industryFields}
      newRowObject={industryNewObject}
    />
  );
};

test('renders the EditableGrid component with given data present', () => {
  renderEditableGrid()

  industryData.forEach((value) => {
    expect(screen.getByText(value.name)).toBeInTheDocument()
  })
});

describe('Delete functionality', () => {

  test('delete button triggers delete function', () => {
    renderEditableGrid();
    const deleteButtons = screen.getAllByTestId('delete-button');
    deleteButtons.forEach((deleteButton, index) => {
      fireEvent.click(deleteButton);
      expect(mockDeleteFunction).toHaveBeenCalledWith(industryData[index].id);
    });
  });

  test('delete button removes deleted data', () => {
    renderEditableGrid();
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
    renderEditableGrid();

    // causes changes to state so much be wrapped in act
    const editButtons = screen.getAllByTestId('edit-button');
    await act(async () => editButtons[0].click());

    const saveButtons = screen.getAllByTestId('save-button', undefined, { timeout: 5000 });
    await act(async () => saveButtons[0].click());

    expect(mockUpdateFunction).toHaveBeenCalledWith(industryData[0]);
  });

  test('Fields are updated when saved', async () => {
    renderEditableGrid();

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

    expect(mockUpdateFunction).toHaveBeenCalledWith({ ...industryData[0], name: newNameValue });
  });
});

describe('Create functionality', () => {

  test('Create button creates new row with new starting values', async () => {
    renderEditableGrid();

    const createButton = screen.getByTestId('create-button');
    await act(async () => createButton.click());

    expect(screen.getByDisplayValue(industryNewObject.name)).toBeInTheDocument()
  });

  test('Save button triggers create function', async () => {
    renderEditableGrid();

    const createButton = screen.getByTestId('create-button');
    await act(async () => createButton.click());

    const saveButtons = screen.getByTestId('save-button', undefined, { timeout: 5000 });
    await act(async () => saveButtons.click());

    expect(mockCreateFunction).toHaveBeenCalledWith({ name: industryNewObject.name });
  });

});

describe('Edit/Cancel Functionality', () => {

  test('Cancel button returns fields to display fields', async () => {
    renderEditableGrid();

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
    renderEditableGrid();

    const createButton = screen.getByTestId('create-button');
    await act(async () => createButton.click());

    const cancelButton = screen.getByTestId('cancel-button')
    await act(async () => cancelButton.click());

    // expect name not to appear anywhere
    expect(screen.queryByDisplayValue(industryNewObject.name)).toBeNull()
    expect(screen.queryByText(industryNewObject.name)).toBeNull()
  });
});


