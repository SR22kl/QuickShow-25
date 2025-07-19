const dateFormat = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    year: "numeric",
    minute: "numeric",
  });
};

export default dateFormat;
