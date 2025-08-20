import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import { Button } from '../design-system/ui/button';
import { Alert, AlertTitle, Link } from '@mui/material';

type AvailabilityPage = {
  IsAvailable: boolean | 'true' | 'false';
  pzLoadTime?: string;
  pzPageNameHash?: string;
};

export default function Availability() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { page?: AvailabilityPage; address?: string; error?: string };
  };

  // If user navigated here directly or refreshed without state:
  if (!state?.page && !state?.error) {
    return (
      <>
        <Header />
        <div className='flex-grow dark:bg-gray-900'>
          <section className='w-full py-6 md:py-8'>
            <div className='container grid items-start gap-4 px-4 text-center md:px-6 lg:gap-6'>
              <div className='p-6 space-y-2'>
                <p>No data to display. Please check an address first.</p>
                <Button variant='default' className='underline' onClick={() => navigate('/')}>
                  Go back
                </Button>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  const data = state?.page;
  const raw = data?.IsAvailable;
  const isAvailable = typeof raw === 'boolean' ? raw : String(raw).toLowerCase() === 'true';

  return (
    <>
      <Header />
      <div className='flex-grow dark:bg-gray-900'>
        <section className='w-full py-6 md:py-8'>
          <div className='container items-start justify-start gap-4 px-4 text-left md:px-6 lg:gap-6'>
            <Alert severity='success'>
              <AlertTitle>PCore.getDataPageUtils().getPageDataAsync()</AlertTitle>
              The cable service availability is returned from a Data Page plain property directly. <br />
              Reference:
              <Link
                href='https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/getpagedataasync-datapagename-context-parameters-options.html'
                target='_blank'
                underline='hover'
              >
                https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/getpagedataasync-datapagename-context-parameters-options.html
              </Link>
            </Alert>
          </div>
          <div className='container grid items-start gap-4 px-4 text-center md:px-6 lg:gap-6'>
            <div className='p-6 space-y-4'>
              <h1 className='text-2xl font-semibold'>Service Availability Report</h1>
              {state?.address && (
                <p>
                  <strong>Your address:</strong> {state.address}
                </p>
              )}

              {state?.error ? (
                <p className='text-red-600'>{state.error}</p>
              ) : (
                <>
                  <p>
                    <strong>Our services are available in your area:</strong> {isAvailable ? 'Yes ✅' : 'No ❌'}
                  </p>
                  <div className='items-start justify-start gap-4 px-4 text-left md:px-6 lg:gap-6'>
                    <p className='font-medium'>Raw response:</p>
                    <pre className='bg-gray-100 p-3 rounded'>{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </>
              )}
            </div>
            <div className='flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4'>
              <Button variant='default' onClick={() => navigate('/package')}>
                Shop Package
              </Button>
              <Button variant='secondary' onClick={() => navigate('/')}>
                Go back
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
