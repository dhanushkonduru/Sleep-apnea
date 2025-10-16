export default function SimplePage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">🎉 CSS is Working!</h1>
        <p className="text-gray-600 mb-6">If you can see this styled properly, Tailwind CSS is working!</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
          Test Button
        </button>
      </div>
    </div>
  )
}
