import styles from "../RegistrationForm/RegistrationForm.module.css";
import { useState, useEffect, useRef } from "react";
import { cn } from "../../helpers/cn";

export const RegistrationForm = ({
  isOpen,
  setIsOpen,
}) => {
  const [name, setName] = useState("");
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

    const url = "https://js-test.kitactive.ru/api/register";

    const response = await fetch(url, {
      body: JSON.stringify({
        email,
        password,
        name,
      }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data.status === "ok") {
      localStorage.setItem("email", email);
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
      <h2 className={styles.form__heading}>Registration</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.container}>
        <label
          className={styles.label}
          htmlFor="name"
        >
          Name
        </label>
        <input
          className={styles.input}
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          autoComplete="text"
          id="name"
          name="name"
        />
      </div>
      <div className={styles.container}>
        <label
          className={styles.label}
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          autoComplete="email"
          id="email"
          name="email"
        />
      </div>
      <div className={styles.container}>
        <label
          className={styles.label}
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          autoComplete="current-password"
          id="password"
          name="password"
        />
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={!email || !password || isLoading || !name}
      >
        {isLoading ? "Loading..." : "Register"}
      </button>
    </form>
  );
};
