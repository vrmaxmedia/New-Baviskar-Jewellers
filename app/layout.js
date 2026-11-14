export const metadata = {
  title: "New Baviskar Jewellers | AI Review Generator",
  description:
    "Share your experience at New Baviskar Jewellers, Garkheda, Chhatrapati Sambhajinagar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f5ebd6",
        }}
      >
        {children}
      </body>
    </html>
  );
}
