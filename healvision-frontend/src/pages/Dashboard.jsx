import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Eye, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 247,
    positiveDetections: 43,
    accuracyRate: 94.2,
    thisWeek: 32
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, patient: 'John Doe', date: '2024-01-15', result: 'Normal', confidence: 98.5 },
    { id: 2, patient: 'Jane Smith', date: '2024-01-14', result: 'Abnormal', confidence: 87.2 },
    { id: 3, patient: 'Robert Johnson', date: '2024-01-14', result: 'Normal', confidence: 96.8 },
    { id: 4, patient: 'Emily Davis', date: '2024-01-13', result: 'Abnormal', confidence: 92.1 }
  ])

  const weeklyData = [
    { day: 'Mon', analyses: 12 },
    { day: 'Tue', analyses: 19 },
    { day: 'Wed', analyses: 15 },
    { day: 'Thu', analyses: 22 },
    { day: 'Fri', analyses: 18 },
    { day: 'Sat', analyses: 8 },
    { day: 'Sun', analyses: 5 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HealVision Hub</h1>
        <p className="text-gray-600">AI-powered medical imaging diagnostics dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Detections</p>
              <p className="text-2xl font-bold text-orange-600">{stats.positiveDetections}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.accuracyRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Weekly Analysis Volume
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="analyses" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-orange-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: activity.id * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.patient}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.result === 'Normal' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {activity.result}
                  </span>
                  <span className="text-sm text-gray-600">{activity.confidence}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>New Analysis</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>View History</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard