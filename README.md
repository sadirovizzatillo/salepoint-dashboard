# ZPos Dashboard

Shop owner dashboard built with React + Ant Design + Vite + TypeScript.

## Stack

| Layer        | Library                   |
| ------------ | ------------------------- |
| UI           | Ant Design 5              |
| Routing      | React Router v6           |
| State        | Zustand                   |
| Server state | TanStack React Query v5   |
| HTTP         | Axios (with auto-refresh) |
| Charts       | Recharts                  |
| Build        | Vite + TypeScript         |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and set your API URL
cp .env.example .env
# Edit .env → VITE_API_URL=https://your-api.com/api/v1

# 3. Start dev server
npm run dev
```

## Auth Flow

1. User enters email + password → `POST /auth/login`
2. If multiple shops → Shop selector screen
3. User taps shop → `POST /auth/select-shop` with `preAuthToken`
4. Tokens saved to localStorage, redirected to Dashboard
5. On 401 → auto-refresh via `POST /auth/refresh`
6. On refresh failure → logout + redirect to `/login`

## Pages

| Route          | Page                 |
| -------------- | -------------------- |
| `/login`       | Login (Step 1)       |
| `/select-shop` | Shop picker (Step 2) |
| `/`            | Dashboard            |
| `/products`    | Products             |
| `/categories`  | Categories           |
| `/customers`   | Customers            |
| `/orders`      | Orders               |

## Project Structure

```
src/
├── api/          # Axios API functions per domain
├── components/   # Shared UI (layout, common, charts)
├── hooks/        # React Query hooks per domain
├── pages/        # Route-level page components
├── router/       # React Router config + ProtectedRoute
├── store/        # Zustand stores (auth, ui)
├── styles/       # Global CSS + Ant Design theme tokens
├── types/        # TypeScript interfaces per domain
└── utils/        # Formatters (currency, date, phone)
```

## Adding a new page

1. Add type in `src/types/`
2. Add API calls in `src/api/`
3. Add React Query hook in `src/hooks/`
4. Create page in `src/pages/`
5. Register route in `src/router/index.tsx`
6. Add nav item in `src/components/layout/Sidebar.tsx`
