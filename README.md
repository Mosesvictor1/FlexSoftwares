# Flex+ Web Application

A modern web application for Flex+ business management system, built with React and Vite.

## 🚀 Features

- **Authentication System**

  - Client ID verification
  - User login with company selection
  - Password management
  - Session handling with JWT tokens

- **Modern UI/UX**

  - Responsive design
  - Dark/Light mode support
  - Clean and intuitive interface
  - Loading states and error handling

- **Dashboard**
  - Overview of key metrics
  - Quick actions
  - Recent activities
  - Company information display

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide Icons
- **Data Fetching**: React Query

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd flex-plus
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```
   VITE_API_BASE_URL=your_api_base_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔧 Configuration

### API Configuration

The application is configured to work with the Flex+ API. The base URL and endpoints are configured in `src/services/api.js`.

### Theme Configuration

The application supports both light and dark modes. Theme configuration can be found in:

- `src/context/ThemeContext.jsx`
- `tailwind.config.js`

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication related components
│   ├── layout/        # Layout components (Sidebar, Topbar)
│   └── ui/            # Basic UI components
├── context/           # React Context providers
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   └── dashboard/     # Dashboard pages
├── services/          # API services
└── utils/             # Utility functions
```

## 🔐 Authentication Flow

1. **Client ID Verification**

   - User enters client ID
   - System verifies client ID with API
   - Stores client information if valid

2. **Login Process**

   - User enters credentials
   - System authenticates with API
   - JWT token is stored for subsequent requests

3. **Session Management**
   - Token is automatically added to API requests
   - Session expiration handling
   - Automatic logout on token expiration

## 🎨 UI Components

### Layout Components

- `Topbar`: Navigation and user controls
- `Sidebar`: Main navigation menu
- `ProtectedRoute`: Authentication wrapper

### Authentication Components

- `ClientId`: Client ID verification
- `Login`: User authentication
- `ChangePassword`: Password management

## 🔄 API Integration

### API Endpoints

- Client ID Verification: `/api/UserLogin/check-client-id`
- User Login: `/api/UserLogin/login`
- Password Change: `/api/UserLogin/change-password`

### Request Headers

All authenticated requests include:

```
Authorization: Bearer <token>
Content-Type: application/json
```

## 🚀 Deployment

### Vercel Deployment

The application is configured for deployment on Vercel with the following settings in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://api.flexsoftwares.com/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## 👥 Team

- Flex+ Teams


For support, please contact +2349138691147
