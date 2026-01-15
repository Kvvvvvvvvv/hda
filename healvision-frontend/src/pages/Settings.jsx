import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Database, Bell, User, Key } from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: false,
      analysis_complete: true,
      abnormal_detection: true
    },
    privacy: {
      audit_logging: true,
      data_retention: 30,
      anonymous_analytics: true
    },
    api: {
      endpoint: 'http://localhost:8000/api',
      timeout: 30,
      retries: 3
    }
  })

  const handleNotificationChange = (field) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }))
  }

  const handlePrivacyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }))
  }

  const handleApiChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      api: {
        ...prev.api,
        [field]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to backend
    console.log('Saving settings:', settings)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your HealVision Hub preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive email alerts for important events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Desktop Notifications</label>
                <p className="text-sm text-gray-500">Show browser notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.desktop}
                  onChange={() => handleNotificationChange('desktop')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Analysis Complete</label>
                <p className="text-sm text-gray-500">Notify when analysis is finished</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.analysis_complete}
                  onChange={() => handleNotificationChange('analysis_complete')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Abnormal Detection</label>
                <p className="text-sm text-gray-500">Immediate alert for abnormal findings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.abnormal_detection}
                  onChange={() => handleNotificationChange('abnormal_detection')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Audit Logging</label>
                <p className="text-sm text-gray-500">Enable blockchain-style audit trails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.audit_logging}
                  onChange={(e) => handlePrivacyChange('audit_logging', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention Period (days)
              </label>
              <input
                type="range"
                min="7"
                max="365"
                value={settings.privacy.data_retention}
                onChange={(e) => handlePrivacyChange('data_retention', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>7 days</span>
                <span className="font-medium text-gray-700">{settings.privacy.data_retention} days</span>
                <span>1 year</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Anonymous Analytics</label>
                <p className="text-sm text-gray-500">Help improve the service with anonymized usage data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.anonymous_analytics}
                  onChange={(e) => handlePrivacyChange('anonymous_analytics', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Database className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backend Endpoint
              </label>
              <input
                type="url"
                value={settings.api.endpoint}
                onChange={(e) => handleApiChange('endpoint', e.target.value)}
                className="input-field"
                placeholder="http://localhost:8000/api"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Request Timeout (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.api.timeout}
                onChange={(e) => handleApiChange('timeout', parseInt(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retry Attempts
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={settings.api.retries}
                onChange={(e) => handleApiChange('retries', parseInt(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default Settings