
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getPropertyById } from "@/lib/api/propertyApi";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFoundProperty, setNotFoundProperty] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setNotFoundProperty(false);

    getPropertyById(id)
      .then((data) => {
        setProperty(data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFoundProperty(true);
        } else {
          setError(
            err.apiMessage || "Failed to load property details."
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading property details...</Typography>
      </Container>
    );
  }

  if (notFoundProperty) {
    notFound();
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} href="/#properties" sx={{ mt: 2 }}>
          Back to properties
        </Button>
      </Container>
    );
  }

  if (!property) return null;

  const price = Number(property.price);
  const area = property.size_sqft;

  const formattedPrice =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : `₹${(price / 100000).toFixed(0)} L`;

  // Supports either an uploaded Django image or an image URL.
  const imageUrl =
    property.image_url ||
    (property.image
      ? property.image.startsWith("http")
        ? property.image
        : `http://127.0.0.1:8000${property.image}`
      : "");

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button component={Link} href="/#properties" sx={{ mb: 3 }}>
        ← Back to properties
      </Button>

      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt={property.name}
          sx={{
            width: "100%",
            height: { xs: 260, md: 480 },
            objectFit: "cover",
            bgcolor: "#e7e3da",
          }}
        />
      )}

      <Stack spacing={2} sx={{ py: 4 }}>
        <Typography variant="overline" color="secondary.main">
          {property.location}
        </Typography>

        <Typography variant="h3">{property.name}</Typography>

        <Typography variant="h4" color="primary.main">
          {formattedPrice}
        </Typography>

        <Divider />

        <Stack direction="row" spacing={4} flexWrap="wrap">
          <Typography>
            {Number(area).toLocaleString()} sq ft
          </Typography>

          <Typography>{property.bedrooms} bedrooms</Typography>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{ maxWidth: 750, lineHeight: 1.8 }}
        >
          {property.description}
        </Typography>
      </Stack>
    </Container>
  );
}
