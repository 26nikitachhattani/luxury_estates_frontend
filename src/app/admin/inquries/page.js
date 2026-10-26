"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";

import { getInquiries } from "@/lib/api/inquiryApi";

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInquiries = useCallback(() => {
    setLoading(true);
    setError("");

    getInquiries()
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data?.results || [];

        setInquiries(items);
      })
      .catch((err) => {
        setError(
          err.apiMessage || "Failed to fetch inquiries."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Property Inquiries
          </Typography>
          <Typography color="text.secondary" variant="body2">
            All inquiries submitted by prospective buyers
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchInquiries}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : !error && inquiries.length === 0 ? (
        <Alert severity="info">
          No inquiries found.
        </Alert>
      ) : (
        !error && (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f6fa" }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Property</strong></TableCell>
                  <TableCell><strong>Message</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} hover>
                    <TableCell>{inquiry.name || "—"}</TableCell>
                    <TableCell>{inquiry.email || "—"}</TableCell>
                    <TableCell>{inquiry.phone || "—"}</TableCell>
                    <TableCell>
                      {typeof inquiry.property === "object"
                        ? inquiry.property?.name ||
                          `Property #${inquiry.property?.id ?? ""}`
                        : inquiry.property_name ||
                          (inquiry.property
                            ? `Property #${inquiry.property}`
                            : "—")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220, maxWidth: 350 }}>
                      {inquiry.message || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  );
}
