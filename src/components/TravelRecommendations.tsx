import React from 'react';

interface Destination {
  city: string;
  country: string;
  matchPercentage: number;
  keyPoints: {
    matchReason: string;
    activities: string[];
    bestAreas: string[];
    seasonalConsiderations: string;
  };
}

const calculateMatchPercentage = (destination: any): number => {
  // Base score for being in the top 5
  let score = 60;
  
  // Add points for different factors
  if (destination.includes("direct flights") || destination.includes("easily accessible")) score += 10;
  if (destination.includes("perfect time") || destination.includes("ideal time")) score += 10;
  if (destination.includes("budget") && destination.includes("luxury")) score += 10;
  if (destination.includes("cultural") && destination.includes("relaxation")) score += 10;

  return Math.min(score, 100);
};

const parseDestinations = (recommendations: string): Destination[] => {
  const destinations = recommendations.split('### Destination').slice(1);
  
  return destinations.map(dest => {
    const [cityCountry] = dest.split('\n')[0].split(':')[1].trim().split(', ');
    const matchReason = dest.split('**Why it\'s a perfect match**:')[1].split('\n')[0].trim();
    const activities = dest.split('**Must-do activities and experiences**:')[1]
      .split('**Best areas to stay**:')[0]
      .split('-')
      .slice(1)
      .map(act => act.trim());
    
    return {
      city: cityCountry.split(', ')[0],
      country: cityCountry.split(', ')[1],
      matchPercentage: calculateMatchPercentage(dest),
      keyPoints: {
        matchReason,
        activities,
        bestAreas: [],
        seasonalConsiderations: ''
      }
    };
  });
};

interface TravelRecommendationsProps {
  recommendations: string;
  onDiscoverMore: (destination: Destination) => void;
}

export const TravelRecommendations: React.FC<TravelRecommendationsProps> = ({ 
  recommendations, 
  onDiscoverMore 
}) => {
  const destinations = parseDestinations(recommendations);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {destinations.map((dest, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-blue-500">
            <img 
              src={`/api/placeholder/400/200`} 
              alt={`${dest.city}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full h-16 w-16 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{dest.matchPercentage}%</div>
                <div className="text-xs text-blue-400">match</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {dest.city}, {dest.country}
            </h3>
            
            <p className="text-gray-600 mb-4">{dest.keyPoints.matchReason}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Top Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {dest.keyPoints.activities.slice(0, 3).map((activity, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => onDiscoverMore(dest)}
            >
              Discover More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
