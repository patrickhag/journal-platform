import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-16 lg:py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
          JAEP Health Science is calling for new manuscripts
        </h1>
        <p className="text-lg md:text-lg text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Submit your groundbreaking research in African epidemiology and public
          health. Join our community of leading researchers making a difference
          in healthcare across Africa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/author/new-manuscript">
            <Button
              size="lg"
              className="text-white px-3 py-2 rounded bg-[#212c9e] hover:bg-[#1A237E]"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Submit Research
              <ArrowRight className="w-4 h-4 ml-2" />
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
