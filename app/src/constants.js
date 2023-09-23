import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';

export const errorPage = {
  error: {
    icon: <ErrorIcon />, content:
      <p>There appears to be a backend connection issue at the moment, please refresh the page or investigate the issue</p>
  }
}

export const homePage = {
  home: {
    icon: <HomeIcon />, content:
      <p>Welcome to your management portal! From here you are able to perform CRUD operations on industries and devices in your backend</p>
  }
}