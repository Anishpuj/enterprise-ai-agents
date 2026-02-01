# Enterprise Agents Frontend

A modern React web application for the Enterprise Agents Platform.

## 🚀 Features

- **Dashboard**: Real-time metrics and system status
- **Research Interface**: Interactive AI-powered research tool
- **Analytics**: Usage statistics and performance monitoring
- **Settings**: Configuration and system management

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on http://localhost:8080

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
./setup.sh
npm start
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## 📱 Pages

### Dashboard
- System metrics and KPIs
- Agent status monitoring
- Recent activity feed
- Performance indicators

### Research
- Interactive research query input
- Real-time processing steps
- Comprehensive results display
- Export functionality

### Analytics
- Usage charts and graphs
- Agent performance metrics
- Response time trends
- Detailed statistics table

### Settings
- API configuration
- Database settings
- Security preferences
- Notification management

## 🔧 Configuration

Environment variables in `.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_KEY=demo-api-key-12345
REACT_APP_TITLE=Enterprise Agents Platform
```

## 🎨 Design System

- **Primary Color**: Blue (#3b82f6)
- **Secondary Color**: Gray (#64748b)
- **Typography**: System fonts
- **Components**: Reusable UI components
- **Responsive**: Mobile-first design

## 📊 Features Overview

### Real-time Dashboard
- Live system metrics
- Agent status indicators
- Performance monitoring
- Activity tracking

### Interactive Research
- Natural language queries
- Multi-step processing visualization
- Comprehensive results
- Professional report generation

### Analytics & Insights
- Usage statistics
- Performance trends
- Agent efficiency metrics
- Data visualization

### System Management
- API configuration
- User settings
- Security options
- Help & documentation

## 🔗 API Integration

The frontend connects to the Enterprise Agents API:
- Authentication via API keys
- Real-time agent communication
- Metrics and monitoring
- Configuration management

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview build
npm run build && npx serve -s build
```

## 📝 Development

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 🎯 Architecture

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── App.js         # Main application
├── index.js       # Entry point
└── styles/        # Global styles
```

## 🔐 Security

- API key authentication
- CORS configuration
- Input validation
- Error handling

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly interactions
- Accessible components

## 🎨 UI/UX Features

- Modern, clean interface
- Smooth animations
- Loading states
- Error handling
- Toast notifications
- Interactive charts

## 🔄 State Management

- React hooks for local state
- API integration for data
- Real-time updates
- Error boundaries

## 📈 Performance

- Code splitting
- Lazy loading
- Optimized builds
- Caching strategies

## 🛠️ Customization

- Theme configuration
- Component library
- Brand customization
- Feature flags
