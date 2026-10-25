
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      id="about"
      sx={{
        bgcolor: "#152D29",
        color: "#F4F0E7",
        py: 4,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: 23,
          }}
        >
          ATELIER ESTATES
        </Typography>

        <Typography variant="body2" sx={{ color: "#BDC5BB" }}>
          Spaces with a story. Homes with a point of view.
        </Typography>

        <Typography variant="caption" sx={{ color: "#BDC5BB" }}>
          Curated living · Since 2018
        </Typography>
      </Container>
    </Box>
  );
}
