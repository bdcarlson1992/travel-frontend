import React, { useState } from 'react';
import { MapPin, Users, Wallet, Heart, Calendar, CalendarDays, Sparkles, TreePine, Building } from 'lucide-react';

const TravelSearch = () => {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [formData, setFormData] = useState({
    startingPoint: '',
    tripType: [],
    travelers: 1,
    month: '',
    specificDates: { start: '', end: '' },
    duration: 7,
    budgetPerPerson: 1000,
    isInternational: false
  });

  const tripTypes = [
    { id: 'nightlife', icon: Sparkles, label: 'Nightlife & Partying' },
    { id: 'relaxation', icon: Heart, label: 'Relaxation & Wellness' },
    { id: 'wilderness', icon: TreePine, label: 'Off the Beaten Path' },
    { id: 'cultural', icon: Building, label: 'Cultural Immersion' },
    { id: 'romantic', icon: Heart, label: 'Romantic Getaway' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTripTypeChange = (id: string) => {
    const currentTypes = [...formData.tripType];
    const index = currentTypes.indexOf(id);
    
    if (index >= 0) {
      currentTypes.splice(index, 1);
    } else if (currentTypes.length < 2) {
      currentTypes.push(id);
    }
    handleInputChange('tripType', currentTypes);
  };

  const handleDateChange = (type: string, value: string) => {
    const newDates = { ...formData.specificDates, [type]: value };
    handleInputChange('specificDates', newDates);
    
    if (newDates.start && newDates.end) {
      const start = new Date(newDates.start);
      const end = new Date(newDates.end);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      handleInputChange('duration', days);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.startingPoint) {
      alert('Please enter a starting point');
      return;
    }
    if (formData.tripType.length === 0) {
      alert('Please select at least one trip type');
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting form data:', formData);
      
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('Received response:', data);
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setStep(4); // Move to recommendations view
      } else {
        console.error('Error:', data.error);
        alert('Failed to get recommendations. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-4">Starting Point</h2>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-blue-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Enter your city"
                  className="w-full p-3 pl-12 border-2 border-blue-200 rounded-xl"
                  value={formData.startingPoint}
                  onChange={(e) => handleInputChange('startingPoint', e.target.value)}
                />
              </div>
            </div>
  
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-4">Trip Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripTypes.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.tripType.includes(id)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => handleTripTypeChange(id)}
                    disabled={!formData.tripType.includes(id) && formData.tripType.length >= 2}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      formData.tripType.includes(id) ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <div className="text-center font-medium">
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
  
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Trip Details</h2>
            <div className="space-y-1">
              <label className="block text-gray-600 text-sm ml-1">How many people are traveling?</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-blue-500 w-6 h-6" />
                <input
                  type="number"
                  min="1"
                  placeholder="Number of travelers"
                  className="w-full p-3 pl-12 border-2 border-blue-200 rounded-xl"
                  value={formData.travelers || ''}
                  onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                />
              </div>
            </div>
  
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specificDates"
                  checked={showDatePicker}
                  onChange={(e) => {
                    setShowDatePicker(e.target.checked);
                    if (e.target.checked) {
                      handleInputChange('month', '');
                    }
                  }}
                  className="w-4 h-4 rounded border-blue-200"
                />
                <label htmlFor="specificDates" className="text-gray-600">
                  I have specific dates in mind
                </label>
              </div>
  
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-blue-500 w-6 h-6" />
                <select
                  className={`w-full p-3 pl-12 border-2 border-blue-200 rounded-xl ${
                    showDatePicker ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  disabled={showDatePicker}
                >
                  <option value="">Select month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              
              {showDatePicker ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-600 mb-2">Start Date</label>
                      <input
                        type="date"
                        className="w-full p-3 border-2 border-blue-200 rounded-xl"
                        value={formData.specificDates.start}
                        onChange={(e) => handleDateChange('start', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-600 mb-2">End Date</label>
                      <input
                        type="date"
                        className="w-full p-3 border-2 border-blue-200 rounded-xl"
                        value={formData.specificDates.end}
                        min={formData.specificDates.start}
                        onChange={(e) => handleDateChange('end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 text-blue-500 w-6 h-6" />
                  <input
                    type="number"
                    min="1"
                    placeholder="Number of days"
                    className="w-full p-3 pl-12 border-2 border-blue-200 rounded-xl"
                    value={formData.duration || ''}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
  
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="internationalTravel"
                  checked={formData.isInternational}
                  onChange={(e) => handleInputChange('isInternational', e.target.checked)}
                  className="w-4 h-4 rounded border-blue-200"
                />
                <label htmlFor="internationalTravel" className="text-gray-600">
                  I'm open to international destinations
                </label>
              </div>
            </div>
          </div>
        );
  
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-600 mb-2">Budget Per Person</h2>
            <p className="text-gray-600 text-sm mb-6">Including Flights, Accommodation, Food, Activities, etc.</p>
            <div className="px-4">
              <Wallet className="w-6 h-6 text-blue-500 mb-4" />
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                className="w-full h-2 bg-blue-200 rounded-lg"
                value={formData.budgetPerPerson}
                onChange={(e) => handleInputChange('budgetPerPerson', parseInt(e.target.value))}
              />
              <div className="text-center mt-4">
                <div className="text-xl font-bold text-blue-600 mb-1">
                  ${formData.budgetPerPerson}
                </div>
                <div className="text-sm text-gray-600">
                  Approximately ${Math.round(formData.budgetPerPerson / formData.duration)} per day
                </div>
              </div>
            </div>
          </div>
        );
  
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Your Travel Recommendations</h2>
            {recommendations ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(recommendations, null, 2)}</pre>
            ) : (
              <p>No recommendations available</p>
            )}
          </div>
        );
  
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${stepNumber <= step ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 mx-2 rounded ${
                stepNumber < step ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Finding your perfect destinations...</p>
        </div>
      ) : (
        <>
          {renderStep()}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <button
                className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto disabled:opacity-50"
              onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
              disabled={loading}
            >
              {step === 3 ? (loading ? 'Finding...' : 'Find Adventures') : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TravelSearch;