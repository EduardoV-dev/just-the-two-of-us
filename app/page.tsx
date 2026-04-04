"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { heroText, fadeInUp } from "@/lib/animations";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        router.push("/home");
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
          className="font-heading text-4xl md:text-5xl text-text-primary mb-3"
          variants={heroText}
        >
          Solo Nosotros Dos
        </motion.h1>
        <motion.p className="text-text-muted text-lg mb-10" variants={fadeInUp}>
          Este es nuestro lugar privado.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          variants={fadeInUp}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter our secret"
            className="w-full px-5 py-3.5 rounded-xl bg-surface border border-border text-text-primary text-center text-base placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            autoFocus
            required
          />
          {error && <p className="text-sm text-accent-hover">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3.5 rounded-xl bg-accent text-white text-base font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Enter"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
