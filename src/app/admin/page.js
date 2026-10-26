
"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "atelier-estates-properties";

const emptyProperty = {
  name: "",
  location: "",
  price: "",
  area: "",
  bedrooms: "",
  type: "Villa",
  description: "",
};

export default function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(emptyProperty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProperties(JSON.parse(saved));
    } catch {
      setMessage("Could not load saved properties.");
    }
  }, []);

  function saveProperties(updated) {
    setProperties(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const property = {
      ...form,
      id: editingId ?? String(Date.now()),
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
    };

    if (
      !property.name.trim() ||
      !property.location.trim() ||
      !property.description.trim() ||
      property.price <= 0 ||
      property.area <= 0 ||
      property.bedrooms <= 0
    ) {
      setMessage("Enter valid details in every field.");
      return;
    }

    const updated = editingId
      ? properties.map((item) =>
          String(item.id) === String(editingId) ? property : item
        )
      : [property, ...properties];

    saveProperties(updated);
    setForm(emptyProperty);
    setEditingId(null);
    setMessage(editingId ? "Property updated." : "Property added.");
  }

  function editProperty(property) {
    setForm({
      name: property.name,
      location: property.location,
      price: String(property.price),
      area: String(property.area),
      bedrooms: String(property.bedrooms ?? property.beds ?? ""),
      type: property.type ?? "Villa",
      description: property.description,
    });

    setEditingId(property.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteProperty(id) {
    if (!window.confirm("Delete this property?")) return;

    saveProperties(
      properties.filter((item) => String(item.id) !== String(id))
    );

    if (String(editingId) === String(id)) {
      setForm(emptyProperty);
      setEditingId(null);
    }

    setMessage("Property deleted.");
  }

  function cancelEdit() {
    setForm(emptyProperty);
    setEditingId(null);
    setMessage("");
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="overline" color="secondary.main">
        ATELIER ESTATES
      </Typography>

      <Typography variant="h3" sx={{ mb: 1 }}>
        Property Management
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Create listings, update property details, and manage your collection.
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {editingId ? "Edit Property" : "Add New Property"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            name="name"
            label="Property name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <TextField
            name="location"
            label="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <TextField
            name="price"
            label="Price (INR)"
            type="number"
            value={form.price}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />

          <TextField
            name="area"
            label="Area (sq ft)"
            type="number"
            value={form.area}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />

          <TextField
            name="bedrooms"
            label="Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />

          <TextField
            name="type"
            label="Property type"
            select
            value={form.type}
            onChange={handleChange}
          >
            {["Villa", "Residence", "Penthouse", "Estate", "Retreat"].map(
              (type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            multiline
            minRows={3}
            required
            sx={{ gridColumn: { sm: "1 / -1" } }}
          />

          <Stack direction="row" spacing={2} sx={{ gridColumn: "1 / -1" }}>
            <Button type="submit" variant="contained">
              {editingId ? "Save Changes" : "Add Property"}
            </Button>

            {editingId && (
              <Button onClick={cancelEdit} variant="outlined">
                Cancel
              </Button>
            )}
          </Stack>
        </Box>

        {message && (
          <Alert severity={message.includes("valid") || message.includes("Could not") ? "error" : "success"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Current Listings ({properties.length})
      </Typography>

      <Stack spacing={2}>
        {properties.map((property) => (
          <Paper
            key={property.id}
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box>
              <Typography fontWeight={600}>{property.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {property.location} · ₹
                {Number(property.price).toLocaleString("en-IN")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {property.area} sq ft ·{" "}
                {property.bedrooms ?? property.beds} bedrooms
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button onClick={() => editProperty(property)}>
                Edit
              </Button>
              <Button
                color="error"
                onClick={() => deleteProperty(property.id)}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}

        {properties.length === 0 && (
          <Alert severity="info">
            No saved properties yet. Add your first property above.
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
                                    