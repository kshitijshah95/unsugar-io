# 📚 Frontend Documentation

> Complete documentation for the Unsugar.io frontend application

---

## 📖 Documentation Index

### System-Wide Documentation
- **[Architecture Overview](./ARCHITECTURE.md)** - System architecture and component interactions
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Setup, workflow, and deployment

### Frontend-Specific Documentation
- **[Frontend Guide](./FRONTEND.md)** - React, TypeScript, API proxy layer
- **[Design Decisions (Frontend)](./DESIGN_DECISIONS_FRONTEND.md)** - Frontend technology choices

### Related Documentation
- **Backend docs:** `unsugar-api/docs/`
- **API proxy implementation:** `PROXY_LAYER_SUMMARY.md` (root)
- **Code review:** `CODE_REVIEW_API_PROXY.md` (root)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
unsugar-io/
├── docs/                       # 📚 Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── DEVELOPER_GUIDE.md     # Developer guide
│   ├── FRONTEND.md            # Frontend details
│   └── DESIGN_DECISIONS_FRONTEND.md
├── src/
│   ├── components/            # UI components
│   ├── pages/                 # Page components
│   ├── services/              # API services
│   ├── lib/                   # Core libraries (API client)
│   ├── utils/                 # Utilities (logger, tokens)
│   └── config/                # Configuration
└── public/                    # Static assets
```

---

## 🔗 Links

- **Production:** https://unsugar.io
- **API:** https://unsugar-io-api.onrender.com
- **Repository:** https://github.com/kshitijshah95/unsugar-io
- **Backend Repo:** https://github.com/kshitijshah95/unsugar-io-api
