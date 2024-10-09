import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./components/comments/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./global.css";
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossorigin
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
              rel="stylesheet"
            />
            <App />
          </DarkModeProvider>
        </TokenRefreshProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
