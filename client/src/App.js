import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles';
import { indigo, amber, grey, deepPurple, red } from '@mui/material/colors';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PharmacyPage from './pages/PharmacyPage';


// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: red, // 主色
    secondary: amber, // 次要色
    error: {
      main: deepPurple[500], // 错误状态颜色
    },
    background: {
      default: grey[100], // 默认背景颜色
      paper: grey[200], // 纸张背景颜色
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // 全局字体设置
    h1: {
      fontSize: '2.2rem', // 不同标题的字体大小
    },
    body1: {
      fontSize: '1rem', // 正文字体大小
    },
  },
  components: {
    // 特定组件样式定制
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 按钮圆角大小
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // 移除导航栏的阴影
        },
      },
    },
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
          {/* <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/songs" element={<SongsPage />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}