import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      <div className="bg-primary/10 p-6 rounded-full mb-6 warm-shadow-md">
        <FileQuestion className="w-12 h-12 text-primary" />
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-2 text-foreground">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8">
        The page you are looking for does not exist or has been moved. Please check the URL or navigate back.
      </p>
      <Link href="/">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
