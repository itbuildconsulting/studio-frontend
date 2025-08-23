// src/components/MenuSideBar/SkeletonMenu.tsx
"use client";

export default function SkeletonMenu() {
  // mantém a mesma estrutura: ul > li
  return (
    <ul className="py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="h-9 my-2 rounded-md bg-slate-200 animate-pulse" />
      ))}
    </ul>
  );
}
