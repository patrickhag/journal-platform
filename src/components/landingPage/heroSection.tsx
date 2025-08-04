import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-academic-blue-light/20 to-academic-teal/20 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          JAEPH is calling for new manuscripts
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Submit your groundbreaking research in African epidemiology and public
          health. Join our community of leading researchers making a difference
          in healthcare across Africa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/articles/new/start">
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Submit Research
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/articles/issues">
            <Button variant="outline" size="lg">
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
