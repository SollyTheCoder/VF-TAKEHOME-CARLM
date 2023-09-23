import {
  AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';

import * as React from 'react';

const drawerWidth = 240;

export default function Dashboard({ onPageChange, pages, name, errorMessage }) {
  const [selectedPage, setSelectedPage] = React.useState(Object.keys(pages)[0])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {name}
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
            {Object.keys(pages).map((pageName) => (
              <ListItem key={pageName} disablePadding onClick={() => {
                setSelectedPage(pageName)
                onPageChange()
              }}>
                <ListItemButton>
                  <ListItemIcon>
                    {pages[pageName].icon}
                  </ListItemIcon>
                  <ListItemText primary={pageName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {errorMessage !== '' && <Alert severity="error">{errorMessage}</Alert>}
        <br></br>
        {pages[selectedPage]?.content || <p>invalid page</p>}
      </Box>
    </Box>
  );
}
