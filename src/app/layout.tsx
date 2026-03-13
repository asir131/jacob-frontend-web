import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { Toaster } from "sonner";

export const metadata = {
  title: "LocallyServe - Home Services Marketplace",
  description: "Share home services with your neighborhood — collaborate and cut costs together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <LocationProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
