import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { getUser } from "@/services/getUser";
import { NavLinks } from "./nav-links";

export const Header = async () => {
  const user = await getUser();

  return (
    <Container>
      <AppBar component="nav" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <NavLinks user={user} />
        </Toolbar>
      </AppBar>
    </Container>
  );
};
