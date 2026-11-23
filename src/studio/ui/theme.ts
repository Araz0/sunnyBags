import { createTheme } from '@mui/material'

export const makeStudioTheme = (dark: boolean) =>
  createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: { main: '#df4b4b', contrastText: '#ffffff' },
      secondary: { main: '#f2a93b' },
      success: { main: '#2f9e6b' },
      warning: { main: '#e08a1e' },
      background: dark
        ? { default: '#0f1115', paper: '#171a21' }
        : { default: '#f5f6f8', paper: '#ffffff' },
      divider: dark ? '#262a33' : '#e6e8ec',
      text: dark
        ? { primary: '#eceef2', secondary: '#9aa1ad' }
        : { primary: '#151820', secondary: '#626a78' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      h1: { fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h2: { fontSize: '1.15rem', fontWeight: 700 },
      h3: { fontSize: '1rem', fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 14 } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
      MuiTooltip: { defaultProps: { arrow: true } },
    },
  })
