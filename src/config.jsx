const config = {
  BACKEND_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/"
      : "https://backend-ashy-one.vercel.app/",
};

export default config;
