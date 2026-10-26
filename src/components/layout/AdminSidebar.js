"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

export default function AdminSidebar() {
  return (
    <Box
      sx={{
        width: 240,
        p: 3,
        bgcolor: "#152D29",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6" sx={{ mb: 4 }}>
        ATELIER ESTATES
      </Typography>

      <Button
        component={Link}
        href="/admin"
        sx={{ color: "#fff", display: "block", mb: 1 }}
      >
        Dashboard
      </Button>

      <Button
        component={Link}
        href="/"
        sx={{ color: "#fff", display: "block" }}
      >
        View Website
      </Button>
    </Box>
  );
}