"use client";

export default function SkeletonMenu() {
  return (
    <ul className="space-y-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <li key={i} className="h-10 rounded-md bg-sidebar-accent/60 animate-pulse" />
      ))}
    </ul>
  );
}
