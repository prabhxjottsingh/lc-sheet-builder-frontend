import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ loading = true, size = 50, color = "#3498db" }) => {
  return (
    <div style={styles.container}>
      <ClipLoader loading={loading} size={size} color={color} />
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  text: {
    marginTop: "10px",
    fontSize: "1rem",
    color: "#555",
  },
};

export default Loader;
