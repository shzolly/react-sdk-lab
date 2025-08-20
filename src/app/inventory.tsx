/* eslint-disable no-console */

import Header from './components/header';
import useConstellation from '../hooks/useConstellation';
import { useEffect, useState } from 'react';
import { IInventory } from '../types/types';
import Footer from './components/footer';
import Loading from './components/loading';
import { Button } from '../design-system/ui/button';
import { Alert, AlertTitle, Link } from '@mui/material';

const Inventory = () => {
  const isPegaReady = useConstellation();
  const [inventories, setIventories] = useState<IInventory[]>([]);

  console.log('bIsPegaReady', isPegaReady);

  useEffect(() => {
    if (isPegaReady) {
      const dataViewName = 'D_InventoryList';
      const parameters = {};
      const paging = {
        pageNumber: 1,
        pageSize: 30
      };
      const query = {
        distinctResultsOnly: true,
        select: [
          {
            field: 'DeviceModel'
          },
          {
            field: 'Manufacturer'
          },
          {
            field: 'OperatingSystem'
          },
          {
            field: 'Connectivity'
          },
          {
            field: 'StorageCapacity'
          },
          {
            field: 'BatteryCapacity'
          },
          {
            field: 'Price'
          },
          {
            field: 'RAM'
          },
          {
            field: 'pyGUID'
          }
        ]
      };

      (PCore.getDataPageUtils().getDataAsync(dataViewName, 'root', parameters, paging, query) as Promise<any>)
        .then(response => {
          console.log('DataPageUtils.getDataAsync response', response);
          setIventories(response.data);
        })
        .catch(error => {
          throw new Error('Error', error);
        });
    }
  }, [isPegaReady]);

  return (
    <>
      <Header />
      {isPegaReady ? (
        <div className='flex-grow py-12 px-6 dark:bg-gray-900'>
          <div className='container mx-auto'>
            <Alert severity='success'>
              <AlertTitle>PCore.getDataPageUtils().getDataAsync()</AlertTitle>
              The Inventory items are rendered from a list Data Page directly. <br />
              Reference:
              <Link
                href='https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/getdataasync-datapagename-context-parameters-paging-query-options.html'
                target='_blank'
                underline='hover'
              >
                https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/getdataasync-datapagename-context-parameters-paging-query-options.html
              </Link>
            </Alert>
            <div className='flex flex-col lg:flex-row items-center gap-y-2 gap-x-2 justify-between mb-8'>
              <h1 className='text-2xl lg:text-3xl font-bold text-[#333] dark:text-white'>Explore our inventories</h1>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {inventories.map(inventory => (
                <div key={inventory.pyGUID} className='hover:scale-105 block rounded-xl bg-white shadow-lg dark:bg-gray-600 text-center'>
                  <div className='flex my-4 flex-col items-center align-middle center'>
                    <img className='rounded-t-xl w-32 h-64' src={`assets/img/prod_${Math.floor(Math.random() * 15) + 1}.avif`} alt='' />
                  </div>
                  <div className='p-6'>
                    <h5 className='mb-2 text-xl font-bold tracking-wide text-neutral-800 dark:text-neutral-50'>{inventory.DeviceModel}</h5>

                    <p className='mb-2 text-base text-neutral-500 dark:text-neutral-300'>
                      <div>
                        Manufacturer: <span className='font-semibold'>{inventory.Manufacturer}</span>
                      </div>
                      <div>
                        Operating: <span className='font-semibold'>{inventory.OperatingSystem}</span>
                      </div>
                    </p>

                    <Button variant='accent'>Show details</Button>
                  </div>

                  <div className='border-t-2 border-neutral-100 px-6 py-4 dark:border-neutral-500'>
                    <h5 className='flex items-center justify-center text-neutral-500 dark:text-neutral-300'>
                      <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-lg font-bold leading-none text-gray-700'>
                        ${inventory.Price}
                      </span>
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div id='pega-root' />
        </div>
      ) : (
        <Loading />
      )}

      <Footer />
    </>
  );
};

export default Inventory;
