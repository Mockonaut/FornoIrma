"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerAction } from "@/lib/actions";

// ─── Login ────────────────────────────────────────────────────────────────────

const LoginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Inserisci la password"),
});
type LoginData = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Credenziali non valide. Riprova.");
    } else {
      router.push("/profilo");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label mb-1.5" htmlFor="email">Email</label>
        <input id="email" type="email" className="input" placeholder="nome@esempio.it" {...register("email")} />
        {errors.email && <p className="error-text mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label mb-1.5" htmlFor="password">Password</label>
        <input id="password" type="password" className="input" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="error-text mt-1">{errors.password.message}</p>}
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Accesso in corso…" : "Accedi"}
      </button>
    </form>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  name: z.string().min(2, "Inserisci il tuo nome (min. 2 caratteri)"),
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "Minimo 8 caratteri"),
  phone: z.string().optional(),
});
type RegisterData = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, null);

  const {
    register,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: zodResolver(RegisterSchema) });

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label mb-1.5" htmlFor="name">Nome e cognome</label>
        <input id="name" name="name" type="text" className="input" placeholder="Mario Rossi" required />
        {errors.name && <p className="error-text mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label mb-1.5" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" placeholder="nome@esempio.it" required />
        {errors.email && <p className="error-text mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label mb-1.5" htmlFor="phone">Telefono (opzionale)</label>
        <input id="phone" name="phone" type="tel" className="input" placeholder="+39 333 1234567" />
      </div>
      <div>
        <label className="label mb-1.5" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" placeholder="Minimo 8 caratteri" required />
        {errors.password && <p className="error-text mt-1">{errors.password.message}</p>}
      </div>
      {state?.error && <p className="error-text">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Registrazione…" : "Crea account"}
      </button>
    </form>
  );
}
