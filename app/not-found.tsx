"use client";

import Link from "next/link";
import FuzzyText from "@/components/FuzzyText";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 relative z-10">

        {/* Animated 404 */}
        <div className="h-40 sm:h-56 relative w-full flex items-center justify-center pointer-events-auto" aria-hidden="true">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
          >
            404
          </FuzzyText>
        </div>

        {/* Accessible Text & Navigation */}
        <div className="space-y-6 bg-background/80 backdrop-blur-sm p-6 rounded-xl">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground sr-only">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
