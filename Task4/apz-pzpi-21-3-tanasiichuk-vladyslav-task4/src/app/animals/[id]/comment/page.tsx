"use client";
import { fetchClient } from "@/utils/fetch";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Link,
  Rating,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const [text, setText] = useState("");
  const [rating, setRating] = useState(2.5);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await fetchClient.post(`animals/${params.id}/comment`, {
        text,
        animalId: params.id,
        rating,
      });
      toast.success("Comment added");
      await router.push(`/animals/${params.id}`);
    } catch (err) {
      setErrorMessage("Creation failed!");
    }
  };

  return (
    <Stack gap={4}>
      <Typography variant="h5">Leave comment</Typography>
      <form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <Rating
            id="rating"
            name="rating"
            value={rating}
            size="large"
            onChange={(_, value) => setRating(value as number)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="text"
            label="Comment"
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={!!errorMessage}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Send
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
