"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Branding Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-[hsl(20,33%,18%)] relative overflow-hidden">
        <div className="z-10 max-w-xl">
          <h1 className="font-display text-5xl font-bold text-[hsl(39,40%,92%)] mb-4">
            Dayflow
          </h1>
          <p className="text-xl text-[hsl(39,25%,65%)] font-light leading-relaxed">
            Human Resource Management, Simplified.
          </p>
          <div className="mt-12 space-y-4">
            <div className="h-px w-16 bg-[hsl(39,25%,65%)]/30"></div>
            <p className="text-[hsl(39,40%,92%)]/70 text-sm">
              Join your team and experience intuitive tools to manage your workday, performance, and more seamlessly.
            </p>
          </div>
        </div>
        {/* Subtle decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[hsl(24,55%,44%)] blur-3xl mix-blend-screen" />
          <div className="absolute bottom-0 left-12 w-72 h-72 rounded-full bg-[hsl(39,40%,92%)] blur-3xl mix-blend-overlay opacity-10" />
        </div>
      </div>

      {/* Right Signup Panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-display text-4xl font-bold text-primary mb-2">Dayflow</h1>
            <p className="text-muted-foreground text-sm">Human Resource Management, Simplified.</p>
          </div>

          <div className="bg-card p-8 rounded-2xl warm-shadow-lg border border-border">
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground">Create account</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your details to get started
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-success bg-success/10 rounded-md border border-success/20 text-center">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="firstName">First Name</label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    disabled={loading}
                    className="focus-visible:ring-primary/30 border-border bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="lastName">Last Name</label>
                  <Input
                    id="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    disabled={loading}
                    className="focus-visible:ring-primary/30 border-border bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="focus-visible:ring-primary/30 border-border bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="focus-visible:ring-primary/30 border-border bg-background/50"
                />
              </div>

              <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-5" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Creating account..." : "Sign up"}
              </Button>

              <div className="text-center mt-6 text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:text-accent font-medium transition-colors">
                  Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
