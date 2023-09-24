import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';
import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DevicesGrid from './components/DevicesGrid';
import IndustriesGrid from './components/IndustriesGrid';

import { errorPage, homePage } from './constants';
import { ApiContext } from './context/ApiContextProvider';
import { axiosRequest } from './functions';

function App({ getData, initialData }) {
  const [appInfo, setAppInfo] = React.useState(initialData)
  const apiUrl = React.useContext(ApiContext)

  const updateData = async () => {
    const data = await getData(apiUrl)
    setAppInfo(data)
  }

  const [errorMessage, setErrorMessage] = React.useState('')

  const pages = {
    ...homePage,
    industries: {
      icon: <DevicesIcon />, content:
        <IndustriesGrid
          industryData={appInfo.industriesResponse?.data}
          deleteFunction={(id) => axiosRequest(`${apiUrl}/industry/${id}`, 'DELETE')}
          updateFunction={(data) => axiosRequest(`${apiUrl}/industry/${data.id}`, 'PUT', data)}
          createFunction={(body) => axiosRequest(`${apiUrl}/industry`, 'POST', body)}
          showErrorMessage={(message) => setErrorMessage(message)}
        />
    },
    devices: {
      icon: <FactoryIcon />, content:
        <DevicesGrid
          deviceData={appInfo.devicesResponse?.data}
          industryDict={appInfo.industriesDict}
          deleteFunction={(id) => axiosRequest(`${apiUrl}/device/${id}`, 'DELETE')}
          updateFunction={(data) => axiosRequest(`${apiUrl}/device/${data.id}`, 'PUT', data)}
          createFunction={(body) => axiosRequest(`${apiUrl}/device`, 'POST', body)}
          showErrorMessage={(message) => setErrorMessage(message)}
        />
    },
  }

  if (appInfo.fail) {
    return <Dashboard
      onPageChange={() => { }}
      pages={errorPage}
      name="Business Management Portal"
      errorMessage={'Backend Connection Failure'}
    />
  }

  return <Dashboard
    onPageChange={() => {
      updateData()
      setErrorMessage('')
    }}
    pages={pages}
    name="Business Management Portal"
    errorMessage={errorMessage}
  />
}

export default App;
