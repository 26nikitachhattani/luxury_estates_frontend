"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        borderBottom: "1px solid #dedbd3",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: 78, gap: 3 }}
        >
          <Typography
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1,
            }}
          >
            ATELIER <Box component="span" sx={{ color: "secondary.main" }}>ESTATES</Box>
          </Typography>

          <Button component={Link} href="/#properties" color="inherit">
            Properties
          </Button>

          <Button component={Link} href="/#about" color="inherit">
            Our approach
          </Button>

          <Button component={Link} href="/admin" variant="contained">
            Admin portal
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
