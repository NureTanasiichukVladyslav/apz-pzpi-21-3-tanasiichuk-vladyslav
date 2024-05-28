"use client";
import { fetchClient } from "@/utils/fetch";
import { revalidateTag } from "@/utils/revalidate-tag";
import { Button, Stack, TextField, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetchClient.post<{
        id: number;
        token: string;
        login: string;
      }>("auth/login", {
        login,
        password,
      });
      if (response && window) {
        window.localStorage.setItem("access_token", response?.token);
      }
      revalidateTag("user");
      router.push("/");
    } catch (err) {
      setErrorMessage("Login failed!");
    }
  };

  return (
    <Stack gap={4}>
      <Typography variant="h5" align="center">
        Sign in
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            error={!!errorMessage}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorMessage}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign In
          </Button>
          <Link href="/sign-up" variant="body2">
            Dont have an account? Sign Up
          </Link>
        </Stack>
        {errorMessage && ( // Conditionally render error message
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
      </form>
    </Stack>
  );
}
