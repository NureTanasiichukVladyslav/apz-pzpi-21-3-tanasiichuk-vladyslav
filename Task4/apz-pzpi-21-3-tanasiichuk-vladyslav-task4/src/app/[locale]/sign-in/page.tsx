"use client";
import { fetchClient } from "@/utils/fetch";
import { revalidateTag } from "@/utils/revalidate-tag";
import { Button, Stack, TextField, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

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
      if (login === "admin") {
        router.push("admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setErrorMessage(t("loginFailed"));
    }
  };

  return (
    <Stack gap={4}>
      <h3></h3>
      <Typography variant="h5" align="center">
        {t("signIn")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="login"
            label={t("login")}
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
            label={t("password")}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorMessage}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            {t("signIn")}
          </Button>
          <Link href="/sign-up" variant="body2">
            {t("dontHaveAccount")}
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
