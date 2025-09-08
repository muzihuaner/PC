import { useState } from 'react'
import { BookOpen, ShoppingCart, Video, Users, Wrench, Globe, ExternalLink, TrendingUp } from 'lucide-react'
import websiteData from '../data/websites.json'

const HardwareGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { key: 'all', name: '全部网站', icon: Globe },
    { key: '社区', name: '技术社区', icon: Users },
    { key: '资讯', name: '硬件资讯', icon: BookOpen },
    { key: '购物', name: '购买渠道', icon: ShoppingCart },
    { key: '视频', name: '视频教程', icon: Video },
    { key: '工具', name: '实用工具', icon: Wrench }
  ]

  const filteredWebsites = selectedCategory === 'all' 
    ? websiteData 
    : websiteData.filter(site => site.category === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">硬件指南</h1>
        <p className="text-gray-600">详细的硬件选购指南和配置建议</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, name, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {filteredWebsites.map((site) => (
              <div key={site.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <img 
                        src={site.icon} 
                        alt={site.name}
                        className="w-6 h-6 mr-3 rounded"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
                        }}
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{site.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {site.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{site.popularity.toLocaleString()} 热度</span>
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    访问网站
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">网站分类</h3>
            <div className="space-y-2">
              {categories.filter(cat => cat.key !== 'all').map(({ key, name, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">{name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {websiteData.filter(site => site.category === key).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">热门标签</h3>
            <div className="space-y-2">
              {Array.from(new Set(websiteData.flatMap(s => s.tags)))
                .map(tag => ({
                  tag,
                  count: websiteData.filter(s => s.tags.includes(tag)).length
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map(({ tag, count }) => (
                  <div key={tag} className="flex justify-between items-center py-2">
                    <span className="text-gray-600">{tag}</span>
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HardwareGuide