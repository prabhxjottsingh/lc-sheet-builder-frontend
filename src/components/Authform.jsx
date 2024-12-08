import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

const Authform = ({ type, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Typography variant="h2">
        {type === "login" ? "Login" : "Signup"}
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" fullWidth>
        {type === "login" ? "Login" : "Signup"}
      </Button>
    </form>
  );
};

export default Authform;
