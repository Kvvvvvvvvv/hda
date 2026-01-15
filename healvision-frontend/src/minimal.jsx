import React from 'react'
import ReactDOM from 'react-dom/client'

function MinimalApp() {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-blue-50 flex items-center justify-center' },
    React.createElement(
      'div',
      { className: 'text-center p-8 bg-white rounded-lg shadow-lg' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-4' }, 'HealVision Minimal Test'),
      React.createElement('p', { className: 'text-gray-600' }, 'If you see this, React is working correctly!'),
      React.createElement('div', { className: 'mt-4 p-4 bg-green-100 rounded' }, 'Success! React is rendering properly.')
    )
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(MinimalApp))