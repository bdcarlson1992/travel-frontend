import { useState } from 'react';
import { MapPin, Users, Wallet, Heart, Calendar, CalendarDays, Sparkles, TreePine, Building } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TravelPreferences, Destination } from '../types';
import { TravelRequirements } from './Itinerary/TravelRequirements';
import { BudgetBreakdown } from './Itinerary/BudgetBreakdown';
import { DailyItinerary } from './Itinerary/DailyItinerary';

const TravelSearch = () => {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<TravelPreferences>({
    startingPoint: '',
    tripType: [] as string[],
    travelers: 1,
    month: '',
    specificDates: { start: '', end: '' },
    duration: 7,
    budgetPerPerson: 1000,
    isInternational: true
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleInputChange = (field: keyof TravelPreferences, value: any) => {
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
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDates = { ...formData.specificDates };
    newDates[type] = value;
    
    if (type === 'start') {
      if (!newDates.end) {
        newDates.end = value;
      }
      else if (newDates.end < value) {
        newDates.end = value;
      }
    }

    handleInputChange('specificDates', newDates);
    
    if (newDates.start && newDates.end) {
      const start = new Date(newDates.start);
      const end = new Date(newDates.end);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      handleInputChange('duration', days);
    }
  };

  const handleSubmit = async () => {
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
      
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setStep(4);
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

  const handleViewItinerary = async (destination: Destination) => {
    try {
      setLoading(true);
      console.log('Viewing itinerary for:', destination);
      
      const response = await fetch(`${API_URL}/api/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: formData,
          destination: destination
        })
      });
      
      const data = await response.json();
      console.log('Itinerary response:', data);
      
      if (data.success && data.itinerary) {
        const rawItinerary = typeof data.itinerary === 'string' ? 
          JSON.parse(data.itinerary) : data.itinerary;

        console.log('Raw itinerary:', rawItinerary);

        const transformedItinerary = {
          dailyItinerary: rawItinerary.dailyItinerary.map((day: any) => ({
            day: day.day,
            activities: day.activities, // Keep activities as an array of objects
            meals: {
              breakfast: day.meals?.breakfast || "Local breakfast",
              lunch: day.meals?.lunch || "Local lunch",
              dinner: day.meals?.dinner || "Local restaurant",
            },
            transportationType: day.transportationType || 'Walking',
            accommodation: day.accommodation || 'Hotel',
            estimatedCosts: {
              activities: day.estimatedCosts?.activities || 0,
              meals: day.estimatedCosts?.meals || 0,
              transport: day.estimatedCosts?.transport || 0,
            },
          })),          
          travelRequirements: rawItinerary.travelRequirements || {},
          budgetBreakdown: {
            transportation: rawItinerary.budgetBreakdown?.transportation || 0,
            accommodation: rawItinerary.budgetBreakdown?.accommodation || 0,
            activities: rawItinerary.budgetBreakdown?.activities || 0,
            food: rawItinerary.budgetBreakdown?.food || 0,
            misc: rawItinerary.budgetBreakdown?.miscellaneous || 0
          },
          locations: rawItinerary.locations || []
        };

        console.log('Transformed itinerary:', transformedItinerary);
  
        setSelectedDestination({ 
          ...destination, 
          itinerary: transformedItinerary
        });
        setStep(5);
      } else {
        throw new Error(data.error || 'Failed to load itinerary');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
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
              {formData.travelers > 0 && (
                <div className="text-sm text-gray-600 ml-1">
                  {formData.travelers} {formData.travelers === 1 ? 'person' : 'people'} traveling
                </div>
              )}
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
                  className={`w-full p-3 pl-12 border-2 border-blue-200 rounded-xl appearance-none ${
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {showDatePicker && (
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
                  {formData.duration > 0 && (
                    <div className="text-gray-600 ml-1">
                      Trip duration: {formData.duration} {formData.duration === 1 ? 'day' : 'days'}
                    </div>
                  )}
                </div>
              )}
              
              {!showDatePicker && (
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
            {recommendations && (() => {
              try {
                const parsedRecommendations = JSON.parse(recommendations);
                if (!parsedRecommendations?.destinations) {
                  console.error('No destinations in recommendations:', parsedRecommendations);
                  return <p>No destinations found. Please try again.</p>;
                }
                
                return (
                  <div className="space-y-6">
                    {parsedRecommendations.destinations.map((dest: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-3xl font-bold text-gray-800">{dest.city}</h3>
                            <p className="text-gray-600">{dest.country}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">
                              {dest.matchScore}% Match
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{dest.matchReason}</p>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Must-Do Activities:</h4>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {dest.activities?.map((activity: string, actIndex: number) => (
                              <span key={actIndex} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {activity}
                              </span>
                            ))}
                          </div>
                          
                          <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            onClick={() => handleViewItinerary(dest)}
                            disabled={loading}
                          >
                            {loading ? 'Loading...' : 'View Itinerary'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } catch (error) {
                console.error('Error parsing recommendations:', error);
                return <p>Error loading recommendations. Please try again.</p>;
              }
            })()}
          </div>
        );
        case 5:
  return selectedDestination ? (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Your Trip to {selectedDestination.city}
      </h2>

      {/* Trip Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Trip Overview</h3>
        <p className="text-gray-700 leading-relaxed">
          Based on your preferences for {formData.tripType.join(' and ')} and a budget of ${formData.budgetPerPerson} per person,
          we've crafted a {formData.duration}-day journey to {selectedDestination.city}.
          Perfect for {formData.travelers} {formData.travelers === 1 ? 'traveler' : 'travelers'} looking for
          {formData.isInternational ? ' an international' : ' a'} getaway.
        </p>
      </div>

      {/* Map View */}
      {selectedDestination.itinerary?.locations && selectedDestination.itinerary.locations.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Trip Map</h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[
                selectedDestination.itinerary.locations[0].coordinates[0],
                selectedDestination.itinerary.locations[0].coordinates[1]
              ]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedDestination.itinerary.locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.coordinates[0], location.coordinates[1]]}
                >
                  <Popup>
                    <div className="text-center">
                      <h4 className="font-semibold">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.type}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Trip Map</h3>
          <div className="h-96 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Map data not available</p>
          </div>
        </div>
      )}

      {/* Daily Itinerary and Requirements */}
      {selectedDestination.itinerary && (
        <>
          <TravelRequirements requirements={selectedDestination.itinerary.travelRequirements} />
          <BudgetBreakdown
            costs={{
              transportation: selectedDestination.itinerary.budgetBreakdown.transportation,
              accommodation: selectedDestination.itinerary.budgetBreakdown.accommodation,
              activities: selectedDestination.itinerary.budgetBreakdown.activities,
              food: selectedDestination.itinerary.budgetBreakdown.food,
              misc: selectedDestination.itinerary.budgetBreakdown.misc
            }}
            budget={formData.budgetPerPerson}
          />
          {selectedDestination.itinerary.dailyItinerary.map((day) => {
            console.log("About to render DailyItinerary with:", day.activities);

            return (
              <DailyItinerary
                key={day.day}
                plan={{
                  day: day.day,
                  activities: day.activities, // Just pass the activities array directly
                  meals: {
                    breakfast: day.meals?.breakfast || "Local breakfast",
                    lunch: day.meals?.lunch || "Local lunch",
                    dinner: day.meals?.dinner || "Local restaurant"
                  },
                  transportationType: day.transportationType || 'Walking',
                  accommodation: day.accommodation || 'Hotel',
                  estimatedCosts: {
                    activities: day.estimatedCosts?.activities || 0,
                    meals: day.estimatedCosts?.meals || 0,
                    transport: day.estimatedCosts?.transport || 0
                  }
                }}
              />
            );
          })}
        </>
      )}
    </div>
  ) : (
    <div className="text-center py-8">
      <p className="text-gray-600">Please select a destination to view itinerary.</p>
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
          <p className="mt-4 text-gray-600">
            {step === 4 ? 'Loading your itinerary...' : 'Finding your perfect destinations...'}
          </p>
        </div>
      ) : (
        <>
          {renderStep()}
          <div className="mt-6 flex justify-between">
            {step > 1 && step < 6 && (
              <button
                className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto disabled:opacity-50"
                onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                disabled={loading}
              >
                {step === 3 ? (loading ? 'Finding...' : 'Find Adventures') : 'Next'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TravelSearch;