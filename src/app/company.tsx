import Header from './components/header';
import Footer from './components/footer';
import useConstellation from '../hooks/useConstellation';
import { useEffect, useState } from 'react';
import { IJourney, ApiResponse } from '../types/types';
import Loading from './components/loading';
import { Alert, AlertTitle, Link } from '@mui/material';

const Company = () => {
  const isPegaReady = useConstellation();
  const [journeys, setJourneys] = useState<IJourney[]>([]);
  const [appName, setAppName] = useState<string>("");

  console.log('IsPegaReady', isPegaReady);

  useEffect(() => {
    if (!isPegaReady) return;

    const name = PCore.getEnvironmentInfo().getApplicationLabel();
    if (name) setAppName(name);

    (async () => {
      const code = '1';
      const endpointUrl = `/api/MediaCoPlus/v1/country/${code}`;
      const { invokeCustomRestApi } = PCore.getRestClient();
      const res = (await invokeCustomRestApi(
        endpointUrl,
        { method: 'POST', body: {}, headers: {}, withoutDefaultHeaders: false },
        'companyjourney'
      )) as ApiResponse<IJourney[]>;

      setJourneys(res.data);
    })().catch(err => console.log('invokeCustomRestApi error:', err));
  }, [isPegaReady]);

  return (
    <>
      <Header />
      <div className='flex-grow dark:bg-gray-900'>
        <section className='w-full py-6 md:py-8'>
          <div className='container items-start justify-start gap-4 px-4 text-left md:px-6 lg:gap-6'>
            <Alert severity="success">
              <AlertTitle>PCore.getRestClient().invokeCustomRestApi()</AlertTitle>
              The Company Journey items are rendered from a Data Page wrapped by a custom Service REST. <br/>
              Reference:
                <Link href="https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/invokecustomrestapi-endpointurl-config-context.html" target="_blank" underline="hover">
                  https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/invokecustomrestapi-endpointurl-config-context.html
                </Link>
            </Alert>
          </div>
          <div className='container grid items-start justify-start gap-4 px-4 text-left md:px-6 lg:gap-6'>
            <div className='space-y-2'>
              <h2 className='text-4xl py-4 font-bold tracking-tighter  md:text-3xl'>{appName} company journey</h2>
            </div>
          </div>
        </section>
      </div>
      {isPegaReady ? (
        <div className='flex-grow dark:bg-gray-900'>
          {journeys.map(journey => (
            <section key={journey.pyGUID} className='w-full py-12 md:py-16 '>
              <div className='container px-4 md:px-6'>
                <div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
                  <div className='space-y-4'>
                    <div className='inline-block rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700'>{journey.Label}</div>
                    <h2 className='text-3xl font-bold tracking-tighter  md:text-5xl'>{journey.Title}</h2>
                    <p className='max-w-[600px] text-lg text-gray-500 md:text-xl/relaxed  dark:text-gray-400'>{journey.Content}</p>
                  </div>
                  <img
                    alt={journey.Title}
                    className='mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full'
                    height={200}
                    src={journey.ImageURL}
                    width={300}
                  />
                </div>
              </div>
            </section>
          ))}
          <div id='pega-root' />
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </>
  );
};

export default Company;
