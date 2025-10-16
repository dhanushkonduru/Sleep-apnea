export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-4">🎉 Styling Works!</h1>
        <p className="text-blue-200">If you can see this styled, the CSS is loading correctly!</p>
        <div className="mt-4 flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
            Test Button
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
            Gradient Button
          </button>
        </div>
      </div>
    </div>
  )
}
