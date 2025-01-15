import TravelSearch from './components/TravelSearch'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Plan Your Perfect Trip
        </h1>
        <TravelSearch />
      </div>
    </div>
  )
}

export default App