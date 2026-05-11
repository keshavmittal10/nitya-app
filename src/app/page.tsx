"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const NityaApp = dynamic(() => import("./NityaApp"), { ssr: false });

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
      <NityaApp />
    </div>
  );
}
