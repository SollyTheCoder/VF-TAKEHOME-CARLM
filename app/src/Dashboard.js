import {
  AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';
import * as React from 'react';
import EditableDevicesGrid from './components/EditableDevicesGrid';
import EditableIndustriesGrid from './components/EditableIndustriesGrid';
import { createDevice, createIndustry, deleteDevice, deleteIndustry, fetchDevices, fetchIndustries, updateDevice, updateIndustry } from './functions';

const drawerWidth = 240;

export default function Dashboard() {
  const pages = [
    { name: 'industries', icon: <FactoryIcon /> },
    { name: 'devices', icon: <DevicesIcon /> },
  ]

  const [selectedPage, setSelectedPage] = React.useState('industries')
  const [deviceData, setDeviceData] = React.useState([])
  const [industryData, setIndustryData] = React.useState([])
  const [industryDict, setIndustryDict] = React.useState({})

  const fetchData = async () => {
    const devicesResponse = await fetchDevices();
    const industriesResponse = await fetchIndustries();

    const industryDictionary = industriesResponse.reduce((dict, industry) => {
      dict[industry.name] = industry.id;
      return dict;
    }, {});

    setDeviceData(devicesResponse);
    setIndustryDict(industryDictionary);
    setIndustryData(industriesResponse);
  };

  React.useEffect(() => {
    fetchData();
  }, [selectedPage]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Business Management Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {pages.map((pageInfo, index) => (
              <ListItem key={pageInfo.name} disablePadding onClick={() => setSelectedPage(pageInfo.name)}>
                <ListItemButton>
                  <ListItemIcon>
                    {pageInfo.icon}
                  </ListItemIcon>
                  <ListItemText primary={pageInfo.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <text>{selectedPage}</text>
        {selectedPage === 'devices' ?
          <EditableDevicesGrid
            deviceData={deviceData}
            industryDict={industryDict}
            deleteFunction={deleteDevice}
            updateFunction={updateDevice}
            createFunction={createDevice}
          /> :
          <EditableIndustriesGrid
            industryData={industryData}
            deleteFunction={deleteIndustry}
            updateFunction={updateIndustry}
            createFunction={createIndustry}
          />}
      </Box>
    </Box>
  );
}
