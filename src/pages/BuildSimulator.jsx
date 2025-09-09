import React, { useState, useEffect, useRef } from 'react'
import { Cpu, HardDrive, Zap, Monitor, DollarSign, Check, Plus, Edit2, Trash2, ExternalLink, Share2, Download, Save, Upload, Camera } from 'lucide-react'
import html2canvas from 'html2canvas'
import hardwareData from '../data/hardware.json'

const BuildSimulator = () => {
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    motherboard: null
  })
  const [savedConfigs, setSavedConfigs] = useState([])
  const [compatibility, setCompatibility] = useState({})
  const [customHardware, setCustomHardware] = useState({
    cpu: [],
    gpu: [],
    ram: [],
    storage: [],
    psu: [],
    motherboard: []
  })
  const [showAddForm, setShowAddForm] = useState(null)
  const [newComponent, setNewComponent] = useState({
    name: '',
    price: '',
    specs: '',
    socket: '',
    tdp: '',
    recommendedPsu: ''
  })
  const [showShareModal, setShowShareModal] = useState(false)
  const [configName, setConfigName] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const captureRef = useRef(null)

  const categories = [
    { key: 'cpu', name: '处理器(CPU)', icon: Cpu, color: 'bg-blue-100 text-blue-800' },
    { key: 'gpu', name: '显卡(GPU)', icon: Monitor, color: 'bg-green-100 text-green-800' },
    { key: 'ram', name: '内存', icon: Zap, color: 'bg-yellow-100 text-yellow-800' },
    { key: 'storage', name: '存储', icon: HardDrive, color: 'bg-purple-100 text-purple-800' },
    { key: 'psu', name: '电源', icon: DollarSign, color: 'bg-red-100 text-red-800' },
    { key: 'motherboard', name: '主板', icon: Monitor, color: 'bg-indigo-100 text-indigo-800' }
  ]

  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, component) => sum + (component?.price || 0), 0
  )

  const getHardwareList = (category) => {
    return [...(hardwareData[category] || []), ...customHardware[category]]
  }

  const checkCompatibility = () => {
    const issues = []
    
    if (selectedComponents.cpu && selectedComponents.motherboard) {
      if (selectedComponents.cpu.socket !== selectedComponents.motherboard.socket) {
        issues.push('CPU与主板插槽不兼容')
      }
    }
    
    if (selectedComponents.psu && selectedComponents.gpu) {
      if (selectedComponents.psu.wattage < selectedComponents.gpu.recommendedPsu) {
        issues.push('电源功率不足')
      }
    }
    
    setCompatibility({
      compatible: issues.length === 0,
      issues
    })
  }

  const addCustomComponent = (category) => {
    const component = {
      id: `custom-${Date.now()}`,
      name: newComponent.name,
      price: parseFloat(newComponent.price) || 0,
      specs: newComponent.specs,
      socket: newComponent.socket,
      tdp: parseInt(newComponent.tdp) || 0,
      recommendedPsu: parseInt(newComponent.recommendedPsu) || 0,
      isCustom: true
    }
    
    setCustomHardware(prev => ({
      ...prev,
      [category]: [...prev[category], component]
    }))
    
    setNewComponent({ name: '', price: '', specs: '', socket: '', tdp: '', recommendedPsu: '' })
    setShowAddForm(null)
  }

  const removeCustomComponent = (category, componentId) => {
    setCustomHardware(prev => ({
      ...prev,
      [category]: prev[category].filter(comp => comp.id !== componentId)
    }))
    
    // 如果当前选中的组件被删除，则清空选择
    if (selectedComponents[category]?.id === componentId) {
      setSelectedComponents(prev => ({
        ...prev,
        [category]: null
      }))
    }
  }

  const saveConfiguration = () => {
    if (!configName.trim()) return
    
    const newConfig = {
      id: Date.now(),
      name: configName,
      components: selectedComponents,
      totalPrice,
      date: new Date().toLocaleString('zh-CN')
    }
    
    const updatedConfigs = [...savedConfigs, newConfig]
    setSavedConfigs(updatedConfigs)
    localStorage.setItem('savedConfigs', JSON.stringify(updatedConfigs))
    setShowSaveModal(false)
    setConfigName('')
  }

  const loadConfiguration = (config) => {
    setSelectedComponents(config.components)
    setShowLoadModal(false)
  }

  const deleteConfiguration = (configId) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== configId)
    setSavedConfigs(updatedConfigs)
    localStorage.setItem('savedConfigs', JSON.stringify(updatedConfigs))
  }

  const generateShareImage = async () => {
    if (!captureRef.current) return
    
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      })
      
      const link = document.createElement('a')
      link.download = `装机配置-${new Date().toLocaleDateString('zh-CN')}.png`
      link.href = canvas.toDataURL()
      link.click()
      
      setShowShareModal(false)
    } catch (error) {
      console.error('生成图片失败:', error)
    }
  }

  const copyShareLink = () => {
    const configData = btoa(JSON.stringify(selectedComponents))
    const shareUrl = `${window.location.origin}/build?config=${configData}`
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('分享链接已复制到剪贴板！')
      setShowShareModal(false)
    })
  }

  useEffect(() => {
    checkCompatibility()
    
    const saved = localStorage.getItem('savedConfigs')
    if (saved) {
      setSavedConfigs(JSON.parse(saved))
    }
    
    const urlParams = new URLSearchParams(window.location.search)
    const configParam = urlParams.get('config')
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam))
        setSelectedComponents(decoded)
      } catch (error) {
        console.error('解析配置参数失败:', error)
      }
    }
  }, [])

  useEffect(() => {
    checkCompatibility()
  }, [selectedComponents])

  const selectComponent = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }))
  }

  const isComplete = Object.values(selectedComponents).every(c => c !== null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">装机模拟器</h1>
        <p className="text-gray-600 text-lg">选择硬件组件，实时查看兼容性和总价</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowSaveModal(true)}
          className="btn btn-primary flex items-center gap-2"
          disabled={!isComplete}
        >
          <Save className="h-4 w-4" />
          保存配置
        </button>
        <button
          onClick={() => setShowLoadModal(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          加载配置
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="btn btn-accent flex items-center gap-2"
          disabled={!isComplete}
        >
          <Share2 className="h-4 w-4" />
          分享配置
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">选择硬件</h2>
              <div className="space-y-8">
                {categories.map(({ key, name, icon: Icon, color }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-medium text-gray-900 flex items-center">
                        <div className={`p-2 rounded-lg ${color} mr-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {name}
                      </h3>
                      {key === 'cpu' && (
                        <a
                          href="https://www.mydrivers.com/zhuanti/tianti/cpu/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          CPU天梯图
                        </a>
                      )}
                      {key === 'gpu' && (
                        <a
                          href="https://www.mydrivers.com/zhuanti/tianti/gpu/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          GPU天梯图
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getHardwareList(key).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => selectComponent(key, item)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedComponents[key]?.id === item.id
                              ? 'border-primary-500 bg-primary-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                {item.isCustom && (
                                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    自定义
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.specs}</p>
                              <div className="text-xs text-gray-500 space-y-1">
                                {item.socket && <div>插槽: {item.socket}</div>}
                                {item.tdp && <div>TDP: {item.tdp}W</div>}
                                {item.recommendedPsu && <div>建议电源: {item.recommendedPsu}W</div>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary-600">¥{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            {selectedComponents[key]?.id === item.id && (
                              <div className="flex items-center text-primary-600">
                                <Check className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">已选择</span>
                              </div>
                            )}
                            {item.isCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeCustomComponent(key, item.id)
                                }}
                                className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowAddForm(key)}
                        className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-700"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        添加自定义{name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-8" ref={captureRef}>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">配置摘要</h2>
              
              <div className="space-y-4 mb-6">
                {categories.map(({ key, name, icon: Icon }) => {
                  const component = selectedComponents[key]
                  return (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{name}:</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {component ? component.name : '未选择'}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">总价:</span>
                  <span className="text-3xl font-bold text-primary-600">
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {compatibility.issues && compatibility.issues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">⚠️ 兼容性问题:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {compatibility.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isComplete && compatibility.compatible && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ 所有组件兼容，配置合理
                  </p>
                </div>
              )}

              {!isComplete && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    请完成所有组件的选择
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加自定义组件的模态框 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              添加自定义{categories.find(c => c.key === showAddForm)?.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={showAddForm === 'cpu' ? '例如：Intel Core i9-13900K' : 
                           showAddForm === 'gpu' ? '例如：NVIDIA RTX 4090' :
                           showAddForm === 'ram' ? '例如：金士顿 DDR4 3200MHz' :
                           showAddForm === 'storage' ? '例如：三星 980 Pro 1TB' :
                           showAddForm === 'psu' ? '例如：海盗船 RM850x' :
                           '例如：华硕 ROG Strix Z790-E'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">价格 (¥) *</label>
                <input
                  type="number"
                  value={newComponent.price}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={showAddForm === 'cpu' ? '例如：3999' : 
                           showAddForm === 'gpu' ? '例如：12999' :
                           showAddForm === 'ram' ? '例如：599' :
                           showAddForm === 'storage' ? '例如：899' :
                           showAddForm === 'psu' ? '例如：899' :
                           '例如：2999'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规格 *</label>
                <input
                  type="text"
                  value={newComponent.specs}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, specs: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={showAddForm === 'cpu' ? '例如：24核32线程 3.0GHz 36MB缓存' : 
                           showAddForm === 'gpu' ? '例如：24GB GDDR6X 2520MHz 384-bit' :
                           showAddForm === 'ram' ? '例如：16GB(8GB×2) DDR4 3200 CL16' :
                           showAddForm === 'storage' ? '例如：1TB NVMe PCIe4.0 7000MB/s' :
                           showAddForm === 'psu' ? '例如：850W 80+金牌 全模组' :
                           '例如：Z790芯片组 DDR5 WiFi6E 2.5G网口'}
                />
              </div>
              
              {(showAddForm === 'cpu' || showAddForm === 'motherboard') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">插槽类型</label>
                  <input
                    type="text"
                    value={newComponent.socket}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, socket: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={showAddForm === 'cpu' ? '例如：LGA1700' : 
                           '例如：LGA1700/AM5/TR4'}
                  />
                </div>
              )}
              
              {(showAddForm === 'cpu' || showAddForm === 'gpu') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {showAddForm === 'cpu' ? 'TDP (W)' : '建议电源功率 (W)'}
                  </label>
                  <input
                    type="number"
                    value={showAddForm === 'cpu' ? newComponent.tdp : newComponent.recommendedPsu}
                    onChange={(e) => setNewComponent(prev => ({
                      ...prev,
                      [showAddForm === 'cpu' ? 'tdp' : 'recommendedPsu']: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={showAddForm === 'cpu' ? '例如：125' : 
                           '例如：850'}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(null)
                  setNewComponent({ name: '', price: '', specs: '', socket: '', tdp: '', recommendedPsu: '' })
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => addCustomComponent(showAddForm)}
                disabled={!newComponent.name || !newComponent.price}
                className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">分享配置</h3>
            
            <div className="space-y-4">
              <button
                onClick={generateShareImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Camera className="h-5 w-5" />
                生成配置图片
              </button>
              
              <button
                onClick={copyShareLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                复制分享链接
              </button>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 保存配置模态框 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">保存配置</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">配置名称</label>
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例如：游戏主机配置"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveModal(false)
                  setConfigName('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveConfiguration}
                disabled={!configName.trim()}
                className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 加载配置模态框 */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">加载配置</h3>
            
            {savedConfigs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无保存的配置</p>
            ) : (
              <div className="space-y-3">
                {savedConfigs.map((config) => (
                  <div key={config.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{config.name}</h4>
                      <p className="text-sm text-gray-600">
                        总价: ¥{config.totalPrice.toLocaleString()} • {config.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadConfiguration(config)}
                        className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                      >
                        加载
                      </button>
                      <button
                        onClick={() => deleteConfiguration(config.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuildSimulator