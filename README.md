# DoughDoughs Pizza - Online Ordering Platform

A modern, responsive pizza ordering website built with Next.js 13, TypeScript, and Tailwind CSS.

## 🍕 Features

- Modern, responsive design
- Animated hero section with video background
- Featured deals showcase with hover effects
- Popular pizzas gallery with dynamic loading
- Mobile-friendly navigation with animated drawer
- Shopping cart with persistent storage
- Smooth scrolling animations
- Custom pizza builder with real-time pricing

## 🛠 Recent Updates

- Added shopping cart with Zustand state management
- Implemented cart drawer with animations
- Added persistent cart storage
- Created pizza customization system
- Implemented dynamic price calculations
- Added ingredient selection interface
- Enhanced mobile navigation drawer
- Integrated popular pizzas with dynamic image loading
- Added smooth scrolling animations
- Implemented responsive image handling

## 🎯 Sprint 1 - Week 1 Progress

### Completed Features

- Set up Next.js 13 project with TypeScript and Tailwind CSS
- Implemented responsive navigation system
- Created hero section with video background
- Built featured deals showcase with hover effects
- Developed popular pizzas gallery
- Established design system and component architecture
- Configured shadcn/ui component library
- Implemented responsive layouts and breakpoints

### Technical Achievements

- Configured custom Tailwind theme
- Implemented responsive design patterns
- Set up Framer Motion animations
- Created reusable UI components
- Established type-safe component architecture
- Optimized image loading and caching
- Implemented modular component system

### Project Breakdown

1. Project Setup and Architecture
   - Initialized Next.js 13 project with TypeScript
   - Configured Tailwind CSS with custom theme
   - Set up shadcn/ui component library
   - Established project structure and organization

2. Core UI Components
   - Implemented responsive navigation bar
   - Created hero section with video background
   - Built featured deals showcase with hover effects
   - Developed popular pizzas gallery with dynamic loading

3. Design System
   - Implemented custom color scheme
   - Created consistent typography system
   - Set up responsive breakpoints
   - Established component styling patterns

### Hours Tracked - Week 1

- Project Setup & Configuration: 4 hours
- UI Component Development: 8 hours
- Design System Implementation: 6 hours
- Documentation & Planning: 2 hours
Total: 20 hours

## 🎯 Key Features

- Shopping cart with persistent storage
- Modern, responsive navigation with animated drawer
- Featured deals showcase with hover effects
- Popular pizzas gallery with dynamic data loading
- Pizza customization with real-time price updates
- Mobile-first responsive design
- Type-safe component architecture
- Optimized image loading and caching
- Modular UI component system

## 🛠️ Tech Stack

- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Image Loading**: Next.js Image + Unsplash API

## 📦 Project Structure

```tree
doughdoughs-pizza/
├── app/
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ └── globals.css # Global styles
├── components/
│ ├── HeroSection.tsx # Hero video section
│ ├── NavBar.tsx # Navigation bar
│ ├── CartDrawer.tsx # Shopping cart drawer
│ ├── FeaturedDeals.tsx# Deals section
│ ├── PopularPizzas.tsx# Popular pizzas section
│ └── ui/ # Reusable UI components
├── hooks/
│ └── useCart.ts # Cart state management
├── data/
│ ├── pizzas.ts # Pizza data and types
│ └── ingredients.ts # Ingredients data
└── utils/
├── images.ts # Image handling utilities
└── calculatePizzaPrice.ts # Price calculations
```

## 🚀 Getting Started

```shell
git clone https://github.com/yourusername/doughdoughs-pizza.git
```

```shell
npm install
```

```shell
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

The project uses a custom design system with the following key colors:

```css
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
  --background: 60 33% 97%;  /* #fbfaf3 */
  --foreground: 0 0% 3.9%;
  --card: 60 33% 97%;
  --card-foreground: 0 0% 3.9%;
  --popover: 60 33% 97%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 60 33% 97%;     /* #fbfaf3 */
  --primary-foreground: 0 0% 9%;
  --secondary: 8 75% 44%;    /* #c4391c */
  --secondary-foreground: 0 0% 98%;
  --muted: 60 33% 90%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 8 75% 44%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 60 33% 85%;
  --input: 60 33% 85%;
  --ring: 8 75% 44%;
  --radius: 0.75rem;
}
```

## 📱 Responsive Design

The website is fully responsive with breakpoints for:

- Mobile: Default
- Tablet: `sm:` (640px)
- Desktop: `lg:` (1024px)

## 🔧 Configuration

Key configuration files:

- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `components.json`: UI component configuration

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔮 Future Plans

- User authentication
- Order tracking system
- Payment integration
- Admin dashboard
- Real-time order updates
- Order history
- Delivery status tracking
- Customer reviews system

## 🔧 Technical Highlights

- Built with Next.js 13 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for UI components
- Framer Motion for animations
- Zustand for state management
- Dynamic image loading with Unsplash API
- Component-driven architecture
- Responsive drawer components
- Cart functionality with persistent state
- Custom hooks for state management
- Price calculation utilities

---

**Note**: This project is actively being developed with new features being added regularly.
