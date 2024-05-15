import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1e88e5',
    accent: '#f1c40f',
    background: '#121212',
    surface: '#333333',
    text: '#ffffff',
  },
};

// Then wrap your app in PaperProvider with the theme prop:
<PaperProvider theme={theme}>
  <App />
</PaperProvider>