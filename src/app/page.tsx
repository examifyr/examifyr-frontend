export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to Examifyr
      </h1>
      <p style={{ fontSize: "1.25rem", opacity: 0.8 }}>
        AI-powered exam preparation platform
      </p>
    </main>
  );
}