import "./globals.css";

export const metadata = {
  title: "Website Builder",
  description: "Build websites visually",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen bg-black text-white">{children}</body>
    </html>
  );
}
