'use client'

import { PrivateRoute } from "@/components/privateRoute/privateRoute";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
}
