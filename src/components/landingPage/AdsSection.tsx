import Link from 'next/link';
import { getHomeAds } from '@/actions/getHomeAds';

const ADS_INTERVAL_SECONDS = 7;
const ADS_FADE_MS = 300;

const AdsSection = async () => {
  const ads = await getHomeAds();
  if (!ads || ads.length === 0) return null;

  const totalSeconds = ads.length * ADS_INTERVAL_SECONDS;
  const totalMs = totalSeconds * 1000;
  const slotPercent = 100 / ads.length;
  const fadePercent = Math.min(slotPercent / 2, (ADS_FADE_MS / totalMs) * 100);
  const visibleEnd = Math.max(fadePercent, slotPercent - fadePercent);
  const keyframes = `
@keyframes adCycle {
  0% { opacity: 0; visibility: hidden; }
  ${fadePercent}% { opacity: 1; visibility: visible; }
  ${visibleEnd}% { opacity: 1; visibility: visible; }
  ${slotPercent}% { opacity: 0; visibility: hidden; }
  100% { opacity: 0; visibility: hidden; }
}
`;

  return (
    <div>
      <style>{keyframes}</style>
      <h2
        className="text-lg font-semibold text-gray-700"
        style={{ color: '#1A237E' }}
      >
        Advertisements
      </h2>
      <div className="relative w-full border border-gray-300 rounded-md overflow-hidden mt-2 h-64">
        {ads.map((ad, index) => (
          <Link
            key={ad.id}
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={ad.title}
            className="absolute inset-0 block h-full"
            style={{
              animation: `adCycle ${totalSeconds}s infinite`,
              animationDelay: `${index * ADS_INTERVAL_SECONDS}s`,
              animationFillMode: 'both',
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                width={400}
                height={288}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white p-3">
                <p className="text-sm font-medium">{ad.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdsSection;
