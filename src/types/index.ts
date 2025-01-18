// Activity interface for detailed activity information
export interface Activity {
  name: string;
  duration: string;
  description: string;
  details?: string[];  // Array of detailed breakdown points
  additionalInfo?: string;
}

// EstimatedCosts interface
export interface EstimatedCosts {
  activities: number;
  meals: number;
  transport: number;
}

// DayPlan interface for detailed daily itinerary
export interface DayPlan {
  day: number;
  activities: Activity[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  transportationType: string;
  accommodation: string;
  estimatedCosts: EstimatedCosts;
}

// Props interface for DailyItinerary component
export interface DailyItineraryProps {
  plan: DayPlan;
}

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
    dailyItinerary: DayPlan[];  // Updated to use DayPlan interface
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
    days: DayPlan[];  // Updated to use DayPlan interface
  };
}