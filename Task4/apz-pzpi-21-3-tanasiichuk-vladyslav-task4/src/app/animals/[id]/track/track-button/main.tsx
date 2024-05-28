"use client";

import { Button } from "@mui/material";
import { useTrack } from "@/hooks";

interface Props {
  animalId: number;
  instructorId: number;
  userId: number;
}

export const TrackButton = ({ animalId, instructorId, userId }: Props) => {
  const { handleTrack } = useTrack({ animalId, instructorId, userId });

  return (
    <Button onClick={handleTrack} sx={{ width: "fit-content" }}>
      Track
    </Button>
  );
};
