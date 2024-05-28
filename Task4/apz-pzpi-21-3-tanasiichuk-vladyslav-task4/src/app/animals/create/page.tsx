"use client";
import { fetchClient } from "@/utils/fetch";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await fetchClient.post("animals", {
        title,
        description,
      });
      await router.push("/");
    } catch (err) {
      setErrorMessage("Creation failed!");
    }
  };

  return (
    <Stack gap={4}>
      <Typography variant="h5" align="center">
        Create new animal
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="title"
            label="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errorMessage}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="description"
            label="description"
            type="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errorMessage}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Create
          </Button>
        </Stack>
        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
      </form>
    </Stack>
  );
}
