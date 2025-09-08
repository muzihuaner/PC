import { Link } from 'react-router-dom'
import { Cpu, Download, Settings, BookOpen, ArrowRight } from 'lucide-react'

const Home = () => {
  const features = [
    {
      title: '装机模拟器',
      description: '智能推荐硬件配置，实时价格跟踪，性能对比分析',
      icon: Cpu,
      href: '/build',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: '系统下载',
      description: 'Windows、Linux等操作系统镜像，官方正版下载',
      icon: Download,
      href: '/systems',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: '软件下载',
      description: '装机必备软件合集，驱动程序，系统优化工具',
      icon: Settings,
      href: '/software',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: '硬件指南',
      description: '详细的硬件选购指南，兼容性检查，性能评测',
      icon: BookOpen,
      href: '/guide',
      color: 'text-orange-600 bg-orange-50'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到快点装机
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          一站式装机解决方案，从硬件选择到系统安装，为您提供专业的装机指导和工具
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              to={feature.href}
              className="card card-hover p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="flex items-center text-primary-600 font-medium">
                开始使用
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">
            开始您的装机之旅
          </h2>
          <p className="text-primary-100 mb-6">
            无论您是装机新手还是资深玩家，我们都能为您提供最适合的解决方案。
            从预算规划到性能优化，让装机变得简单而有趣。
          </p>
          <Link
            to="/build"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            立即开始装机
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home