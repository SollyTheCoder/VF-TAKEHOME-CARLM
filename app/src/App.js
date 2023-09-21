import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import EditableGrid from './components/EditableGrid';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';
import { axiosRequest } from './functions';

function App() {

  const [deviceData, setDeviceData] = React.useState([])
  const [industryData, setIndustryData] = React.useState([])
  const [industryDict, setIndustryDict] = React.useState({})
  const apiUrl = 'http://localhost:5000'

  const pages = {
    industries: {
      icon: <DevicesIcon />, content:
        <EditableGrid
          listData={industryData}
          deleteFunction={(id) => axiosRequest(`${apiUrl}/industry/${id}`, 'DELETE')}
          updateFunction={(id, body) => axiosRequest(`${apiUrl}/industry/${id}`, 'PUT', body)}
          createFunction={(body) => axiosRequest(`${apiUrl}/industry`, 'POST', body)}
          fieldConfig={[{ field: 'name', headerName: 'Name', width: 180, editable: true }]}
          newRowObject={{
            name: '',
          }}
        />
    },
    devices: {
      icon: <FactoryIcon />, content:
        <EditableGrid
          listData={deviceData}
          deleteFunction={(id) => axiosRequest(`${apiUrl}/device/${id}`, 'DELETE')}
          updateFunction={(id, body) => axiosRequest(`${apiUrl}/device/${id}`, 'PUT', body)}
          createFunction={(body) => axiosRequest(`${apiUrl}/device`, 'POST', body)}
          fieldConfig={[{ field: 'name', headerName: 'Name', width: 180, editable: true },
          { field: 'warehouse_addition_time', headerName: 'Warehouse Addition Time', type: 'number', width: 200, align: 'left', headerAlign: 'left', editable: true, },
          { field: 'fee', headerName: 'Fee', type: 'number', width: 80, editable: true, },
          {
            field: 'linked_industry', headerName: 'Industry', width: 220, editable: true, type: 'singleSelect',
            valueOptions: Object.values(industryDict),
            valueGetter: (params) => {
              const intValue = params.row.linked_industry;
              return industryDict[intValue];
            },
            valueSetter: (params) => {
              const intValue = Object.entries(industryDict).find(([key, value]) => value === params.value);
              if (intValue) {
                params.row.linked_industry = intValue[0];
              }
              return params.row
            },
          }]}
          newRowObject={{
            name: '',
            warehouse_addition_time: '',
            fee: '',
            linked_industry: Object.keys(industryDict)[0]
          }}
        />
    }
  }

  const fetchData = async () => {
    const devicesResponse = await axiosRequest(`${apiUrl}/device`, 'GET');
    const industriesResponse = await axiosRequest(`${apiUrl}/industry`, 'GET');
    const industryDictionary = industriesResponse.reduce((dict, industry) => {
      dict[industry.id] = industry.name;
      return dict;
    }, {});

    setDeviceData(devicesResponse);
    setIndustryData(industriesResponse);
    setIndustryDict(industryDictionary);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return <Dashboard
    onPageChange={() => fetchData()}
    pages={pages}
    name="Business Management Portal"
  />
}

export default App;
