
"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";

export default function AdminHeader() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#202823",
        borderBottom: "1px solid #e5e1d9",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px",
          px: { xs: 2, md: 4 },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "#9c7848", letterSpacing: 2 }}
          >
            ATELIER ESTATES
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            Admin Dashboard
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/"
          variant="outlined"
          sx={{
            borderColor: "#152d29",
            color: "#152d29",
            whiteSpace: "nowrap",
          }}
        >
          View Website ↗
        </Button>
      </Toolbar>
    </AppBar>
  );
}
