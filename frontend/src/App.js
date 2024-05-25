import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import injectContext from "./store/appContext";


import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Profile from './pages/profile';
import NotFound from './pages/notFound';
import Users from './pages/users';

const App = () => {
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        {/* <ScrollToTop> */}
        {/* <RenderNavBarIfNotAuthRoutes /> */}
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <RenderFooterIfNotAuthRoutes />
        </ScrollToTop> */}
      </BrowserRouter>
    </div>
  );
};

// const RenderNavBarIfNotAuthRoutes = () => {
//   const location = useLocation();
//   const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";
//   return !isAuthRoute && <Navbar />;
// };

// const RenderFooterIfNotAuthRoutes = () => {
//   const location = useLocation();
//   const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";
//   return !isAuthRoute && <Footer />;
// };

export default injectContext(App);
