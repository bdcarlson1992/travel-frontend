import { type FC } from 'react';
import { type DayPlan } from '../../types';

interface Props {
  plan: DayPlan;
}

export const DailyItinerary: FC<Props> = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Day {plan.day}</h3>
      <div className="space-y-6">
        {/* Activities Section */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Activities</h4>
          <div className="space-y-4">
            {plan.activities.map((activity, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-800">{activity.name}</h5>
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {activity.duration}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{activity.description}</p>
                {activity.additionalInfo && (
                  <p className="text-sm text-gray-500 italic">{activity.additionalInfo}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Details Section */}
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

        {/* Estimated Costs Section */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Estimated Costs</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(plan.estimatedCosts).map(([category, amount]) => (
              <div key={category} className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-bold text-blue-600">${String(amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};