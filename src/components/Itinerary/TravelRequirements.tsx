interface Requirements {
  visas: string[];
  vaccinations: string[];
  currencyTips: string[];
  customs: string[];
  [key: string]: string[];
}

interface TravelRequirementsProps {
  requirements: Requirements;
}

export const TravelRequirements = ({ requirements }: TravelRequirementsProps) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold mb-4">Travel Requirements</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(requirements).map(([category, items]: [string, string[]]) => (
        <div key={category}>
          <h4 className="font-semibold mb-2 capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <ul className="list-disc pl-4 space-y-2">
            {items.map((item: string, index: number) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);