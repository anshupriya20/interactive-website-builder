import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Website Builder",
  description: "Build websites visually",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-black text-white ${inter.className}`}>
        {children}

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #3f3f46",
            },
          }}
        />
      </body>
    </html>
  );
}
