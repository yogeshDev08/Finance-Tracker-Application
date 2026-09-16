# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

Frontend Folder Structure
src/
├── app/
│   ├── store.ts                 # configureStore (Redux Toolkit)
│   ├── hooks.ts                 # typed useAppDispatch / useAppSelector
│   └── providers.tsx            # ThemeProvider, Redux Provider, etc.
│
├── features/                    # Domain-driven feature modules
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── components/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── components/          # SummaryCards, LineChart, DonutChart, UserCard, AIInsights
│   │   └── dashboardApi.ts      # RTK Query endpoints
│   ├── earnings/
│   │   ├── earningsSlice.ts     # (optional local UI state)
│   │   ├── EarningsPage.tsx
│   │   ├── EarningDetailPage.tsx
│   │   ├── components/
│   │   └── earningsApi.ts
│   ├── investments/
│   │   ├── InvestmentsPage.tsx
│   │   ├── InvestmentDetailPage.tsx
│   │   ├── components/
│   │   └── investmentsApi.ts
│   ├── loans/
│   │   ├── LoansPage.tsx
│   │   ├── LoanDetailPage.tsx
│   │   ├── components/
│   │   └── loansApi.ts
│   ├── expenses/
│   ├── savings/
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   └── settingsApi.ts
│   └── ui/                      # Global UI state
│       ├── uiSlice.ts           # sidebarCollapsed, theme, modals, filters
│       └── ThemeToggle.tsx
│
├── components/                  # Shared / reusable UI
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── MobileDrawer.tsx
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   └── DonutChart.tsx
│   ├── cards/
│   ├── forms/
│   └── ui/                      # Buttons, Inputs, ProgressCircle, etc.
│
├── services/                    # RTK Query base API + shared logic
│   ├── api.ts                   # createApi base (axios / fetch baseQuery)
│   └── axiosInstance.ts         # JWT interceptors + refresh
│
├── types/                       # Shared TypeScript types
│   ├── earning.ts
│   ├── investment.ts
│   ├── loan.ts
│   └── index.ts
│
├── utils/
│   ├── formatters.ts
│   └── constants.ts
│
├── assets/
│
├── App.tsx
├── main.tsx
└── index.css                    # Tailwind directives