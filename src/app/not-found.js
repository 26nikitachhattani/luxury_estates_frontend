export default function NotFound() {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "24px",
          backgroundColor: "#F6F4EF",
          color: "#202823",
        }}
      >
        <h1 style={{ fontSize: "72px", margin: 0 }}>404</h1>
  
        <h2>Page Not Found</h2>
  
        <p>
          Sorry, the property or page you are looking for does not exist.
        </p>
  
        <a
          href="/"
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#152D29",
            color: "#FFFFFF",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Back to Properties
        </a>
      </main>
    );
  }