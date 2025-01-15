export interface TravelPreferences {
  startingPoint: string;
  tripType: string[];
  travelers: number;
  month: string;
  specificDates: {
    start: string;
    end: string;
  };
  duration: number;
  budgetPerPerson: number;
  isInternational: boolean;
}

export interface Destination {
  city: string;
  country: string;
  matchScore: number;
  matchReason: string;
  ratings: {
    atmosphere: number;
    value: number;
    climate: number;
    activities: number;
  };
  activities: string[];
  itinerary?: {
    dailyItinerary: Array<{
      day: number;
      activities: string[];
      meals: {
        breakfast: string;
        lunch: string;
        dinner: string;
      };
      transportationType: string;
      accommodation: string;
      estimatedCosts?: {
        activities: number;
        meals: number;
        transport: number;
      };
    }>;
    travelRequirements: {
      visas: string[];
      vaccinations: string[];
      currencyTips: string[];
      customs: string[];
    };
    budgetBreakdown: {
      [key: string]: number;
    };
    locations: Array<{
      name: string;
      coordinates: [number, number];
      type: string;
    }>;
  };
}

export interface ItineraryProps {
  preferences: TravelPreferences;
  destination: Destination;
  itineraryData: any;
}