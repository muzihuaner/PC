import { ExternalLink, Download, Monitor, Terminal, Apple } from 'lucide-react'
import systemData from '../data/systems.json'

const SystemDownloads = () => {
  const categories = [
    { key: 'windows', name: 'Windows系统', icon: Monitor, color: 'text-blue-600' },
    { key: 'linux', name: 'Linux发行版', icon: Terminal, color: 'text-orange-600' },
    { key: 'macos', name: 'macOS系统', icon: Apple, color: 'text-gray-600' }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">系统下载</h1>
        <p className="text-gray-600">官方正版操作系统镜像下载，安全可靠</p>
      </div>

      <div className="space-y-8">
        {categories.map(({ key, name, icon: Icon, color }) => {
          const systems = systemData[key] || []
          
          return (
            <div key={key} className="card">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Icon className={`h-6 w-6 ${color} mr-3`} />
                  <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systems.map((system) => (
                    <div key={system.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{system.name}</h3>
                          <p className="text-sm text-gray-600">{system.version}</p>
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          {system.size}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="text-sm">
                          <span className="text-gray-600">发布日期:</span>
                          <span className="ml-2">{system.releaseDate}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">系统要求:</span>
                          <span className="ml-2">{system.requirements}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <a
                          href={system.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn btn-primary flex items-center justify-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          下载
                        </a>
                        <a
                          href={system.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn btn-secondary flex items-center justify-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          官网
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">安装指南</h3>
          <div className="prose prose-sm text-gray-600">
            <ul className="space-y-2">
              <li>下载完成后，建议使用Rufus,Ventoy等工具制作启动U盘</li>
              <li>安装前请备份重要数据，避免数据丢失</li>
              <li>确保电脑满足最低系统要求</li>
              <li>安装过程中保持网络连接，以便获取最新更新</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">第三方下载网站</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://uupdump.net"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-1">UUP dump</h4>
              <p className="text-sm text-gray-600">提供Windows官方镜像下载，支持多版本选择</p>
            </a>
            <a
              href="https://next.itellyou.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-1">ITellYou</h4>
              <p className="text-sm text-gray-600">提供Windows、Office等微软官方原版镜像</p>
            </a>
            <a
              href="https://massgrave.dev/genuine-installation-media"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Massgrave</h4>
              <p className="text-sm text-gray-600">提供Windows正版安装镜像和激活相关信息</p>
            </a>
             <a
              href="https://hellowindows.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-1">HelloWindows</h4>
              <p className="text-sm text-gray-600">原版Windows系统下载仓储站</p>
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            提示：第三方网站提供的镜像仅供参考，请验证文件完整性后再使用
          </p>
        </div>
      </div>
    </div>
  )
}

export default SystemDownloads