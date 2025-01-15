interface BudgetBreakdownCosts {
  transportation: number;
  accommodation: number;
  activities: number;
  food: number;
  misc: number;
  [key: string]: number; // This allows for any additional dynamic categories
}

interface BudgetBreakdownProps {
  costs: BudgetBreakdownCosts;
  budget: number;
}

export const BudgetBreakdown = ({ costs, budget }: BudgetBreakdownProps) => {
  const total = Object.values(costs).reduce((sum, amount) => sum + amount, 0); // Calculate total cost
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-blue-600">Budget Breakdown</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Estimated Cost</p>
          <p className="text-2xl font-bold text-blue-600">${total.toLocaleString()}</p> {/* Use .toLocaleString() for formatting */}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(costs).map(([category, amount]) => (
          <div key={category} className="flex justify-between items-center">
            <span className="text-gray-700 capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()} {/* Capitalize categories */}
            </span>
            <div className="flex items-center gap-4">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((amount / budget) * 100, 100)}%` // Progress bar for cost percentage
                  }}
                />
              </div>
              <span className="font-medium text-gray-900 min-w-[80px] text-right">
                ${amount.toLocaleString()} {/* Format the cost with commas */}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Budget</span>
          <span>${budget.toLocaleString()}</span> {/* Format the budget */}
        </div>
        <div className="flex justify-between text-sm">
          <span>Remaining</span>
          <span className={budget - total >= 0 ? 'text-green-600' : 'text-red-600'}>
            ${(budget - total).toLocaleString()} {/* Format remaining amount */}
          </span>
        </div>
      </div>
    </div>
  );
};
