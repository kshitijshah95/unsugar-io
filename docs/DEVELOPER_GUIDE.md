# 👨‍💻 Developer Guide - Frontend

> Complete guide for frontend developers working on Unsugar.io

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher  
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/kshitijshah95/unsugar-io.git
cd unsugar-io

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Server runs at: **http://localhost:5173**

---

## 📁 Project Structure

```
unsugar-io/
├── docs/                       # Documentation
├── src/
│   ├── components/            # UI components
│   │   ├── common/           # Reusable components
│   │   └── NavBar.tsx        # Navigation
│   ├── pages/                # Page components
│   │   ├── Home.tsx
│   │   ├── BlogList.tsx
│   │   └── BlogPage.tsx
│   ├── services/             # API services
│   │   ├── authService.ts
│   │   └── blogService.ts
│   ├── lib/                  # Core libraries
│   │   └── apiClient.ts      # Axios + interceptors
│   ├── utils/                # Utilities
│   │   ├── tokenManager.ts
│   │   └── logger.ts
│   ├── config/               # Configuration
│   │   └── api.ts
│   ├── types/                # TypeScript types
│   └── styles/               # CSS files
├── public/                   # Static assets
├── .env                      # Environment variables
└── vite.config.ts           # Vite configuration
```

---

## 🛠️ Development Workflow

### 1. Start Dev Server

```bash
npm run dev
```

- Hot module replacement (HMR) enabled
- Auto-reloads on file changes
- TypeScript type checking in terminal

### 2. Build for Production

```bash
npm run build
```

Output: `dist/` folder

### 3. Preview Production Build

```bash
npm run preview
```

Tests production build locally

### 4. Lint Code

```bash
npm run lint
```

Runs ESLint on all TypeScript files

---

## 🔧 Environment Variables

### `.env` (Development)

```env
VITE_API_BASE_URL=http://localhost:3001
```

### `.env.production` (Production)

```env
VITE_API_BASE_URL=https://unsugar-io-api.onrender.com
```

**Note:** Vite only exposes vars with `VITE_` prefix to client code.

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good: Explicit types
const fetchBlogs = async (): Promise<Blog[]> => {
  return await blogService.getAllBlogs();
};

// ❌ Bad: Implicit any
const fetchBlogs = async () => {
  return await blogService.getAllBlogs();
};
```

### Component Structure

```typescript
// ✅ Good: Functional component with types
interface Props {
  title: string;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ title, onClose }) => {
  return <div>{title}</div>;
};

// ❌ Bad: No types
export const Modal = ({ title, onClose }) => {
  return <div>{title}</div>;
};
```

### Error Handling

```typescript
// ✅ Good: Use logger, handle ApiError
try {
  const blogs = await blogService.getAllBlogs();
} catch (error) {
  logger.error('Failed to fetch blogs', error);
  if (error instanceof ApiError) {
    // Handle specific error
  }
}

// ❌ Bad: Console.log, no error handling
try {
  const blogs = await blogService.getAllBlogs();
} catch (error) {
  console.log(error);
}
```

---

## 🧪 Testing (Planned)

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

---

## 🚢 Deployment

### Netlify (Auto-Deploy)

1. Push to `main` branch
2. Netlify auto-builds and deploys
3. Live at: https://unsugar.io

### Manual Deploy

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables (Netlify)

Set in Netlify dashboard:
- `VITE_API_BASE_URL=https://unsugar-io-api.onrender.com`

---

## 🐛 Debugging

### Browser DevTools

```typescript
// Use logger (auto-removed in production)
logger.info('Component rendered', { props });
logger.error('API call failed', error);
```

### React DevTools

Install Chrome extension for component inspection

### Network Tab

Monitor API calls:
- Check request headers (Authorization)
- Verify response data
- Check timing

---

## 📚 Additional Resources

- **Architecture:** [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
- **Frontend Guide:** [docs/FRONTEND.md](./FRONTEND.md)
- **Design Decisions:** [docs/DESIGN_DECISIONS_FRONTEND.md](./DESIGN_DECISIONS_FRONTEND.md)
- **Backend API:** [Backend Repo](https://github.com/kshitijshah95/unsugar-io-api)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes
3. Run linter: `npm run lint`
4. Test locally
5. Commit: `git commit -m "feat: add new feature"`
6. Push: `git push origin feature/new-feature`
7. Create Pull Request

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Tests
- `chore:` Maintenance

---

## 🔗 Links

- **Production:** https://unsugar.io
- **Repository:** https://github.com/kshitijshah95/unsugar-io
- **Backend API:** https://unsugar-io-api.onrender.com
- **Backend Repo:** https://github.com/kshitijshah95/unsugar-io-api
