"use client";
import { fetchClient } from "@/utils/fetch";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { revalidateTag } from "@/utils/revalidate-tag";
import { toast } from "react-toastify";

interface Props {
  path: string;
}

export function DeleteButton({ path }: Props) {
  const deleteItem = async () => {
    try {
      await fetchClient.delete$(path);
      await revalidateTag("animals");
    } catch (err) {
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <IconButton onClick={deleteItem}>
      <DeleteIcon color="error" />
    </IconButton>
  );
}
