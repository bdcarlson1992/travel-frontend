import React from 'react';
import { GlobeIcon, Heart, CircleDollarSign, ShieldAlert, AlertCircle } from 'lucide-react';

interface Requirements {
  visas: string[];
  vaccinations: string[];
  currencyTips: string[];
  customs: string[];
  entryRequirements?: string[];
  healthAndSafety?: string[];
}

interface TravelRequirementsProps {
  requirements: Requirements;
  startingPoint: string;
  destination: string;
}

export const TravelRequirements = ({ requirements, startingPoint, destination }: TravelRequirementsProps) => {
  const requirementSections = [
    {
      title: 'Entry & Visa Requirements',
      icon: GlobeIcon,
      items: requirements.visas,
      color: 'blue'
    },
    {
      title: 'Health Requirements',
      icon: Heart,
      items: requirements.vaccinations,
      color: 'green'
    },
    {
      title: 'Currency & Money',
      icon: CircleDollarSign,
      items: requirements.currencyTips,
      color: 'yellow'
    },
    {
      title: 'Customs & Regulations',
      icon: ShieldAlert,
      items: requirements.customs,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Travel Requirements</h3>
        <div className="text-sm text-gray-500">
          For travelers from {startingPoint} to {destination}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requirementSections.map((section) => (
          <div 
            key={section.title} 
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <section.icon className={`w-5 h-5 text-${section.color}-500`} />
              <h4 className="font-semibold text-gray-800">{section.title}</h4>
            </div>
            <ul className="space-y-2">
              {section.items?.length > 0 ? (
                section.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2 text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Information not available</span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">
          <AlertCircle className="inline-block w-4 h-4 mr-2" />
          Requirements may change. Always verify with official sources before travel.
        </p>
      </div>
    </div>
  );
};