export const cn = (namesArray) =>
  namesArray
    .map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }
      if (typeof entry === "object") {
        return Object.keys(entry).map(
          (key) => !!entry[key] && key
        );
      }
    })
    .flat()
    .filter(Boolean)
    .join(" ");
