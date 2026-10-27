
"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Container, Typography } from "@mui/material";
import PropertyFilters from "./PropertyFilters";
import PropertyGrid from "./PropertyGrid";
import { getProperties } from "@/lib/api/propertyApi";

export default function PropertyListingSection() {
  const [filters, setFilters] = useState({
    search: "",
    bedrooms: "",
    location: "",
    sort: "featured",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Merge filter changes without resetting other filters.
  const handleFilter = (updates) => {
    setFilters((previous) => ({
      ...previous,
      ...updates,
    }));
  };

  useEffect(() => {
    getProperties()
      .then((data) => {
        const results = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];

        setProperties(results);
      })
      .catch((err) => {
        setError(
          err.apiMessage || "Failed to load properties."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const locations = useMemo(
    () => [
      ...new Set(
        properties
          .map((property) => property.location)
          .filter(Boolean)
      ),
    ],
    [properties]
  );

  const filteredProperties = useMemo(() => {
    const search = String(filters.search || "")
      .trim()
      .toLowerCase();

    let result = properties.filter((property) => {
      const name = String(property.name || "").toLowerCase();
      const location = String(
        property.location || ""
      ).toLowerCase();

      const matchesSearch =
        name.includes(search) ||
        location.includes(search);

      const bedroomCount = Number(
        property.bedrooms ?? property.beds
      );

      const matchesBedrooms =
        filters.bedrooms === "" ||
        (Number.isFinite(bedroomCount) &&
          bedroomCount >= Number(filters.bedrooms));

      const matchesLocation =
        filters.location === "" ||
        location === String(filters.location).toLowerCase();

      return (
        matchesSearch &&
        matchesBedrooms &&
        matchesLocation
      );
    });

    // Support the sort values used by PropertyFilters.
    if (
      filters.sort === "low" ||
      filters.sort === "price-low"
    ) {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (
      filters.sort === "high" ||
      filters.sort === "price-high"
    ) {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (filters.sort === "area") {
      result = [...result].sort(
        (a, b) =>
          Number(b.size_sqft ?? b.area ?? b.sqft ?? 0) -
          Number(a.size_sqft ?? a.area ?? a.sqft ?? 0)
      );
    }

    return result;
  }, [properties, filters]);

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
          filters={filters}
          onFilter={handleFilter}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading properties...</Typography>
      ) : !error && filteredProperties.length === 0 ? (
        <Typography>
          No properties match your filters.
        </Typography>
      ) : (
        <PropertyGrid properties={filteredProperties} />
      )}
    </Container>
  );
}
