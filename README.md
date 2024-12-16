<!--
 * @fileoverview Project documentation and setup instructions
 * 
 * Features:
 * - Project overview and description
 * - Tech stack details
 * - Development progress tracking
 * - Project structure documentation
 * - Design system specifications
 * - Setup and installation guide
 * - Development timeline and sprints
 * - Future roadmap
 -->

# DoughDoughs Pizza - Online Ordering Platform

A modern, responsive pizza ordering website built with Next.js 13, TypeScript, and Tailwind CSS.

## 🍕 Quick Links

- 🌐 **Live Site**: [DoughDough App](https://doughdough-antoinegaton-code-monkey-studios.vercel.app/?_vercel_share=IX498wxRPuoRktP3GCz7ntVNInsHRTeL)
- 📁 **GitHub Repository**: [github.com/AntoineGaton/doughdough](https://github.com/AntoineGaton/doughdough)

## 🛠️ Tech Stack

- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Image Loading**: Next.js Image + Firebase Storage
- **Database**: Firebase
- **Payment**: Stripe

## 🔑 Key Features

- Modern, responsive design with mobile-first approach
- Real-time pizza order tracking system
- User authentication and profile management
- Shopping cart with persistent storage
- Dynamic menu and deals system
- Admin dashboard for pizza management
- Image upload functionality
- Responsive modals and drawers
- Animated components with Framer Motion

## 📊 Development Progress

### Sprint 1 - Week 1 (Completed)

#### Initial Features

- Set up Next.js 13 project with TypeScript
- Implemented responsive navigation system
- Created hero section with video background
- Built featured deals showcase
- Developed popular pizzas gallery
- Established design system
- Configured component architecture

#### Week 1 Achievements

- Custom Tailwind theme configuration
- Responsive design patterns
- Framer Motion animations
- Reusable UI components
- Type-safe architecture
- Optimized image loading

#### Hours Breakdown - Week 1

- Project Setup: 4 hours
- Navigation System: 3 hours
- Hero Section: 5 hours
- Component Architecture: 4 hours
- Design System: 4 hours
Total: 20 hours

### Sprint 1 - Week 2 (Completed)

#### Implemented Features

- Pizza order tracking system
- Mobile-optimized tracking interface
- Confetti animations for order completion
- Circular progress indicator
- Persistent order status
- User authentication system

#### Week 2 Achievements

- Firebase Authentication integration
- Zustand state management
- Real-time order tracking
- Responsive UI components
- Animated progress indicators

#### Hours Breakdown - Week 2

- Order Tracking System: 12 hours
- Authentication Integration: 8 hours
- UI Component Development: 10 hours
- State Management: 6 hours
Total: 36 hours

### Sprint 2 - Week 3 (Current)

#### Latest Features

- User profile management
- Image upload functionality
- Admin dashboard interface
- Responsive about page
- Mobile-first cart drawer
- Test card system
- Pizza management system
- Dynamic modals (Deals, Menu, Contact)

#### Week 3 Achievements

- Firebase Storage integration
- Form validation with Zod
- Responsive drawer components
- Modular modal system
- Dynamic data loading
- Cart state management

#### Hours Breakdown - Week 3

- User Profile System: 10 hours
- Admin Features: 8 hours
- Cart Implementation: 6 hours
- Modal System: 8 hours
- Firebase Integration: 8 hours
Total: 40 hours

### Sprint 2 - Week 4 (Current)

#### Week 4 Latest Features

- Enhanced pizza tracking system with real-time updates
- Confetti celebration animations
- Circular progress visualization
- Mobile-optimized order tracking interface
- About page with company story
- Improved cart drawer functionality
- Admin dashboard enhancements
- Dynamic deals management system
- Integrated Stripe payment processing
- Added order history functionality
- Implemented real-time delivery updates
- Enhanced user profile management
- Added customer review system
- Improved mobile responsiveness
- Implemented multi-language support (English/Spanish)
- Enhanced accessibility features

#### Week 4 Achievements

- Advanced animation integration
- Responsive component optimization
- State management improvements
- Admin CRUD operations
- Image upload system refinement
- Toast notification system
- Error handling enhancement
- Component modularization
- Payment gateway integration
- Accessibility compliance
- Internationalization support
- Performance optimizations
- Database schema improvements
- Enhanced security measures

#### Hours Breakdown - Week 4

- Tracking System Enhancement: 12 hours
- Admin Dashboard Improvements: 10 hours
- UI/UX Refinements: 8 hours
- Component Architecture: 6 hours
- Payment Integration: 8 hours
- Accessibility & i18n: 6 hours
- Testing & Bug Fixes: 6 hours
- Documentation: 4 hours
Total: 60 hours

## 📦 Project Structure

```tree
doughdoughs-pizza/
├── app/
│ ├── layout.tsx     # Root layout
│ ├── page.tsx       # Home page
│ ├── about/         # About page components
│ ├── order/         # Order tracking
│ └── globals.css    # Global styles
├── components/
│ ├── HeroSection.tsx
│ ├── NavBar.tsx
│ ├── CartDrawer.tsx
│ ├── FeaturedDeals.tsx
│ ├── PopularPizzas.tsx
│ ├── admin/         # Admin dashboard components
│ ├── about/         # About page components
│ ├── modals/        # Modal components
│ └── ui/            # Reusable UI components
├── hooks/
│ ��── useCart.ts     # Cart state management
│ ├── useToast.ts    # Toast notifications
│ └── useOrderTracking.ts # Order tracking state
├── data/
│ ├── pizzas.ts      # Pizza data and types
│ ├── drinks.ts      # Drinks data
│ ├── sides.ts       # Sides data
│ └── deals.ts       # Deals data
└── utils/
    ├── firebase-admin-seed.ts # Database seeding
    └── images.ts     # Image handling
```

## 🎨 Design System

```css
:root {
  --background: 60 33% 97%;  /* #fbfaf3 */
  --foreground: 0 0% 3.9%;
  --primary: 60 33% 97%;     /* #fbfaf3 */
  --secondary: 8 75% 44%;    /* #c4391c */
  --accent: 8 75% 44%;
  --radius: 0.75rem;
}
```

## 🚀 Getting Started

1. Clone the repository:

```shell
git clone https://github.com/yourusername/doughdoughs-pizza.git
```

1. Install dependencies:

```shell
npm install
```

1. Start development server:

```shell
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

- Mobile: Default
- Tablet: `sm:` (640px)
- Desktop: `lg:` (1024px)

## 🔮 Future Plans

- Multi-language support
- Handicap accessibility
- Performance optimization
- Testing and bug fixing
- Payment processing with Stripe
- Order history tracking
- Real-time delivery updates
- Customer review system

---

**Note**: This project is actively being developed with new features being added regularly.
