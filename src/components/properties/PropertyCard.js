
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
} from "@mui/material";

function formatPrice(price) {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Cr`;
  }

  return `₹${(price / 100000).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })} L`;
}

export default function PropertyCard({ property }) {
  const {
    id,
    name,
    location,
    price,
    area,
    bedrooms,
    beds,
    image,
    description,
  } = property;

  const bedroomCount = bedrooms ?? beds ?? 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #E9E5DD",
        borderRadius: 1,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(32,40,35,0.08)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={image || "/images/property-placeholder.jpg"}
        alt={name}
        sx={{
          height: 220,
          objectFit: "cover",
          bgcolor: "#D9DED5",
        }}
      />

      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: 25,
            mb: 1,
          }}
        >
          {formatPrice(price)}
        </Typography>

        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
          {name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#777D73", mt: 0.5, mb: 2 }}
        >
          {location}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1.5,
            borderTop: "1px solid #EEEAE3",
            borderBottom: "1px solid #EEEAE3",
          }}
        >
          <Typography variant="caption">
            {Number(area || 0).toLocaleString("en-IN")} sq ft
          </Typography>

          <Typography variant="caption">
            {bedroomCount} bedrooms
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "#777D73",
            lineHeight: 1.7,
            my: 2,
            minHeight: 48,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            component={Link}
            href={`/properties/${id}`}
            sx={{ color: "#152D29", fontWeight: 600 }}
          >
            Explore Property ↗
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
