# HealVision Frontend

A modern, production-grade React frontend for the HealVision medical AI diagnostics platform.

## Features

- **Modern UI/UX**: Clean, professional interface designed for medical professionals
- **Real-time Analysis**: Drag-and-drop image upload with instant AI analysis
- **Interactive Dashboard**: Visual statistics and recent activity tracking
- **Audit Trail**: Blockchain-style cryptographic hashing for compliance
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Type Safety**: Built with modern JavaScript/React best practices

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons
- **Recharts** - Data visualization components
- **Axios** - HTTP client for API integration
- **React Router** - Client-side routing
- **React Dropzone** - File upload handling

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd healvision-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
healvision-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Navbar.jsx   # Main navigation
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx # Main dashboard
│   │   ├── Analysis.jsx  # Image analysis interface
│   │   ├── History.jsx   # Analysis history
│   │   └── Settings.jsx  # Application settings
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000`. The Vite proxy automatically forwards `/api` requests to the backend.

Key API endpoints used:
- `POST /api/analyze` - Submit image for analysis
- `GET /api/health` - Backend health check

## Customization

### Theming
Modify colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize primary color palette
      }
    }
  }
}
```

### Adding New Pages
1. Create a new component in `src/pages/`
2. Import it in `src/App.jsx`
3. Add a route in the `<Routes>` component
4. Add navigation link in `src/components/Navbar.jsx`

## Development Guidelines

- Use functional components with hooks
- Follow Tailwind CSS utility class conventions
- Maintain consistent spacing and typography
- Use Framer Motion for smooth transitions
- Implement proper error handling and loading states
- Write accessible code following WCAG guidelines

## Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel
```bash
vercel --prod
```

### Traditional Hosting
Upload the contents of the `dist/` folder to your web server.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - see LICENSE file for details.