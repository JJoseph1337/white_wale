import { useState, useRef, useEffect } from "react";
import styles from "../Account/Account.module.css";
import { DownloadLink } from "../DownloadLink/DownloadLink";

export const Account = ({ setIsLoggedIn }) => {
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState();
  const [fileMediaList, setFileMediaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMediaList().then((res) => setFileList(res.files));
  }, [uploaded]);

  const fetchFileBlobList = async () => {
    const token = localStorage.getItem("token");

    const _fileMediaList = await Promise.all(
      fileList.map(async (file) => {
        const response = await fetch(file.url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const blob = await response.blob();

        return {
          ...file,
          blob,
        };
      })
    );

    setFileMediaList(_fileMediaList);
  };

  useEffect(() => {
    if (fileList.length) {
      fetchFileBlobList();
    }
  }, [fileList]);

  const filePicker = useRef(null);

  const handlePick = () => {
    filePicker.current.click();
  };

  const handleUpload = async (e) => {
    const _files = e.target.files;
    if (fileMediaList.length >= 19) {
      alert("Исчерпан лимит");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    [..._files].forEach((file) => {
      if (file.size >= 1e6) {
        return alert(
          `Файл ${file.name} не загрузился, ограничение веса - 1mb`
        );
      }
      formData.append(`files[]`, file);
    });

    try {
      const url =
        "https://js-test.kitactive.ru/api/media/upload";
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUploaded(data);
    } catch (error) {
      setError(error.message);
    } finally {
      filePicker.current.value = null;
      setIsLoading(false);
    }
  };

  const getMediaList = async () => {
    const url = "https://js-test.kitactive.ru/api/media";
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  };

  const handleLogout = async () => {
    const url = "https://js-test.kitactive.ru/api/logout";
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.status === "ok") {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("email");
      setIsLoggedIn(false);
    }
  };

  const handleDelete = async (id) => {
    const url = `https://js-test.kitactive.ru/api/media/${id}`;
    const token = localStorage.getItem("token");

    fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const filtredFileMediaList = fileMediaList.filter(
      (file) => file.id !== id
    );
    setFileMediaList(filtredFileMediaList);
  };

  return (
    <div className={styles.container}>
      <h2>Мой кабинет</h2>
      <input
        className={styles.hidden}
        type="file"
        onChange={handleUpload}
        ref={filePicker}
        multiple
      />
      <ul className={styles.files}>
        {error && <p>{error}</p>}
        {isLoading ? (
          <p>Загрузка ...</p>
        ) : (
          fileMediaList.map((media) => (
            <li key={media.id}>
              {media.mimeType.includes("image") && (
                <DownloadLink
                  url={URL.createObjectURL(media.blob)}
                  fileName="downloaded"
                >
                  <img
                    src={URL.createObjectURL(media.blob)}
                    width={40}
                  />
                </DownloadLink>
              )}
              {!media.mimeType.includes("image") && (
                <DownloadLink
                  url={URL.createObjectURL(media.blob)}
                  fileName="downloaded file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path>
                  </svg>
                </DownloadLink>
              )}
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(media.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                >
                  <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
      <div className={styles.actions}>
        <span>
          Загружено файлов: {fileMediaList.length}
        </span>
        <button
          className={styles.button}
          onClick={handlePick}
        >
          Добавить файл
        </button>
      </div>

      <button
        className={styles.button}
        onClick={handleLogout}
      >
        Выйти из кабинета
      </button>
    </div>
  );
};
