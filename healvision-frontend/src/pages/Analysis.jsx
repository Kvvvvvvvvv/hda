import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, X, Eye, FileText, Calendar, Hash, Activity } from 'lucide-react'

const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [patientData, setPatientData] = useState({
    patient_id: '',
    age: '',
    gender: '',
    study_id: '',
    clinical_indication: ''
  })
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      toast.success('File uploaded successfully')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dicom']
    },
    maxFiles: 1
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Please upload an image file')
      return
    }
    
    if (!patientData.patient_id) {
      toast.error('Patient ID is required')
      return
    }

    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('patient_id', patientData.patient_id)
      if (patientData.age) formData.append('age', parseInt(patientData.age))
      if (patientData.gender) formData.append('gender', patientData.gender)
      if (patientData.study_id) formData.append('study_id', patientData.study_id)
      if (patientData.clinical_indication) formData.append('clinical_indication', patientData.clinical_indication)
      formData.append('include_explanation', true)

      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setAnalysisResult(response.data)
      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPatientData({
      patient_id: '',
      age: '',
      gender: '',
      study_id: '',
      clinical_indication: ''
    })
    setAnalysisResult(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Image Analysis</h1>
        <p className="text-gray-600">Upload chest X-ray images for AI-powered lung opacity detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
          
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`dropzone mb-6 ${isDragActive ? 'dropzone-active' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">Drop the image here...</p>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG up to 10MB
                </p>
              </>
            )}
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Patient Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-medium text-gray-900">Patient Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient ID *
              </label>
              <input
                type="text"
                name="patient_id"
                value={patientData.patient_id}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter patient ID"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={patientData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Age"
                  min="0"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={patientData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Study ID
              </label>
              <input
                type="text"
                name="study_id"
                value={patientData.study_id}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Study/Radiology order ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinical Indication
              </label>
              <textarea
                name="clinical_indication"
                value={patientData.clinical_indication}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
                placeholder="Reason for examination"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-5 w-5" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
          
          {!analysisResult ? (
            <div className="text-center py-12">
              <Eye className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Results will appear here after analysis</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 fade-in"
            >
              {/* Detection Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Detection Summary</h3>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">
                    {analysisResult.detections.length > 0 
                      ? `${analysisResult.detections.length} lung opacity${analysisResult.detections.length > 1 ? 's' : ''} detected`
                      : 'No lung opacities detected'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    analysisResult.detections.length > 0 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {analysisResult.detections.length > 0 ? 'Abnormal' : 'Normal'}
                  </span>
                </div>
              </div>

              {/* Detections List */}
              {analysisResult.detections.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Detected Regions</h3>
                  <div className="space-y-3">
                    {analysisResult.detections.map((detection, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{detection.label}</span>
                          <span className="text-sm font-medium text-blue-600">
                            {Math.round(detection.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Bounding Box: [{detection.bbox.map(n => Math.round(n)).join(', ')}]</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Explanation */}
              {analysisResult.clinical_explanation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Clinical Explanation
                  </h3>
                  <p className="text-gray-700 text-sm">{analysisResult.clinical_explanation}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Analysis Metadata
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Timestamp:</span>
                    <p>{new Date(analysisResult.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Audit Hash:</span>
                    <p className="font-mono text-xs break-all">{analysisResult.audit_hash?.substring(0, 16)}...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Analysis
