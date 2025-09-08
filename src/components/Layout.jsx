import { Outlet, Link, useLocation } from 'react-router-dom'
import { Cpu, Download, Home, Settings, BookOpen } from 'lucide-react'

const Layout = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/build', label: '装机模拟', icon: Cpu },
    { path: '/systems', label: '系统下载', icon: Download },
    { path: '/software', label: '软件下载', icon: Settings },
    { path: '/guide', label: '硬件指南', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">快点装机</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout