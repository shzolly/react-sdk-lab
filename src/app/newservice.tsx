/* eslint-disable no-console */
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from '@mui/material';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import useConstellation from '../hooks/useConstellation';
import Loading from './components/loading';
import Header from './components/header';
import Footer from './components/footer';

const RELOAD_GUARD_KEY = 'ns_newservice_reloaded_once';

export default function NewService() {
  const [searchParams] = useSearchParams();
  const promotionCode = searchParams.get('promotionCode');

  const [showPega, setShowPega] = useState('Info'); // Info, Pega, Confirmation
  const [caseId, setCaseId] = useState('');
  const [hasRendered, setHasRendered] = useState(false);
  const [reloading, setReloading] = useState(false);
  const isPegaReady = useConstellation();

  useEffect(() => {
    if (!isPegaReady) return;

    getSdkConfig().then(sdkConfig => {
      let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;
      console.log('mashupCaseType from config: ', mashupCaseType);
      if (!mashupCaseType) {
        const caseTypes = (PCore.getEnvironmentInfo() as any).environmentInfoObject.pyCaseTypeList;
        mashupCaseType = caseTypes[1].pyWorkTypeImplementationClassName;
        console.log('mashupCaseType from env: ', mashupCaseType);
      }

      const handleCaseComplete = eventPayload => {
        setShowPega('Confirmation');
        setCaseId(eventPayload.caseID.split(' ')[1]);
      };

      const handleCaseCancel = () => {
        console.log('Case Cancelled');
        setShowPega('Info');
      };

      const options: any = {
        pageName: 'pyEmbedAssignment',
        startingFields: {
          PromotionCode: promotionCode
        }
      };

      setShowPega('Pega');
      (PCore.getMashupApi().createCase(mashupCaseType, PCore.getConstants().APP.APP, options) as any).then(() => {
        console.log('createCase rendering is complete');
      });

      const constants = PCore.getConstants();

      PCore.getPubSubUtils().subscribe(constants.PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING, handleCaseComplete, 'CaseComplete');
      PCore.getPubSubUtils().subscribe(constants.PUB_SUB_EVENTS.EVENT_CANCEL, handleCaseCancel, 'CaseCancel');
    });
  }, [isPegaReady, promotionCode]);

  // Watch #pega-root and mark hasRendered=true as soon as anything is inserted
  useEffect(() => {
    if (!isPegaReady) return;

    const target = document.getElementById('pega-root');
    if (!target) return;

    // If content is already there, mark rendered and bail
    if (target.childElementCount > 0) {
      setHasRendered(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (target.childElementCount > 0) {
        setHasRendered(true);
      }
    });

    observer.observe(target, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isPegaReady]);

  // Fallback: reload the page if nothing rendered after RELOAD_DELAY_MS (only once)
  useEffect(() => {
    if (!isPegaReady) return;
    if (hasRendered) {
      sessionStorage.removeItem(RELOAD_GUARD_KEY);
      return;
    }

    if (sessionStorage.getItem(RELOAD_GUARD_KEY) === 'yes') return;

    const t = window.setTimeout(() => {
      if (!hasRendered) {
        sessionStorage.setItem(RELOAD_GUARD_KEY, 'yes');
        setReloading(true);

        // Small delay so React has time to render the message
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    }, 0);

    return () => window.clearTimeout(t);
  }, [isPegaReady, hasRendered]);

  return (
    <>
      <Header />

      <div className="flex-grow">
        <section className="bg-white dark:bg-gray-800">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:px-6">
            <div className='max-w-screen-md'>
              <h2 className='mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white'>New Service</h2>
              <p className='mb-8 text-gray-700 text-lg dark:text-gray-400'>
                It shall take only couple of minutes to complete.
                {reloading && (
                  <Loading />
                )}
              </p>
              <div
                id='newservice-info'
                className={classNames(
                  'flex flex-col flex-wrap mb-8 md:mb-16 space-y-4 md:flex-row md:justify-start justify-center md:space-y-0 md:space-x-4',
                  {
                    hidden: showPega === 'Confirmation' || showPega === 'Pega'
                  }
                )}
              >
                <Link href="#" underline="always">
                  Go Back
                </Link>
              </div>
              <div className='flex flex-row align-middle items-center justify-center'>
                {isPegaReady ? (
                  <div
                    id='pega-root'
                    className={classNames('flex-grow w-full max-w-3xl', { hidden: showPega === 'Confirmation' || showPega === 'Info' })}
                  />
                ) : (
                  <Loading />
                )}
              </div>
              <div
                id='newservice-confirmation'
                className={classNames('flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4', {
                  hidden: showPega === 'Info' || showPega === 'Pega'
                })}
              >
                <div className='mb-8 mx-6 md:mx-12 font-normal text-gray-700 text-lg dark:text-gray-400'>
                  Thank you for your submission. We will get back to you as soon as possible. Your case number is{' '}
                  <span className='font-extrabold'>{caseId}</span>
                  {'. '}Please use it in any of followup conversation.
                  <div>
                    <Link href="#" underline="always">
                      Go Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
