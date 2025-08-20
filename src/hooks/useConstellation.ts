/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { loginIfNecessary, sdkSetAuthHeader, sdkSetCustomTokenParamsCB, getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import { startMashup } from '../lib/constellation';

declare global {
  interface Window {
    PCore?: any;
    __mashupStarted?: boolean;
  }
}

function useConstellation() {
  // If PCore already exists (e.g., after browser Back), start as ready.
  const [isPegaReady, setIsPegaReady] = useState<boolean>(() => !!window.PCore);

  useEffect(() => {
    let unmounted = false;

    const markReady = () => {
      if (unmounted) return;
      // Start the portal only once
      if (!window.__mashupStarted) {
        startMashup();
        window.__mashupStarted = true;
      }
      setIsPegaReady(true);
    };

    // --- Auth/bootstrap (unchanged) ---
    getSdkConfig().then((sdkConfig: any) => {
      const sdkConfigAuth = sdkConfig.authConfig;

      console.log('sdkConfig - mashupGrantType: ', sdkConfigAuth.mashupGrantType);
      console.log('sdkConfig - customAuthType: ', sdkConfigAuth.customAuthType);

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
        const now = new Date();
        const expTime = new Date(now.getTime() + 5 * 60 * 1000);
        const sISOTime = `${expTime.toISOString().split('.')[0]}Z`.replace(/[-:]/g, '');
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      if (sdkConfigAuth.customAuthType === 'CustomIdentifier') {
        sdkSetCustomTokenParamsCB(() => ({ userIdentifier: sdkConfigAuth.mashupUserIdentifier }));
      }
    });

    // Demo param (kept from your code)
    sdkSetCustomTokenParamsCB(() => ({ userIdentifier: 'bCustomAuth' }));

    // If PCore is already present, mark ready immediately; otherwise wait for event.
    const onReady = () => {
      document.removeEventListener('SdkConstellationReady', onReady);
      markReady();
    };

    if (window.PCore) {
      markReady();
    } else {
      document.addEventListener('SdkConstellationReady', onReady);
    }

    loginIfNecessary({ appName: 'embedded', mainRedirect: false });

    return function cleanup() {
      unmounted = true;
      document.removeEventListener('SdkConstellationReady', onReady);
      try {
        PCore?.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');
        PCore?.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');
      } catch {
        /* no-op */
      }
    };
  }, []);

  return isPegaReady;
}

export default useConstellation;
