"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      <div className="bg-destructive/10 p-6 rounded-full mb-6 text-destructive warm-shadow-md">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-2 text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8">
        An unexpected error occurred while processing your request. Our system has logged the issue.
      </p>
      <Button size="lg" onClick={() => reset()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Try Again
      </Button>
    </div>
  );
}
