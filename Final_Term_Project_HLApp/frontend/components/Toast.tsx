"use client";

export default function Toast({ message, tone = "success" }: { message: string; tone?: "success" | "error" }) {
  if (!message) return null;
  return <div className={`toast ${tone}`}>{message}</div>;
}
