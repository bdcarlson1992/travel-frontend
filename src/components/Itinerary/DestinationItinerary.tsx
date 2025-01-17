import { TravelPreferences, Destination } from '../../types';
import { TripMap } from './TripMap';
import { BudgetBreakdown } from './BudgetBreakdown';
import { TravelRequirements } from './TravelRequirements';
import { DailyItinerary } from './DailyItinerary';

interface ItineraryProps {
  preferences: TravelPreferences;
  destination: Destination;
  itineraryData: {
    locations: Array<{
      name: string;
      coordinates: [number, number];
      type: string;
    }>;
    requirements: {
      visas: string[];
      vaccinations: string[];
      currencyTips: string[];
      customs: string[];
    };
    costs: {
      transportation: number;
      accommodation: number;
      activities: number;
      food: number;
      misc: number;
      [key: string]: number;
    };
    days: Array<{
      day: number;
      activities: string[];
      meals: {
        breakfast: string;
        lunch: string;
        dinner: string;
      };
      transportationType: string;
      accommodation: string;
      estimatedCosts: {
        activities: number;
        meals: number;
        transport: number;
      };
    }>;
  };
}

export const DestinationItinerary = ({ preferences, itineraryData }: ItineraryProps) => {
  const costs = {
    ...itineraryData.costs,
    transportation: itineraryData.costs.transportation || 0,
    accommodation: itineraryData.costs.accommodation || 0,
    activities: itineraryData.costs.activities || 0,
    food: itineraryData.costs.food || 0,
    misc: itineraryData.costs.misc || 0,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {itineraryData.locations && itineraryData.locations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TripMap locations={itineraryData.locations} />
        </div>
      )}

      <TravelRequirements requirements={itineraryData.requirements} />
      
      <BudgetBreakdown
        costs={costs}
        budget={preferences.budgetPerPerson}
      />
      
      <div className="space-y-6">
        {itineraryData.days.map((day) => (
          <DailyItinerary
            key={day.day}
            plan={{
              day: day.day,
              activities: day.activities,
              meals: {
                breakfast: day.meals?.breakfast || 'Local breakfast',
                lunch: day.meals?.lunch || 'Local lunch',
                dinner: day.meals?.dinner || 'Local dinner'
              },
              transportationType: day.transportationType || 'Walking',
              accommodation: day.accommodation || 'Hotel',
              estimatedCosts: {
                activities: day.estimatedCosts?.activities || 0,
                meals: day.estimatedCosts?.meals || 0,
                transport: day.estimatedCosts?.transport || 0
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};