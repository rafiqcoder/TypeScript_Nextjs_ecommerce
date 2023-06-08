import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => {
      NProgress.start();
    };

    const handleComplete = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
    };
  }, [router]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#bd8326',
      },
    },
    typography: {
      fontFamily: 'Work Sans, sans-serif',
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      {!loading && (
        <>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            closeOnClick
            pauseOnHover
            draggable={true}
            position="top-right"
            toastClassName=""
            bodyClassName=""
            progressClassName=""
            pauseOnFocusLoss={true}
            newestOnTop={true}
            theme="colored"
          />
        </>
      )}
    </StyledEngineProvider>
  );
}

export default MyApp;
