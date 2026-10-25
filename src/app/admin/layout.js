
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import Box from "@mui/material/Box";

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AdminHeader />
        <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
