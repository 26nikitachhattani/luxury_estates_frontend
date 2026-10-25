"use client"
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
