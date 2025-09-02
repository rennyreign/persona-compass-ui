# 🎯 Persona Database - AI-Powered University Marketing Platform

A comprehensive persona management and AI generation platform designed for universities and educational institutions to create, manage, and deploy data-driven marketing personas for student recruitment campaigns.

[![Netlify Status](https://api.netlify.com/api/v1/badges/efbb5c34-37a7-4aa0-ae23-9961d03423b9/deploy-status)](https://app.netlify.com/sites/persona-compass/deploys)

🔗 **Live Application**: https://persona-compass.netlify.app

---

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🚀 Features

### 🎯 **Core Functionality**
- **AI-Powered Persona Generation**: Create detailed marketing personas using OpenAI GPT models
- **University Program Management**: Organize and manage academic programs for persona targeting
- **Campaign Blueprint System**: YAML-based campaign templates and automation
- **Real-time Analytics**: Track persona performance and campaign effectiveness
- **Role-Based Access Control**: Admin, university, and user-level permissions

### 🛠 **Admin Tools**
- **Program Manager**: Create and manage university programs with database integration
- **Bulk Persona Creator**: Generate multiple personas simultaneously with progress tracking
- **Persona Management Dashboard**: Comprehensive persona oversight with search and filtering
- **Campaign Creator**: Bulk campaign creation and management tools
- **User Role Management**: Bootstrap admin access and permission control

### 📊 **Advanced Features**
- **Attribution Tracking**: Multi-touch attribution analysis for persona effectiveness
- **Performance Analytics**: Detailed campaign and persona performance metrics
- **Image Generation**: AI-powered persona image creation and management
- **Validation Services**: Quality scoring and persona validation with recommendations
- **A/B Testing Framework**: Experimental design for persona optimization

---

## 🛠 Technology Stack

### **Frontend**
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** for consistent, accessible UI components
- **React Router** for client-side routing with lazy loading
- **Tanstack Query** for efficient data fetching and caching

### **Backend & Database**
- **Supabase** for authentication, database, and real-time subscriptions
- **PostgreSQL** with Row Level Security (RLS) policies
- **Supabase Edge Functions** for serverless backend logic

### **AI & APIs**
- **OpenAI GPT-4** for persona and content generation
- **OpenAI DALL-E** for AI image generation
- **Custom AI Services** for persona validation and quality scoring

### **Development & Deployment**
- **TypeScript** for type safety and better developer experience
- **ESLint & Prettier** for code quality and formatting
- **Netlify** for continuous deployment and hosting
- **Git** with conventional commits for version control

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key (for AI features)

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd persona-database
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_ALLOW_CLIENT_OPENAI=true

# Optional: External API Keys
FACEBOOK_ACCESS_TOKEN=your_facebook_token
GOOGLE_ADS_DEVELOPER_TOKEN=your_google_ads_token
HUBSPOT_ACCESS_TOKEN=your_hubspot_token
```

4. **Database Setup**
```sql
-- Run the migration file to create required tables
-- File: supabase/migrations/20250901220000_create_programs_table.sql
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### **Building for Production**
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
persona-database/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── auth/           # Authentication components
│   │   ├── campaign/       # Campaign management
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   ├── persona/        # Persona-related components
│   │   └── ui/             # Base UI components (shadcn/ui)
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   ├── lib/                # Utility functions and configurations
│   ├── pages/              # Page components
│   ├── services/           # API and business logic services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── supabase/              # Database migrations and functions
└── docs/                  # Documentation and planning files
```

### **Key Components**

#### **Admin Tools** (`src/components/admin/`)
- `ProgramManager.tsx` - University program CRUD operations
- `PersonaManagementDashboard.tsx` - Comprehensive persona oversight
- `BulkPersonaCreator.tsx` - Mass persona generation
- `BulkCampaignCreator.tsx` - Campaign bulk operations

#### **Dashboard** (`src/components/dashboard/`)
- `Dashboard.tsx` - Main dashboard with KPIs and persona grid
- `PersonaGrid.tsx` - Responsive persona display with filtering
- `ActivityFeed.tsx` - Real-time activity tracking

#### **Services** (`src/services/`)
- `ai/` - AI integration services (OpenAI, validation)
- `api/` - External API integrations
- `personaValidation.ts` - Quality scoring and validation logic

---

## 🔌 API Integration

### **Supabase Database Schema**

#### **Core Tables**
- `organizations` - University/institution management
- `users` - User accounts and profiles  
- `user_roles` - Role-based access control
- `personas` - Persona data and metadata
- `campaigns` - Marketing campaign information
- `programs` - University program catalog

#### **Key Functions**
- `get_user_organization_role()` - Returns user's role and organization
- Database triggers for `updated_at` timestamps
- Row Level Security (RLS) policies for data access control

### **AI Services Integration**
- **OpenAI GPT-4**: Persona content generation and enhancement
- **OpenAI DALL-E**: AI-powered persona image generation
- **Custom Validation**: Quality scoring and persona optimization

---

## 🚀 Deployment

### **Netlify Deployment** (Current)
The application is deployed on Netlify with automatic deployments from the main branch.

**Live URL**: https://persona-compass.netlify.app

### **Environment Configuration**
Netlify environment variables are configured for:
- Supabase connection
- OpenAI API access
- Custom domain configuration

### **Build Optimization**
- Code splitting with React lazy loading
- Bundle size optimization (current: ~630KB main bundle)
- Asset optimization and compression

---

## 📊 Current Status

### **Production Ready Features** ✅
- User authentication and authorization
- Persona creation and management
- Campaign planning and execution
- Admin tools and bulk operations  
- Real-time analytics and reporting
- AI integration for content generation
- Responsive design and mobile support

### **In Development** 🚧
- Advanced A/B testing framework
- Enhanced attribution modeling
- Third-party API integrations expansion
- Progressive Web App (PWA) features

---

## 🤝 Contributing

### **Development Workflow**
1. Create a feature branch from `main`
2. Make changes with descriptive commit messages
3. Test thoroughly including admin functionality
4. Submit pull request with detailed description

### **Code Quality Standards**
- TypeScript strict mode enabled
- ESLint and Prettier for code formatting
- Consistent component structure and naming
- Comprehensive error handling and loading states

### **Testing Guidelines**
- Test all CRUD operations in admin tools
- Verify role-based access controls
- Test AI integration functionality
- Ensure responsive design across devices

---

## 📄 License

This project is proprietary software developed for Bisk Education and partner universities.

---

## 🆘 Support

For technical support or questions:
- Check the [Functionality Audit](FUNCTIONALITY_AUDIT.md) for detailed feature documentation
- Review component implementations in the `/src` directory
- Contact the development team for access and configuration issues

---

**Built with ❤️ for educational institutions and AI-powered marketing innovation**
