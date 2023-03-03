import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { initReactI18next } from "react-i18next"
import i18next from "i18next"
import HttpApi from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

import "./index.css";
import App from "./App";
import reportWebVitals from "./utilities/reportWebVitals";
import { LanguageContextProvider } from "./contexts/language-context";
import Loading from "./components/interfaces/Loading";
import { SearchContextProvider } from "./contexts/search-context";
import { AuthContextProvider } from "./contexts/auth-context";

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "zh"], // TODO: add multi-language support
    fallbackLng: "en",
    debug: false,
    // options for language detector
    detection: {
      order: ["htmlTag", "cookie", "path", "navigator", "subdomain"],
      caches: ["cookie"],
    },
    // cache user language on
    caches: ["localStorage", "cookie"],
    excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)
    // optional expire and domain for set cookie
    cookieMinutes: 10,
    cookieDomain: "myDomain",
    // optional htmlTag with lang attribute, the default is:
    htmlTag: document.documentElement,
    // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
    cookieOptions: { path: "/", sameSite: "strict" },
    // load locales dynamically
    backend: {
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
  })

// TODO: loading screen

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageContextProvider>
    <AuthContextProvider>
      <SearchContextProvider>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </SearchContextProvider>
    </AuthContextProvider>
  </LanguageContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
