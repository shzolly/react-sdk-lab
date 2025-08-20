/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { render } from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../sdk-local-component-map';
import { theme } from '../theme';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import C11nEnv from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';

declare const myLoadMashup: any;

function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();

  const thePConnObj = <PegaConnectObj {...props} />;

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StoreContext.Provider value={{ store: PCore.getStore(), displayOnlyFA: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {thePConnObj}
      </ThemeProvider>
    </StoreContext.Provider>
  );
}

/**
 * Callback from onPCoreReady that's called once the top-level render object
 * is ready to be rendered
 * @param inRenderObj the initial, top-level PConnect object to render
 */
function initialRender(inRenderObj) {
  // loadMashup does its own thing so we don't need to do much/anything here

  // // modified from react_root.js render
  const { props, domContainerID = null, componentName, portalTarget, styleSheetTarget } = inRenderObj;

  const thePConn = props.getPConnect() as C11nEnv;
  // setPConn(thePConn);

  console.log(`EmbeddedTopLevel: initialRender got a PConnect with ${thePConn.getComponentName()}`);

  let target: any = null;

  if (domContainerID !== null) {
    target = document.getElementById(domContainerID);
  } else if (portalTarget !== null) {
    target = portalTarget;
  }

  console.log(
    `InitialRender with domContainerID: ${domContainerID}, target: ${target} componentName: ${componentName}, portalTarget: ${portalTarget}, styleSheetTarget: ${styleSheetTarget}`
  );

  // Note: RootComponent is just a function (declared below)
  const Component: any = RootComponent;

  if (componentName) {
    Component.displayName = componentName;
  }

  const theComponent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...props} portalTarget={portalTarget} styleSheetTarget={styleSheetTarget} />
    </ThemeProvider>
  );

  // Initial render of component passed in (which should be a RootContainer)
  render(<>{theComponent}</>, target);
  //  setIsPegaReady(true);
  // Initial render to show that we have a PConnect and can render in the target location
  // render( <div>EmbeddedTopLevel initialRender in {domContainerID} with PConn of {componentName}</div>, target);
}

export function startMashup() {
  // NOTE: When loadMashup is complete, this will be called.
  PCore.onPCoreReady(renderObj => {
    console.log(`PCore ready!`);
    // Check that we're seeing the PCore version we expect
    compareSdkPCoreVersions();

    // Initialize the SdkComponentMap (local and pega-provided)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
      console.log(`SdkComponentMap initialized`);

      // Don't call initialRender until SdkComponentMap is fully initialized
      initialRender(renderObj);
    });
  });

  // load the Mashup and handle the onPCoreEntry response that establishes the
  //  top level Pega root element (likely a RootContainer)
  console.log('startMashup: calling myLoadMashup', window);
  myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
}
