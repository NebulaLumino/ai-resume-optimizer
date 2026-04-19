import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AI Resume Optimizer & Keyword Matcher",
  description: "Optimize your resume for any job with AI-powered keyword matching",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
