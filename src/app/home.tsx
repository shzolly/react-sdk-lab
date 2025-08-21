import Header from './components/header';
import Footer from './components/footer';
import { useNavigate } from 'react-router';
import { Button } from '../design-system/ui/button';
import { TextField, Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Loading from './components/loading';
import { IPromotion } from '../types/types';
import useConstellation from '../hooks/useConstellation';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { version as reactVersion } from 'react';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';

export default function Home() {
  const [showPega, setShowPega] = useState('Info'); // Info, Pega, Confirmation
  const isPegaReady = useConstellation();
  // NEW state to control the popup
  const [openDialog, setOpenDialog] = useState(true);

  const [appName, setAppName] = useState<string>('');
  const [sdkVersion, setSDKVersion] = useState<string>('');
  const [authService, setAuthService] = useState<string>('');
  const [mashupGrantType, setMashupAuthType] = useState<string>('');
  const [promotion, setPromotion] = useState<IPromotion[]>([]);
  useEffect(() => {
    setShowPega('Pega');
    getSdkConfig().then((sdk: any) => {
      const a = sdk?.authConfig || {};
      setAuthService(a.authService || '');
      setMashupAuthType(a.mashupGrantType || '');
    });
    if (isPegaReady) {
      const label = PCore.getEnvironmentInfo().getApplicationLabel();
      if (label) setAppName(label);
      const version = PCore.getPCoreVersion();
      if (version) setSDKVersion(version);

      const dataViewName = 'D_PromotionList';
      const parameters = {};
      const paging = {
        pageNumber: 1,
        pageSize: 30
      };
      const query = {
        distinctResultsOnly: true,
        select: [
          {
            field: 'PromotionCode'
          },
          {
            field: 'PromotionName'
          },
          {
            field: 'ApplicableServices'
          },
          {
            field: 'EligibilityCriteria'
          },
          {
            field: 'DiscountType'
          },
          {
            field: 'DiscountValue'
          },
          {
            field: 'TermsAndConditions'
          },
          {
            field: 'pyGUID'
          }
        ]
      };

      (PCore.getDataPageUtils().getDataAsync(dataViewName, 'root', parameters, paging, query) as Promise<any>)
        .then(response => {
          // console.log('DataPageUtils.getDataAsync response', response);
          setPromotion(response.data);
        })
        .catch(error => {
          throw new Error('Error', error);
        });
    }
  }, [isPegaReady]);

  const navigate = useNavigate();
  const [yourAddress, setYourAddress] = useState('742 Evergreen Terrace, Springfield, IL 62704');

  const handleCheckAvailability = async () => {
    if (isPegaReady) {
      const dataViewName = 'D_CheckAvailability';
      const parameters = {
        address: yourAddress
      };
      const context = 'app/primary_1';
      const options = {
        invalidateCache: true
      };
      PCore.getDataPageUtils()
        .getPageDataAsync(dataViewName, context, parameters, options)
        .then(page => {
          // handle the response
          // console.log('getPageDataAsync response: ', page);
          navigate('/availability', { state: { page, address: yourAddress } });
        })
        .catch(error => {
          // console.log(error);
          throw new Error('Error', error);
          navigate('/availability', { state: { error: 'Failed to fetch', address: yourAddress } });
        });
    }
  };

  function handleCreateCase(promotionCode: string) {
    // Pass parameters in query string
    navigate(`/newservice?promotionCode=${encodeURIComponent(promotionCode)}`);
  }

  return (
    <>
      <Header />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Welcome to {appName}! 👋</DialogTitle>
        <DialogContent dividers>
          <Typography variant='h6' gutterBottom>
            Environment snapshot:
          </Typography>
          <Typography variant='body1'>
            React version: <strong>{reactVersion}</strong>
            <br />
            Pega Constellation SDK version: <strong>{sdkVersion}</strong>
            <br />
            Auth service: <strong>{authService}</strong>
            <br />
            Mashup grant type: <strong>{mashupGrantType}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenDialog(false)}>Close</MuiButton>
        </DialogActions>
      </Dialog>
      <div className='flex-grow bg-white text-black'>
        <section className='bg-white py-3 md:py-4 dark:bg-gray-900'>
          <div className='pt-8 pb-6 px-4 mx-auto max-w-screen-xl text-center lg:pt-12 lg:pb-8 lg:px-12'>
            <a
              href='#'
              className='inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            >
              <span className='text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3'>Announcements</span>{' '}
              <span className='text-sm font-medium'>MediaCo+ v1.0 built on react-sdk v24.2.11 is released on 8/19/2025.</span>
              <svg className='ml-2 w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </a>
            <h1 className='mb-4 text-3xl lg:text-4xl font-bold lg:font-extrabold lg:tracking-tight tracking-tighter leading-none text-gray-900 dark:text-white'>
              Welcome to the project of {appName} - the enhanced version of Pega Constellation SDK Sample application!
            </h1>
            <p className='mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>
              This project is made to support your development of using customized UI in Constellation architecture. There are various techniques for
              your references, you can use it as a jump start. Pull requests are welcome!
            </p>
            <div className='flex flex-col mb-4 lg:mb-8 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4'>
              <Box sx={{ width: 500, maxWidth: '100%' }}>
                <TextField
                  size='small'
                  fullWidth
                  value={yourAddress}
                  onChange={e => setYourAddress(e.target.value)}
                  label='Your street address'
                  id='yourAddress'
                />
              </Box>
              <Button variant='default' onClick={handleCheckAvailability}>
                Check availability
                <svg className='ml-2 -mr-1 w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </Button>
            </div>
            <Divider />
          </div>
        </section>
        <section className='bg-white dark:bg-gray-900'>
          <div className='py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-8 lg:px-6'>
            <div className='mx-auto max-w-screen-sm'>
              <h2 className='mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white'>Internet Service Built for You</h2>
              <p className='mb-4 font-light text-gray-500 lg:mb-8 text-xl dark:text-gray-400'>
                Explore affordable Internet plans designed for speed and reliability.
              </p>
            </div>
            <div className='grid mb-8 lg:mb-12 lg:grid-cols-4 gap-8'>
              {promotion.map(item => (
                <figure
                  key={item.pyGUID}
                  className='flex flex-col justify-center items-center p-8 rounded-lg text-left bg-gray-50 border-b border-gray-200 md:p-12 lg:border-r dark:bg-gray-800 dark:border-gray-700
             hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out'
                >
                  <blockquote className='mx-auto mb-8 max-w-2xl text-gray-900 dark:text-white'>
                    <Typography variant='overline' sx={{ letterSpacing: 1.2 }} color='text.secondary'>
                      Code: {item.PromotionCode}
                    </Typography>
                    <Typography variant='h5' fontWeight={700} gutterBottom>
                      {item.PromotionName}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' mb={2}>
                      {item.ApplicableServices}
                    </Typography>
                    <Box display='flex' alignItems='flex-end' columnGap={1} mb={2}>
                      <Typography variant='h4' fontWeight={800} lineHeight={1}>
                        {item.DiscountValue}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {item.DiscountType}
                      </Typography>
                    </Box>
                    <Divider>Terms</Divider>
                    <Typography variant='caption' color='text.secondary' display='block' mt={1}>
                      {item.EligibilityCriteria} {item.TermsAndConditions}
                    </Typography>
                  </blockquote>
                  <figcaption className='flex justify-center items-center space-x-3'>
                    <div className='space-y-0.5 font-medium dark:text-white text-left'>
                      <Button variant='default' onClick={() => handleCreateCase(item.PromotionCode)}>
                        New Service
                      </Button>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        <section className='bg-white dark:bg-gray-900'>
          <div className='py-2 px-2 mx-auto max-w-screen-xl text-center'>
            {isPegaReady ? <div id='pega-root' className={classNames('', { hidden: showPega !== 'Pega' })} /> : <Loading />}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
