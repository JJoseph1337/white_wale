import { useState } from "react";
import "./App.css";
import { RegistrationForm } from "./components/RegistrationForm/RegistrationForm";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { Account } from "./components/Account/Account";

function App() {
  const [isLoginFormOpen, setIsLoginFormOpen] =
    useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] =
    useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("isLoggedIn")) || ""
  );

  return (
    <>
      <header className="header">
        <div className="container">
          <span>Личный кабинет</span>
        </div>
        <div className="container">
          {!isLoggedIn && (
            <>
              <button
                onClick={() =>
                  setIsLoginFormOpen(!isLoginFormOpen)
                }
              >
                Войти
              </button>
              <button
                onClick={() =>
                  setIsRegisterFormOpen(!isRegisterFormOpen)
                }
              >
                Зарегистрироваться
              </button>
            </>
          )}

          {isLoggedIn && (
            <p>
              Добро пожаловать,
              {localStorage.getItem("email")}
            </p>
          )}
        </div>
      </header>
      <RegistrationForm
        isOpen={isRegisterFormOpen}
        setIsOpen={setIsRegisterFormOpen}
      />
      <LoginForm
        isOpen={isLoginFormOpen}
        setIsOpen={setIsLoginFormOpen}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      {isLoggedIn && (
        <Account setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

export default App;
