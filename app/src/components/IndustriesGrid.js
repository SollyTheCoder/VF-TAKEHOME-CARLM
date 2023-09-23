import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import * as React from 'react';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, {
      id, name: '', isNew: true
    }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button data-testid='create-button' color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function IndustriesGrid({ industryData, deleteFunction, updateFunction, createFunction, showErrorMessage }) {

  const [rows, setRows] = React.useState(industryData);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(() => {
    setRows(industryData)
  }, [industryData])

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.escapeKeyDown ||
      params.reason === GridRowEditStopReasons.rowFocusOut ||
      params.reason === GridRowEditStopReasons.shiftTabKeyDown ||
      params.reason === GridRowEditStopReasons.tabKeyDown) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
    showErrorMessage('')
  };

  const handleDeleteClick = (id) => async () => {
    const { status } = await deleteFunction(id)
    if (status !== 200) return showErrorMessage('Delete attempt failed')
    setRows(rows.filter((row) => row.id !== id));
    showErrorMessage('')
  };

  const processRowUpdate = async (newRow) => {
    const { id, isNew, name } = newRow
    console.log('process: ' + name)
    const { data, status } = isNew ? await createFunction({ name }) : await updateFunction({ id, name })
    var updatedRow = { ...newRow, isNew: false };

    if (status !== 200) return showErrorMessage(data)

    if (newRow.isNew) {
      updatedRow = { ...updatedRow, id: data.insertId };
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    showErrorMessage('')
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
              data-testid="save-button"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              data-testid="cancel-button"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            data-testid="edit-button"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            data-testid="delete-button"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => { }}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
