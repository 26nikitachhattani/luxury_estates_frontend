"use client";
import { notFound } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import properties from "@/data/properties";

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;
  const property = properties.find((item) => item.id === id);

  if (!property) notFound();

  const price =
    property.price >= 10000000
      ? `₹${(property.price / 10000000).toFixed(2)} Cr`
      : `₹${(property.price / 100000).toFixed(0)} L`;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button component={Link} href="/#properties" sx={{ mb: 3 }}>
        ← Back to properties
      </Button>

      <Box
        component="img"
        src={property.image}
        alt={property.name}
        sx={{
          width: "100%",
          height: { xs: 260, md: 480 },
          objectFit: "cover",
          bgcolor: "#e7e3da",
        }}
      />

      <Stack spacing={2} sx={{ py: 4 }}>
        <Typography variant="overline" color="secondary.main">
          {property.location}
        </Typography>

        <Typography variant="h3">{property.name}</Typography>

        <Typography variant="h4" color="primary.main">
          {price}
        </Typography>

        <Divider />

        <Stack direction="row" spacing={4}>
          <Typography>{property.area.toLocaleString()} sq ft</Typography>
          <Typography>{property.bedrooms} bedrooms</Typography>
        </Stack>

        <Typography color="text.secondary" sx={{ maxWidth: 750, lineHeight: 1.8 }}>
          {property.description}
        </Typography>
      </Stack>
    </Container>
  );
}
