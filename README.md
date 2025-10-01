# KwaGround - Fares & Jobs for Kenyan Youth

A React application that helps Kenyan youth track matatu and boda fares in real-time and find casual jobs across Kenya.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd kwa-ground-hub
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`.

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

The project is configured for deployment to Netlify. The build output is in the `dist/` folder.

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting platform (Netlify, Vercel, etc.)
3. For Netlify, the `netlify.toml` file handles routing for React Router.
