type Sponsor = {
  id: string;
  link: string;
  logo: string;
};

interface SponsorsSectionProps {
  sponsors?: Sponsor[] | null;
}

export function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2
        className="text-lg font-semibold text-gray-700 mb-3"
        style={{ color: '#1A237E' }}
      >
        Supported by
      </h2>
      <div className="flex flex-col space-y-4">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <img
              src={sponsor.logo}
              alt="Sponsor logo"
              className="max-w-full max-h-20 object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
