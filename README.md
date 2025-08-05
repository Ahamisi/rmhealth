# Remedial ERP System

A modern, responsive ERP system built with Vue.js 3, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modular Architecture**: Each business module is self-contained and reusable
- **Mobile-First Design**: Fully responsive and optimized for all devices
- **TypeScript**: Full type safety and better developer experience
- **Modern UI**: Built with Tailwind CSS and custom components
- **Production Ready**: Optimized build process and API integration patterns

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ui/             # Base UI components (Button, Input, etc.)
├── modules/            # Business modules
│   └── outbound/       # Outbound management module
│       ├── views/      # Module-specific views
│       └── components/ # Module-specific components
├── services/           # API services and utilities
├── router/             # Vue Router configuration
├── lib/                # Utility functions
└── assets/             # Static assets and styles
```

### Current Modules
- **Outbound**: Fulfillment tracking, order management, agent performance

## 🎨 Design System

### Colors
- **Primary**: `#2C48AF` - Main brand color
- **Fonts**: SF Pro Display, SF Pro Text (Apple system fonts)

### Components
- **Button**: Multiple variants (default, outline, secondary, ghost, link)
- **Input**: With validation, icons, and error states
- **Cards**: Consistent container styling
- **Forms**: Standardized form layouts

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd remedial-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Authentication

The system uses JWT-based authentication with the following flow:
1. User logs in with phone number and password
2. Server returns JWT token
3. Token is stored in localStorage
4. All API requests include the token
5. Auto-redirect on token expiration

## 📱 Responsive Design

The application is built mobile-first with breakpoints:
- **xs**: 475px (extra small devices)
- **sm**: 640px (small devices)
- **md**: 768px (medium devices)
- **lg**: 1024px (large devices)
- **xl**: 1280px (extra large devices)

## 🧩 Adding New Modules

1. Create module directory: `src/modules/your-module/`
2. Add module routes to `src/router/index.ts`
3. Create module views in `src/modules/your-module/views/`
4. Add API endpoints to `src/services/api.ts`

## 📡 API Integration

The API service (`src/services/api.ts`) provides:
- Automatic token injection
- Request/response interceptors
- Error handling
- TypeScript interfaces
- Generic CRUD operations

### Example Usage
```typescript
import api from '@/services/api'

// Login
const response = await api.login({ phone: '+234...', password: '...' })

// Get data
const data = await api.get('/outbound/dashboard/stats')

// Post data
const result = await api.post('/outbound/orders', orderData)
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Style
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use Tailwind CSS for styling
- Keep components small and focused
- Write meaningful commit messages

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server

3. **Configure environment variables** for production

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

1. Follow the established code patterns
2. Use reusable components when possible
3. Keep mobile responsiveness in mind
4. Add proper TypeScript types
5. Test on multiple devices 