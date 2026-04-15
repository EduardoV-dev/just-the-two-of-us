"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { heroText, fadeInUp } from "@/lib/animations";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.redirectTo || "/home");
      } else {
        setError("Eso no es correcto. Intenta de nuevo.");
        setPassword("");
      }
    } catch {
      setError("Algo salió mal. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm text-center"
        initial="hidden"
        animate="visible"
        variants={heroText}
      >
        <motion.h1
          className="mb-3 font-heading text-4xl text-text-primary md:text-5xl"
          variants={heroText}
        >
          Solo Nosotros Dos
        </motion.h1>
        <motion.p className="mb-10 text-lg text-text-muted" variants={fadeInUp}>
          Este es nuestro lugar privado.
        </motion.p>

        <motion.form onSubmit={handleSubmit} className="space-y-4" variants={fadeInUp}>
          <input
            type="password"
            ref={inputRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter our secret"
            className="w-full rounded-xl border border-border bg-surface px-5 py-3.5 text-center text-base text-text-primary transition-colors placeholder:text-text-muted focus:border-accent focus:outline-none"
            required
          />
          {error && <p className="text-sm text-accent-hover">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "..." : "Enter"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
