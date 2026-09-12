# Church Management System - Frontend

This is the frontend application for the Church Management System. Built with Next.js, it provides a modern, responsive, and deeply integrated UI for Members, Admins, and Superadmins to seamlessly interact with church data.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State & Data Fetching:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **API Communication:** [Axios](https://axios-http.com/) (with interceptors for auth)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/installation) (Preferred package manager)
- A running instance of the [FastAPI Backend API](./backend/README.md)

## 🛠️ Setup & Installation

**1. Install Dependencies:**
From the root directory of the project, install the required packages:
```bash
pnpm install
```

**2. Environment Variables:**
Create a `.env.local` file in the root directory (if it doesn't already exist) to configure frontend-specific variables.
```env
# Backend API URL (FastAPI)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

## 🚀 Running the Development Server

Start the Next.js development server:
```bash
pnpm run dev
```
The application will be available at: [http://localhost:3000](http://localhost:3000)

## 🔒 Authentication & Routing

The application uses an Axios Interceptor combined with React Query to automatically handle token rotation. When a short-lived access token expires, the system seamlessly hits the backend refresh endpoint to maintain the user's session without forcing a manual re-login.

### Login Portals
For security and access segregation, the system provides distinct login portals:
- **Member Login:** [http://localhost:3000/auth/member](http://localhost:3000/auth/member)
- **Admin Login:** [http://localhost:3000/auth/admin](http://localhost:3000/auth/admin)
- **Superadmin Login:** [http://localhost:3000/auth/superadmin](http://localhost:3000/auth/superadmin)

*Note: Unauthenticated attempts to access protected routes (like `/superadmin`) will redirect to the respective login pages.*

## 📁 Project Structure

- `/app`: Next.js App Router pages, layouts, and route groups.
- `/components`: Reusable React components (UI, Forms, Loaders).
- `/lib`: Utility functions, constants, Axios configurations, and Zod schemas.
- `/hooks`: Custom React hooks, notably TanStack Query data fetching and mutation hooks (`/hooks/api`).
- `/backend`: The decoupled Python FastAPI backend service.
