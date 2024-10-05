import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./components/comments/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import { BrowserRouter } from "react-router-dom";
import { DarkModeProvider } from "./components/DarkModeContext";
import { TokenRefreshProvider } from "./components/contexts/tokenRefreshContext";
import { UserContext } from "./App";
import getUserInfo from "./utilities/decodeJwt";

const Root = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user }}>
        <TokenRefreshProvider>
          <DarkModeProvider>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
              integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
              crossOrigin="anonymous"
            />
            <App />
          </DarkModeProvider>
        </TokenRefreshProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <Root />,
  document.getElementById("root")
);
