"use client";

import { Box, Button, MenuItem, TextField } from "@mui/material";

const initialFilters = {
  search: "",
  bedrooms: "",
  location: "",
  sort: "featured",
};

export default function PropertyFilters({
  filters = initialFilters,
  onFilter,
  locations = [],
}) {
  function updateFilter(event) {
    const { name, value } = event.target;

    if (typeof onFilter === "function") {
      onFilter({ [name]: value });
    }
  }

  function handleReset() {
    if (typeof onFilter === "function") {
      onFilter({ ...initialFilters });
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => event.preventDefault()}
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
        borderRadius: 2,
      }}
    >
      <TextField
        label="Search properties"
        name="search"
        value={filters.search}
        onChange={updateFilter}
        size="small"
        placeholder="Name or location"
        fullWidth
      />

      <TextField
        select
        label="Bedrooms"
        name="bedrooms"
        value={filters.bedrooms}
        onChange={updateFilter}
        size="small"
        fullWidth
      >
        <MenuItem value="">Any</MenuItem>
        {[2, 3, 4, 5].map((number) => (
          <MenuItem key={number} value={String(number)}>
            {number}+ bedrooms
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Location"
        name="location"
        value={filters.location}
        onChange={updateFilter}
        size="small"
        fullWidth
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
        fullWidth
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
          justifyContent: "flex-end",
        }}
      >
        <Button type="button" onClick={handleReset} color="inherit">
          Reset
        </Button>
      </Box>
    </Box>
  );
}