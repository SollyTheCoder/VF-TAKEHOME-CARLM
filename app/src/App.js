import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DevicesGrid from './components/DevicesGrid';
import IndustriesGrid from './components/IndustriesGrid';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';

import { axiosRequest } from './functions';
import { errorPage, homePage } from './constants';

function App() {

  const [deviceData, setDeviceData] = React.useState([])
  const [industryData, setIndustryData] = React.useState([])
  const [industryDict, setIndustryDict] = React.useState({})
  const [errorMessage, setErrorMessage] = React.useState('')
  const [applicationState, setApplicationState] = React.useState('loading')
  const apiUrl = 'http://localhost:5000'

  const pages = {
    ...homePage,
    industries: {
      icon: <DevicesIcon />, content:
        <IndustriesGrid
          industryData={industryData}
          deleteFunction={(id) => axiosRequest(`${apiUrl}/industry/${id}`, 'DELETE')}
          updateFunction={(data) => axiosRequest(`${apiUrl}/industry/${data.id}`, 'PUT', data)}
          createFunction={(body) => axiosRequest(`${apiUrl}/industry`, 'POST', body)}
          showErrorMessage={(message) => setErrorMessage(message)}
        />
    },
    devices: {
      icon: <FactoryIcon />, content:
        <DevicesGrid
          deviceData={deviceData}
          industryDict={industryDict}
          deleteFunction={(id) => axiosRequest(`${apiUrl}/device/${id}`, 'DELETE')}
          updateFunction={(data) => axiosRequest(`${apiUrl}/device/${data.id}`, 'PUT', data)}
          createFunction={(body) => axiosRequest(`${apiUrl}/device`, 'POST', body)}
          showErrorMessage={(message) => setErrorMessage(message)}
        />
    },
  }

  const fetchData = async () => {
    try {
      const devicesResponse = await axiosRequest(`${apiUrl}/device`, 'GET');
      const industriesResponse = await axiosRequest(`${apiUrl}/industry`, 'GET');
      setDeviceData(devicesResponse.data);
      setIndustryData(industriesResponse.data);
      setIndustryDict(industriesResponse.data.reduce((dict, industry) => {
        dict[industry.id] = industry.name;
        return dict;
      }, {}));
      setApplicationState('loaded')
    } catch (e) {
      console.log(e)
      setApplicationState('failure')
    }
  };

  React.useEffect(() => {
    fetchData()
  }, []);

  if (applicationState === 'loading') {
    return <p>The page is loading</p>
  }

  if (applicationState === 'failure') {
    return <Dashboard
      onPageChange={() => { }}
      pages={errorPage}
      name="Business Management Portal"
      errorMessage={'Backend Connection Failure'}
    />
  }

  if (applicationState === 'loaded') {
    return <Dashboard
      onPageChange={() => {
        fetchData()
      }}
      pages={pages}
      name="Business Management Portal"
      errorMessage={errorMessage}
    />
  }
}



export default App;
