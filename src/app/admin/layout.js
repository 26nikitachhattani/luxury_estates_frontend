"use client";
import { Box } from "@mui/material";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import { Suspense} from "react";

export default function AdminLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F6F4EF",
      }}
    >
         <Suspense fallback={<PropertyLoading />}>
      <AdminSidebar />
      </Suspense>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AdminHeader />

        <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
