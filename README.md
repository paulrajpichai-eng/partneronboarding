# Uncoded Partner Portal

A comprehensive partner onboarding and management platform built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Copy your project credentials** from Settings > API
3. **Update the `.env` file** with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migrations

Execute the SQL migrations in your Supabase SQL editor in this order:

1. `supabase/migrations/20250822100834_floral_cell.sql`
2. `supabase/migrations/20250822121123_patient_bar.sql`
3. `supabase/migrations/20250822124744_ancient_art.sql`
4. `supabase/migrations/20250822125141_restless_frost.sql`
5. `supabase/migrations/20250822125452_super_scene.sql`
6. `supabase/migrations/20250822134908_icy_sky.sql`

### 4. Start Development Server
```bash
npm run dev
```

## 📋 Database Setup

The application requires the following database tables:
- `partners` - Partner company information
- `locations` - Partner locations/branches
- `users` - Partner users
- `milestones` - Onboarding progress tracking
- `bos_tasks` - BOS team tasks
- `pricing_tasks` - Pricing team tasks
- `spoc_mappings` - SPOC ID to contact mappings
- `brand_channel_mappings` - Brand channel options
- `email_logs` - Email tracking

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase Setup Checklist
- [ ] Create Supabase project
- [ ] Run all database migrations
- [ ] Set up Row Level Security (RLS) policies
- [ ] Configure environment variables
- [ ] Test connection

## 🎯 Features

- **Partner Registration** - Complete onboarding flow
- **Multi-role Dashboards** - Partner, BOS, Pricing, Admin views
- **Real-time Validation** - Tax ID, GSTIN, email verification
- **Document Upload** - OCR-powered banking details extraction
- **Progress Tracking** - Visual milestone journey
- **Email Notifications** - SPOC brand channel selection
- **Multi-location Support** - Manage multiple business locations
- **User Management** - Create and manage partner users

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📱 User Roles

1. **Partners** - Register, manage locations, create users
2. **BOS Team** - Process registrations, assign plans
3. **Pricing Team** - Configure margins and pricing
4. **Uncoded Admin** - System administration, analytics

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Email and mobile OTP verification
- Real-time business ID validation
- Secure file upload handling

## 📊 Analytics

- Partner onboarding metrics
- Milestone duration tracking
- Support request analytics
- Conversion rate monitoring

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel
- Netlify
- Bolt Hosting

Make sure to set environment variables in your deployment platform.

## 📞 Support

For technical support or questions, contact the development team.