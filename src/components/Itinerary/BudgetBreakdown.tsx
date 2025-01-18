interface BudgetBreakdownCosts {
  transportation: number;
  accommodation: number;
  activities: number;
  food: number;
  misc: number;
  [key: string]: number;
}

interface BudgetBreakdownProps {
  costs: BudgetBreakdownCosts;
  budget: number;
}

export const BudgetBreakdown = ({ costs, budget }: BudgetBreakdownProps) => {
  const total = Object.values(costs).reduce((sum, amount) => sum + amount, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
        <h3 className="text-xl font-bold text-blue-600">Budget Breakdown</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Estimated Cost</p>
          <p className="text-2xl font-bold text-blue-600">${total.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(costs).map(([category, amount]) => (
          <div key={category} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-gray-700 capitalize w-full sm:w-1/4">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-3/4 justify-between">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-grow">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((amount / budget) * 100, 100)}%`
                  }}
                />
              </div>
              <span className="font-medium text-gray-900 min-w-[80px] text-right">
                ${amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Budget</span>
          <span>${budget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Remaining</span>
          <span className={budget - total >= 0 ? 'text-green-600' : 'text-red-600'}>
            ${(budget - total).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};