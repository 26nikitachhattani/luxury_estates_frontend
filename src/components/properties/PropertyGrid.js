
import { Box, Typography } from "@mui/material";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties = [] }) {
  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ color: "#777D73", mb: 3 }}
      >
        {properties.length}{" "}
        {properties.length === 1 ? "property" : "properties"} found
      </Typography>

      {properties.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontFamily: "Georgia, serif" }}>
            No properties found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try changing your search filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
