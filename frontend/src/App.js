import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import injectContext from "./store/appContext";


import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Profile from './pages/profile';
import NotFound from './pages/notFound';
import Users from './pages/users';
import PartnerProfile from './pages/partnerProfile';
import Sidebar from './components/sidebar';

const App = () => {
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        {/* <ScrollToTop> */}
        <RenderNavBarIfNotAuthRoutes />
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Users />} />
          <Route path="/partner-profile/:userId" element={<PartnerProfile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
        {/* <RenderFooterIfNotAuthRoutes />
        </ScrollToTop> */}
      </BrowserRouter>
    </div>
  );
};

const RenderNavBarIfNotAuthRoutes = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";
  return !isAuthRoute && <Sidebar />;
};

// const RenderFooterIfNotAuthRoutes = () => {
//   const location = useLocation();
//   const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";
//   return !isAuthRoute && <Footer />;
// };

export default injectContext(App);
