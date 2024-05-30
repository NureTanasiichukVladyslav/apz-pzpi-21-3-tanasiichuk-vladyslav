"use client";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { NotificationDto } from "@/types";
import { Stack, Typography } from "@mui/material";

interface Props {
  notifications?: NotificationDto[];
}

export function NotificationsMenu({ notifications }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <NotificationsIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          style: { maxWidth: "35rem" },
        }}
      >
        {notifications &&
          notifications.map((notification, index) => (
            <MenuItem
              key={notification.id}
              onClick={handleClose}
              sx={{ backgroundColor: index % 2 === 0 ? "#e0e0e0" : "white" }}
            >
              <Stack direction="row" gap={2}>
                <ErrorOutlineIcon color="warning" />
                <Stack gap={1}>
                  {notification.message.split("Reasons").map((part, index) => (
                    <Typography sx={{ textWrap: "wrap" }} key={index}>
                      {index === 1 && <strong>Reasons: </strong>}
                      {part}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
