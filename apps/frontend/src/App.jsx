import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            🚀 ORBIT IA
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6"></div>
          <p className="text-2xl text-blue-200 font-light">
            está online
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-white/80 text-lg">
            Sistema inicializado com sucesso
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-400 font-medium">Status: Ativo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

