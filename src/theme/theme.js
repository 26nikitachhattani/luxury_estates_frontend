"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#152D29",
    },
    secondary: {
      main: "#C8A878",
    },
    background: {
      default: "#F6F4EF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#202823",
      secondary: "#73786F",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
});

export default theme;
