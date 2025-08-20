/* eslint-disable react/no-unescaped-entities */
import Header from './components/header';
import Footer from './components/footer';
import Loading from './components/loading';
import useConstellation from '../hooks/useConstellation';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Alert, AlertTitle, Link } from '@mui/material';

const MessageCenter = () => {
  const [showPega, setShowPega] = useState('Info'); // Info, Pega, Confirmation
  const isPegaReady = useConstellation();

  useEffect(() => {
    if (isPegaReady) {
      (PCore.getMashupApi().openPage('pyWorklist', 'Data-Portal') as any).then(() => {});
      setShowPega('Pega');
      console.log('MessageCenter-IsPegaReady', isPegaReady);
    }
  }, [isPegaReady]);

  return (
    <>
      <Header />
      <div className='flex-grow dark:bg-gray-900'>
        <section className='bg-white py-6 md:py-8 dark:bg-gray-800'>
          <div className='container items-start justify-start gap-4 px-4 text-left md:px-6 lg:gap-6'>
            <Alert severity="success">
              <AlertTitle>PCore.getMashupApi().openPage()</AlertTitle>
              OOTB Landing page 'My Work' is rendered by Mashup API. <br/>
              Reference:
                <Link href="https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/openpage-pagename-classname-targetcontext.html" target="_blank" underline="hover">
                  https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/openpage-pagename-classname-targetcontext.html
                </Link>
            </Alert>
          </div>
          <div className='py-8 px-4 mx-auto max-w-screen-xl lg:px-6'>
            <div className='max-w-screen-md'>
              <h2 className='mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white'>Message Center</h2>
              <p className='mb-4 text-gray-700 text-lg dark:text-gray-400'>
                Your worklist
              </p>
            </div>
          </div>
        </section>
        <section className='bg-white dark:bg-gray-900'>
          <div className='py-4 px-4 mx-auto max-w-screen-xl text-center lg:py-8 lg:px-12'>
            {isPegaReady ? <div id='pega-root' className={classNames('', { hidden: showPega !== 'Pega' })} /> : <Loading />}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default MessageCenter;
