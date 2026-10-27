"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty as deletePropertyApi,
} from "@/lib/api/propertyApi";

const initialForm = {
  name: "",
  location: "",
  price: "",
  size_sqft: "",
  bedrooms: "",
  description: "",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

function getImageUrl(image) {
  if (!image) return "";

  if (typeof image === "object" && image.url) {
    image = image.url;
  }

  if (typeof image !== "string") return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
}

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([field, messages]) => {
        const message = Array.isArray(messages)
          ? messages.join(", ")
          : typeof messages === "string"
            ? messages
            : JSON.stringify(messages);

        return `${field}: ${message}`;
      })
      .join(" | ");
  }

  return error?.apiMessage || error?.message || "Something went wrong.";
}

export default function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage, setExistingImage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  function loadProperties() {
    setLoading(true);

    getProperties()
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.results || [];
        setProperties(items);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again after a previous selection.
    event.target.value = "";

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setImageFile(file);
  }

  function resetForm() {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");
    setExistingImage("");
    setEditingId(null);
  }

  function handleEdit(property) {
    setError("");
    setMessage("");

    setEditingId(property.id);

    setForm({
      name: property.name || "",
      location: property.location || "",
      price: property.price ?? "",
      size_sqft: property.size_sqft ?? "",
      bedrooms: property.bedrooms ?? "",
      description: property.description || "",
    });

    setImageFile(null);
    setExistingImage(getImageUrl(property.image));
    setImagePreview("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !String(form.price).trim() ||
      !String(form.size_sqft).trim() ||
      !String(form.bedrooms).trim() ||
      !form.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const price = Number(form.price);
    const size = Number(form.size_sqft);
    const bedrooms = Number(form.bedrooms);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    if (!Number.isInteger(size) || size <= 0) {
      setError("Property size must be a positive whole number.");
      return;
    }

    if (!Number.isInteger(bedrooms) || bedrooms <= 0) {
      setError("Bedrooms must be a positive whole number.");
      return;
    }

    const payload = new FormData();

    payload.append("name", form.name.trim());
    payload.append("location", form.location.trim());
    payload.append("price", String(price));
    payload.append("size_sqft", String(size));
    payload.append("bedrooms", String(bedrooms));
    payload.append("description", form.description.trim());

    // When editing, omit the image field if no new image was selected.
    // Django will keep the existing image.
    if (imageFile) {
      payload.append("image", imageFile);
    }

    setSaving(true);

    const request = editingId
      ? updateProperty(editingId, payload)
      : createProperty(payload);

    request
      .then(() => {
        setMessage(
          editingId
            ? "Property updated successfully."
            : "Property created successfully."
        );

        resetForm();
        loadProperties();
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(id);

    deletePropertyApi(id)
      .then(() => {
        setProperties((previous) =>
          previous.filter((property) => property.id !== id)
        );

        if (editingId === id) {
          resetForm();
        }

        setMessage("Property deleted successfully.");
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setDeletingId(null);
      });
  }

  const previewImage = imagePreview || existingImage;

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: "#64748b", letterSpacing: 2 }}
          >
            PROPERTY MANAGEMENT
          </Typography>

          <Typography
            variant="h4"
            sx={{ color: "#101828", fontWeight: 700 }}
          >
            Admin Dashboard
          </Typography>

          <Typography color="text.secondary">
            Create, update, and manage your property listings.
          </Typography>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {/* Add/Edit form */}
        <Card
          elevation={0}
          sx={{
            mb: 5,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              {editingId ? "Edit Property" : "Add New Property"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs:12, md:6}}>
                  <TextField
                    fullWidth
                    required
                    label="Property Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item size={{ xs:12, md:6}}>
                  <TextField
                    fullWidth
                    required
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item size={{ xs:12, md:6}}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Price"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>

                <Grid item size={{ xs:12, md:6}}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Size (sq ft)"
                    name="size_sqft"
                    value={form.size_sqft}
                    onChange={handleChange}
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>

                <Grid item size={{ xs:12, md:6}}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Bedrooms"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>

                <Grid item size={{ xs:12}}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={3}
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Image file input */}
                <Grid item size={{ xs:12}}>
                  <Typography fontWeight={600} sx={{ mb: 1 }}>
                    Property Image
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ textTransform: "none" }}
                    >
                      Choose Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {imageFile && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {imageFile.name}
                      </Typography>
                    )}
                  </Stack>

                  {previewImage && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        component="img"
                        src={previewImage}
                        alt="Property preview"
                        sx={{
                          display: "block",
                          width: { xs: "100%", sm: 260 },
                          height: 170,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid #e5e7eb",
                        }}
                      />

                      <Button
                        size="small"
                        color="error"
                        sx={{ mt: 1, textTransform: "none" }}
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          setExistingImage("");
                        }}
                      >
                        Remove image
                      </Button>
                    </Box>
                  )}

                  {!previewImage && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      JPG, PNG, or another supported image format. Maximum 5 MB.
                    </Typography>
                  )}
                </Grid>

                <Grid item size={{ xs:12}}>
                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      sx={{
                        bgcolor: "#101828",
                        textTransform: "none",
                        px: 3,
                        "&:hover": { bgcolor: "#26354d" },
                      }}
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                          ? "Update Property"
                          : "Add Property"}
                    </Button>

                    {editingId && (
                      <Button
                        variant="outlined"
                        disabled={saving}
                        onClick={resetForm}
                        sx={{ textTransform: "none" }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Property list */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" fontWeight={700}>
            Existing Properties
          </Typography>

          <Typography color="text.secondary">
            {properties.length} listing{properties.length !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : properties.length === 0 ? (
          <Card elevation={0} sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No properties found. Add your first property above.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {properties.map((property) => {
              const imageUrl = getImageUrl(property.image);

              return (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid #e5e7eb",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    {imageUrl ? (
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={property.name}
                        sx={{
                          display: "block",
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          bgcolor: "#e5e7eb",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography color="text.secondary">
                          No image available
                        </Typography>
                      </Box>
                    )}

                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        {property.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {property.location}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{ mt: 2, color: "#101828", fontWeight: 700 }}
                      >
                        ₹{Number(property.price).toLocaleString("en-IN")}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {Number(property.size_sqft).toLocaleString("en-IN")} sq ft
                        {" · "}
                        {property.bedrooms} bedroom
                        {Number(property.bedrooms) !== 1 ? "s" : ""}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          mb: 2,
                          color: "#475467",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {property.description}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Stack direction="row" spacing={1}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleEdit(property)}
                          disabled={saving || deletingId === property.id}
                          sx={{ textTransform: "none" }}
                        >
                          Edit
                        </Button>

                        <Button
                          fullWidth
                          color="error"
                          variant="outlined"
                          disabled={
                            saving || deletingId === property.id
                          }
                          onClick={() => handleDelete(property.id)}
                          sx={{ textTransform: "none" }}
                        >
                          {deletingId === property.id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}