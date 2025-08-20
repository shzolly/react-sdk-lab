// from react_root.js
import { render } from 'react-dom';
import './common.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Home from './app/home';
import Availability from './app/availability';
import Package from './samples/Embedded';
import Company from './app/company';
import Inventory from './app/inventory';
import NewService from './app/newservice';
import Contact from './app/contact';
import Support from './app/support';
import MessageCenter from './app/messagecenter';

const baseURL = '/';

const outletElement = document.getElementById('outlet');
if (outletElement) {
  render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path={`${baseURL}`} element={<Home />} />
        <Route path={`${baseURL}index.html`} element={<Home />} />
        <Route path={`${baseURL}availability`} element={<Availability />} />
        <Route path={`${baseURL}package`} element={<Package />} />
        <Route path={`${baseURL}company`} element={<Company />} />
        <Route path={`${baseURL}inventory`} element={<Inventory />} />
        <Route path={`${baseURL}newservice`} element={<NewService />} />
        <Route path={`${baseURL}support`} element={<Support />} />
        <Route path={`${baseURL}contact`} element={<Contact />} />
        <Route path={`${baseURL}messagecenter`} element={<MessageCenter />} />
        <Route path="*" element={<Home />} /> {/* <-- fix: render a component */}
      </Routes>
    </BrowserRouter>,
    document.getElementById('outlet')
  );
}

document.addEventListener('SdkLoggedOut', () => {
  const thePegaRoot = document.getElementById('pega-root');
  if (thePegaRoot) {
    thePegaRoot.innerHTML = '';
    const theLogoutMsgDiv = document.createElement('div');
    theLogoutMsgDiv.setAttribute('style', 'margin: 5px;');
    theLogoutMsgDiv.innerHTML = `You are logged out. Refresh the page to log in again.`;
    thePegaRoot.appendChild(theLogoutMsgDiv);
  }
  sessionStorage.removeItem('rsdk_portalName');
});
