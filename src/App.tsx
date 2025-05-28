import SpeedTest from './components/SpeedTest'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="logo-container">
        <img src="/speedtest-logo.svg" alt="SpeedTest Logo" className="logo" />
        <h1>SpeedTest</h1>
      </div>
      <SpeedTest />
    </div>
  )
}

export default App
