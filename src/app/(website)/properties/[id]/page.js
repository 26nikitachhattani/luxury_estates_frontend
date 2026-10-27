"use client";

import { Suspense, use, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { getPropertyById } from "@/lib/api/propertyApi";
import { submitInquiry } from "@/lib/api/inquiryApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const initialInquiryForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function getImageUrl(property) {
  const image = property?.image_url || property?.image;

  if (!image) return "";

  if (typeof image !== "string") return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
}

// Cache promises by id so re-renders reuse the same promise (required by `use`).
// The promise always resolves (never rejects), so no error boundary is needed.
const propertyCache = new Map();

function loadProperty(id) {
  if (!propertyCache.has(id)) {
    propertyCache.set(
      id,
      getPropertyById(id)
        .then((property) => ({ property }))
        .catch((err) => ({
          notFound: err.response?.status === 404,
          error: err.apiMessage || "Failed to load property details.",
        }))
    );
  }

  return propertyCache.get(id);
}

function PropertyLoading() {
  return (
    <Container sx={{ py: 6 }}>
      <Stack
        
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <CircularProgress size={24} />
        <Typography>Loading property details...</Typography>
      </Stack>
    </Container>
  );
}

// Page: only sets up the Suspense boundary
export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id;

  if (!id) return null;

  return (
    <Suspense fallback={<PropertyLoading />}>
      <PropertyDetails id={id} />
    </Suspense>
  );
}

// Content: suspends until the property is loaded
function PropertyDetails({ id }) {
  const result = use(loadProperty(id));

  const [inquiryForm, setInquiryForm] = useState(initialInquiryForm);
  const [submitting, setSubmitting] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");

  if (result.notFound) {
    notFound();
  }

  if (result.error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{result.error}</Alert>

        <Button component={Link} href="/#properties" sx={{ mt: 2 }}>
          Back to properties
        </Button>
      </Container>
    );
  }

  const property = result.property;

  if (!property) return null;

  function handleInquiryChange(event) {
    const { name, value } = event.target;

    setInquiryForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleInquirySubmit(event) {
    event.preventDefault();

    setInquiryError("");
    setInquirySuccess("");

    if (!property?.id) {
      setInquiryError("Property information is unavailable.");
      return;
    }

    setSubmitting(true);

    submitInquiry(property.id, inquiryForm)
      .then(() => {
        setInquirySuccess(
          "Your inquiry has been submitted successfully. Our team will contact you."
        );

        setInquiryForm(initialInquiryForm);
      })
      .catch((err) => {
        const data = err.response?.data;

        if (data && typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, value]) => {
              const detail = Array.isArray(value)
                ? value.join(", ")
                : String(value);

              return `${field}: ${detail}`;
            })
            .join(" | ");

          setInquiryError(messages || "Failed to submit your inquiry.");
        } else {
          setInquiryError(
            err.apiMessage || "Failed to submit your inquiry. Please try again."
          );
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const price = Number(property.price);
  const area = property.size_sqft;

  const formattedPrice = Number.isFinite(price)
    ? price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : `₹${(price / 100000).toFixed(0)} L`
    : "Price unavailable";

  const imageUrl = getImageUrl(property);

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
            display: "block",
            width: "100%",
            height: { xs: 260, md: 480 },
            objectFit: "cover",
            bgcolor: "#e7e3da",
            borderRadius: 2,
          }}
        />
      )}

      <Grid container spacing={5} sx={{ mt: 1 }}>
        {/* Property information */}
        <Grid  size={{xs:12,md:7}}>
          <Stack spacing={{ xs: 1, sm: 2, md: 4 }} sx={{ py: 2 }}>
            <Typography variant="overline" color="secondary.main">
              {property.location}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
              }}
            >
              {property.name}
            </Typography>

            <Typography variant="h4" color="primary.main">
              {formattedPrice}
            </Typography>

            <Divider />

            <Stack
              
              spacing={{ xs: 1, sm: 2, md: 4 }}
              sx={{ flexWrap: "wrap" }}
            >
              <Typography>
                {Number(area).toLocaleString("en-IN")} sq ft
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
        </Grid>

        {/* Inquiry form */}
        <Grid  size={{xs:12,md:5}}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Interested in this property?
            </Typography>

            <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
              Share your details and our team will get in touch with you.
            </Typography>

            {inquirySuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {inquirySuccess}
              </Alert>
            )}

            {inquiryError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {inquiryError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleInquirySubmit}>
              <Stack
                
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="name"
                  value={inquiryForm.name}
                  onChange={handleInquiryChange}
                  autoComplete="name"
                />

                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  name="email"
                  value={inquiryForm.email}
                  onChange={handleInquiryChange}
                  autoComplete="email"
                />

                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone"
                  value={inquiryForm.phone}
                  onChange={handleInquiryChange}
                  autoComplete="tel"
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={4}
                  label="Your Message"
                  name="message"
                  value={inquiryForm.message}
                  onChange={handleInquiryChange}
                  placeholder="I'm interested in this property. Please share more details."
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
