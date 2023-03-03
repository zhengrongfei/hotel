import { useContext } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./App.css";
import LanguageContext from "./contexts/language-context";

import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import OffersPage from "./pages/OffersPage";
import ReviewsPage from "./pages/ReviewsPage";
import NoticesPage from "./pages/NoticesPage";
import UserPage from "./pages/UserPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ServicePage from "./pages/ServicePage";
import ForgotPage from "./pages/ForgotPage";

function App() {
  const userLanguageContext = useContext(LanguageContext);
  const { t } = useTranslation()

  document.body.dir = userLanguageContext.currentLanguage.DIRECTION
  // document.body.dir = "rtl"
  document.title = t("website_title")

  return <RouterProvider router={
    createBrowserRouter(
      createRoutesFromElements(
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="/:lang/*" element={<HomePage />} loader={({ params }) => {
            if (params.lang !== userLanguageContext.currentLanguageCode)
              userLanguageContext.changeLanguage(params.lang)
          }} />
          <Route path="hotels" element={<HotelsPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="user" element={<UserPage />}>
            <Route path="orders" element={<UserPage />} />
          </Route>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="forgot" element={<ForgotPage />} />
          <Route path="service" element={<ServicePage />} />
        </Route>
      ))} />;
}

export default App;
