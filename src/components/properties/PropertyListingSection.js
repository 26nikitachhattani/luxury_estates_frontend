
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

  // Fetch properties from Django when the component mounts.
  useEffect(() => {
    getProperties()
      .then((data) => {
        const results = Array.isArray(data)
          ? data
          : data?.results || [];

        setProperties(results);
      })
      .catch((error) => {
        setError(
          error.apiMessage || "Failed to load properties."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Generate filter locations from the fetched properties.
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

  // Filter and sort the fetched properties.
  const filteredProperties = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const result = properties.filter((property) => {
      const matchesSearch =
        (property.name || "").toLowerCase().includes(search) ||
        (property.location || "").toLowerCase().includes(search);

      const matchesBedrooms =
        !filters.bedrooms ||
        property.bedrooms >= Number(filters.bedrooms);

      const matchesLocation =
        !filters.location ||
        property.location === filters.location;

      return (
        matchesSearch &&
        matchesBedrooms &&
        matchesLocation
      );
    });

    if (filters.sort === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    } else if (filters.sort === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    } else if (filters.sort === "area") {
      result.sort(
        (a, b) => Number(b.size_sqft) - Number(a.size_sqft)
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
          onFilter={setFilters}
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
