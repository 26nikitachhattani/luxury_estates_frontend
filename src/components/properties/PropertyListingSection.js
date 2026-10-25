"use client";

import { useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import PropertyFilters from "./PropertyFilters";
import PropertyGrid from "./PropertyGrid";
import properties from "@/data/properties";

export default function PropertyListingSection() {
  const [filters, setFilters] = useState({
    search: "",
    bedrooms: "",
    location: "",
    sort: "featured",
  });

  const locations = [...new Set(
    properties.map((property) => property.location.split(", ").at(-1))
  )];

  const filteredProperties = useMemo(() => {
    let result = properties.filter((property) => {
      const search = filters.search.toLowerCase();

      const matchesSearch =
        property.name.toLowerCase().includes(search) ||
        property.location.toLowerCase().includes(search);

      const matchesBedrooms =
        !filters.bedrooms ||
        property.bedrooms >= Number(filters.bedrooms);

      const matchesLocation =
        !filters.location ||
        property.location.includes(filters.location);

      return matchesSearch && matchesBedrooms && matchesLocation;
    });

    if (filters.sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "area") {
      result.sort((a, b) => b.area - a.area);
    }

    return result;
  }, [filters]);

  return (
    <Container id="properties" maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          color="secondary.main"
          letterSpacing={3}
        >
          THE COLLECTION
        </Typography>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Exceptional Properties
        </Typography>

        <PropertyFilters
          locations={locations}
          onFilter={setFilters}
        />
      </Box>

      <PropertyGrid properties={filteredProperties} />
    </Container>
  );
}
