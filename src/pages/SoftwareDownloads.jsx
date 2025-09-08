import { useState } from 'react'
import { Download, Search, Filter, Star, ExternalLink } from 'lucide-react'
import softwareData from '../data/software.json'

const SoftwareDownloads = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { key: 'all', name: '全部软件' },
    { key: 'driver', name: '驱动程序' },
    { key: 'browser', name: '浏览器' },
    { key: 'office', name: '办公软件' },
    { key: 'chat', name: '聊天工具' },
    { key: 'game', name: '游戏娱乐' },
    { key: 'media', name: '影音媒体' },
    { key: 'development', name: '开发编程' },
    { key: 'security', name: '安全软件' },
    { key: 'utility', name: '系统工具' }
  ]

  const filteredSoftware = softwareData.filter(software => {
    const matchesSearch = software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || software.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">软件下载</h1>
        <p className="text-gray-600">装机必备软件合集，官方正版下载</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索软件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSoftware.map((software) => (
          <div key={software.id} className="card">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{software.name}</h3>
                  <p className="text-sm text-gray-600">{software.category}</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(software.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({software.rating})</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{software.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">版本:</span>
                  <span className="ml-2 font-medium">{software.version}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">大小:</span>
                  <span className="ml-2 font-medium">{software.size}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">更新日期:</span>
                  <span className="ml-2 font-medium">{software.updateDate}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <a
                  href={software.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-primary flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </a>
                <a
                  href={software.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-secondary flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  官网
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSoftware.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">未找到匹配的软件</p>
        </div>
      )}
    </div>
  )
}

export default SoftwareDownloads