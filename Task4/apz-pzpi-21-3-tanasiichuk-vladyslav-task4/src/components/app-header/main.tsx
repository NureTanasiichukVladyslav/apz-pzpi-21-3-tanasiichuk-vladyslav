import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { getUser } from "@/services/get-user";
import { NavLinks } from "./ui";
import { getNotifications } from "@/services/get-notifications";

export const Header = async () => {
  const user = await getUser();
  let notifications;
  if (user) {
    notifications = await getNotifications();
  }

  return (
    <Container>
      <AppBar component="nav" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <NavLinks user={user} notifications={notifications} />
        </Toolbar>
      </AppBar>
    </Container>
  );
};
