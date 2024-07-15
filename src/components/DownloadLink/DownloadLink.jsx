export const DownloadLink = ({
  url,
  fileName,
  children,
}) => {
  return (
    <a
      style={{ display: "inline-block" }}
      download={fileName}
      href={url}
    >
      {children}
    </a>
  );
};
