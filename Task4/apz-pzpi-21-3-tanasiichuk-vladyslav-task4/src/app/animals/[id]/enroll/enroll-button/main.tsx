"use client";

import { Button } from "@mui/material";
import { useEnroll } from "@/hooks";

interface Props {
  animalId: number;
  instructorId: number;
  userId: number;
}

export const EnrollButton = ({ animalId, instructorId, userId }: Props) => {
  const { handleEnroll } = useEnroll({ animalId, instructorId, userId });

  return (
    <Button onClick={handleEnroll} sx={{ width: "fit-content" }}>
      Enroll
    </Button>
  );
};
