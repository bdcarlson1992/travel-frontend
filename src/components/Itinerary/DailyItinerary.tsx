interface EstimatedCosts {
  activities: number;
  meals: number;
  transport: number;
  [key: string]: number;
}

interface Meal {
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface DayPlan {
  day: number;
  activities: string[];
  meals: Meal;
  accommodation: string;
  transportationType: string;
  estimatedCosts: EstimatedCosts;
}

interface DailyItineraryProps {
  plan: DayPlan;
}

export const DailyItinerary = ({ plan }: DailyItineraryProps) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-blue-600 mb-4">Day {plan.day}</h3>
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Activities</h4>
        <ul className="space-y-2">
          {plan.activities.map((activity, index) => (
            <li key={index} className="text-gray-600 flex items-start">
              <span className="mr-2">•</span>
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Meals</h4>
        <div className="space-y-1">
          <p className="text-gray-600">Breakfast: {plan.meals.breakfast}</p>
          <p className="text-gray-600">Lunch: {plan.meals.lunch}</p>
          <p className="text-gray-600">Dinner: {plan.meals.dinner}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Daily Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Transportation:</p>
            <p className="text-gray-800">{plan.transportationType}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Accommodation:</p>
            <p className="text-gray-800">{plan.accommodation}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Estimated Costs</h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(plan.estimatedCosts).map(([category, amount]) => (
            <div key={category} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{category}</p>
              <p className="font-bold text-blue-600">${amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
