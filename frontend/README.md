# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/                        # Static assets (images, icons, fonts)
│   │
│   ├── components/                    # Reusable UI components
│   │   ├── ui/                        # Base components (no business logic)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx              # Status / priority badges
│   │   │   ├── Modal.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   └── layout/                    # App shell components
│   │       ├── Sidebar.tsx
│   │       ├── Topbar.tsx
│   │       └── ProtectedRoute.tsx     # Redirects if not authenticated
│   │
│   ├── pages/                         # One file per route
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   │
│   │   ├── tickets/
│   │   │   ├── TicketListPage.tsx     # /tickets
│   │   │   ├── TicketDetailPage.tsx   # /tickets/:id
│   │   │   └── CreateTicketPage.tsx   # /tickets/create
│   │   │
│   │   └── NotFoundPage.tsx           # 404
│   │
│   ├── features/                      # Feature-specific components (not reusable)
│   │   ├── tickets/
│   │   │   ├── TicketTable.tsx        # Table with filters
│   │   │   ├── TicketForm.tsx         # Create ticket form
│   │   │   ├── TicketDetail.tsx       # Detail card + logs
│   │   │   ├── TicketLogList.tsx      # Action history
│   │   │   ├── EscalateModal.tsx      # Escalation form + note
│   │   │   └── AssignCriticalModal.tsx  # L2 assign C1/C2/C3
│   │   │
│   │   └── auth/
│   │       └── LoginForm.tsx
│   │
│   ├── services/                      # API call functions (axios)
│   │   ├── api.ts                     # Axios instance + interceptors
│   │   ├── auth.service.ts
│   │   ├── ticket.service.ts
│   │   └── ticketLog.service.ts
│   │
│   ├── store/                         # Global state (Context or Zustand)
│   │   ├── auth.store.ts              # Current user, token
│   │   └── ticket.store.ts            # Ticket list, filters
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts                 # Read auth store + login/logout
│   │   ├── useTickets.ts              # Fetch + filter tickets
│   │   └── useTicketDetail.ts         # Fetch single ticket + logs
│   │
│   ├── types/                         # Shared TypeScript types
│   │   ├── ticket.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts               # ApiResponse<T> wrapper type
│   │
│   ├── utils/                         # Pure helper functions
│   │   ├── formatDate.ts
│   │   ├── getPriorityColor.ts        # Returns Tailwind class by priority
│   │   └── getStatusColor.ts
│   │
│   ├── constants/                     # Static config
│   │   ├── roles.ts                   # L1 / L2 / L3 labels
│   │   └── categories.ts             # Mirror of backend categories
│   │
│   ├── router/
│   │   └── index.tsx                  # All routes defined here
│   │
│   ├── App.tsx                        # Mounts router
│   ├── main.tsx                       # Entry point
│   └── index.css                      # @import "tailwindcss"
│
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts