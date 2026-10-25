"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import PropertyListingSection from "@/components/properties/PropertyListingSection";

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "#F6F4EF",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="overline"
            color="secondary.main"
            letterSpacing={3}
          >
            A CONSIDERED COLLECTION OF EXCEPTIONAL HOMES
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.8rem", md: "5rem" },
              maxWidth: 850,
              my: 3,
            }}
          >
            Find a place to call extraordinary.
          </Typography>

          <Typography sx={{ maxWidth: 600, mb: 4, color: "text.secondary" }}>
            Discover distinctive residences, architectural retreats and
            private estates selected for the way they make you feel.
          </Typography>

          <Button variant="contained" href="#properties">
            Explore properties
          </Button>
        </Container>
      </Box>

      <PropertyListingSection />
    </>
  );
}
