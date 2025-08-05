import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material'
import { grey, blue } from '@mui/material/colors'

const darkTheme = createTheme({
  palette: {
    primary: {
      main: grey[800], // Set your primary color here
    },
    secondary: {
      main: blue[500], // Set your secondary color here
    },
  },
})

// Handle URL restoration from 404.html redirect
const urlParams = new URLSearchParams(window.location.search);
const redirectPath = urlParams.get('redirect');
if (redirectPath) {
    // Clean up the URL and navigate to the original path
    window.history.replaceState({}, '', redirectPath);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
