import styles from "../LoginForm/LoginForm.module.css";
import { cn } from "../../helpers/cn";
import { useState, useEffect, useRef } from "react";

export const LoginForm = ({
  isOpen,
  setIsOpen,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (
      ref.current &&
      !ref.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const url = "https://js-test.kitactive.ru/api/login";
      const response = await fetch(url, {
        body: JSON.stringify({
          email,
          password,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.status === "ok") {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        localStorage.setItem("email", email);
      }
      localStorage.setItem("token", data.token);
    } catch (error) {
      setError("Неправильный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener(
      "click",
      handleClickOutside,
      true
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside,
        true
      );
    };
  }, []);

  return (
    <>
      {!isLoggedIn && (
        <form
          ref={ref}
          className={cn([
            styles.form,
            {
              [styles["form--open"]]: isOpen,
            },
          ])}
          onSubmit={handleSubmit}
        >
          <h2 className={styles.form__heading}>
            Authentification
          </h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.container}>
            <label
              className={styles.label}
              htmlFor="loginEmail"
            >
              Email
            </label>
            <input
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              autoComplete="email"
              id="loginEmail"
              name="loginEmail"
            />
          </div>
          <div className={styles.container}>
            <label
              className={styles.label}
              htmlFor="loginPassword"
            >
              Password
            </label>
            <input
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              autoComplete="current-password"
              id="loginPassword"
              name="loginPassword"
            />
          </div>

          <button
            className={styles.submitButton}
            type="submit"
            disabled={!email || !password || isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      )}
    </>
  );
};
