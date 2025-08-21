// from react_root.js
import { createRoot } from 'react-dom/client';
import './common.css';
import { Routes, Route, BrowserRouter } from 'react-router';

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
let root: any = null;

const outletElement = document.getElementById('outlet');
if (outletElement) {
  root = createRoot(outletElement); // <-- Use createRoot
  root.render(
    <BrowserRouter>
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
        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

document.addEventListener('SdkLoggedOut', () => {
  if (root) {
    root.unmount();
  }
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
