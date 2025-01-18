import { type FC } from 'react';
import { type DayPlan } from '../../types';
import { Clock } from 'lucide-react';

interface Props {
  plan: DayPlan;
}

export const DailyItinerary: FC<Props> = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-blue-600 mb-6">Day {plan.day}</h3>
      <div className="space-y-8">
        {/* Activities Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Activities</h4>
          <div className="space-y-6">
            {plan.activities.map((activity, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                {/* Activity Header */}
                <div className="flex justify-between items-start mb-4">
                  <h5 className="text-xl font-bold text-gray-900">{activity.name}</h5>
                  <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 mr-1.5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      {activity.duration}
                    </span>
                  </div>
                </div>
                
                {/* Main Activity Description */}
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {activity.description}
                  </p>

                  {/* Detailed Activity Breakdown */}
                  {activity.details && (
                    <div className="mt-4 space-y-3">
                      <h6 className="text-base font-semibold text-gray-800">What to Expect:</h6>
                      <div className="pl-4 space-y-2">
                        {activity.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 leading-relaxed">
                            • {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tips and Additional Info */}
                  {activity.additionalInfo && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-700 italic leading-relaxed">
                        💡 Pro Tip: {activity.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Costs Section - Simplified */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Estimated Activity Costs</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              ${plan.estimatedCosts.activities || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};