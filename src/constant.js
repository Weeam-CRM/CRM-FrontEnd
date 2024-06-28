export const constant = {
  baseUrl:
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? "http://localhost:5000/"
      : "https://avenue5-2eacdcb01d69.herokuapp.com/",
};
