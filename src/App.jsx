import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BuildSimulator from './pages/BuildSimulator'
import SystemDownloads from './pages/SystemDownloads'
import SoftwareDownloads from './pages/SoftwareDownloads'
import HardwareGuide from './pages/HardwareGuide'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="build" element={<BuildSimulator />} />
          <Route path="systems" element={<SystemDownloads />} />
          <Route path="software" element={<SoftwareDownloads />} />
          <Route path="guide" element={<HardwareGuide />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App