
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

export default function PropertyFilters({
  onFilter,
  locations = [],
}) {
  const [filters, setFilters] = useState({
    search: "",
    bedrooms: "",
    location: "",
    sort: "featured",
  });

  function updateFilter(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onFilter(filters);
  }

  function handleReset() {
    const initialFilters = {
      search: "",
      bedrooms: "",
      location: "",
      sort: "featured",
    };

    setFilters(initialFilters);
    onFilter(initialFilters);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          md: "2fr 1fr 1fr 1fr",
        },
        gap: 2,
        p: 2,
        bgcolor: "#fff",
        border: "1px solid #e4e0d8",
      }}
    >
      <TextField
        label="Search properties"
        name="search"
        value={filters.search}
        onChange={updateFilter}
        size="small"
        placeholder="Name or location"
      />

      <TextField
        select
        label="Bedrooms"
        name="bedrooms"
        value={filters.bedrooms}
        onChange={updateFilter}
        size="small"
      >
        <MenuItem value="">Any</MenuItem>
        <MenuItem value="2">2+ bedrooms</MenuItem>
        <MenuItem value="3">3+ bedrooms</MenuItem>
        <MenuItem value="4">4+ bedrooms</MenuItem>
        <MenuItem value="5">5+ bedrooms</MenuItem>
      </TextField>

      <TextField
        select
        label="Location"
        name="location"
        value={filters.location}
        onChange={updateFilter}
        size="small"
      >
        <MenuItem value="">All locations</MenuItem>
        {locations.map((location) => (
          <MenuItem key={location} value={location}>
            {location}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sort by"
        name="sort"
        value={filters.sort}
        onChange={updateFilter}
        size="small"
      >
        <MenuItem value="featured">Featured</MenuItem>
        <MenuItem value="low">Price: Low to high</MenuItem>
        <MenuItem value="high">Price: High to low</MenuItem>
        <MenuItem value="area">Largest first</MenuItem>
      </TextField>

      <Box
        sx={{
          gridColumn: "1 / -1",
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        <Button type="button" onClick={handleReset} color="inherit">
          Reset
        </Button>

        <Button type="submit" variant="contained">
          Find a home
        </Button>
      </Box>
    </Box>
  );
}
