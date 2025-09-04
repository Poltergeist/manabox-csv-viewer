# MTG Collection Viewer — GitHub Copilot Instructions

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Project Overview
MTG Collection Viewer is a client-only React application for viewing and analyzing Magic: The Gathering card collections from CSV files. Features Scryfall image integration, advanced table functionality, and collection value estimation. No backend required - everything runs in the browser with localStorage persistence.

## Bootstrap & Development Setup

### Prerequisites and Installation
Install pnpm package manager:
```bash
npm install -g pnpm
```

### Repository Setup (All commands validated to work)
```bash
# Clone and navigate to directory
git clone https://github.com/Poltergeist/manabox-csv-viewer.git
cd manabox-csv-viewer

# Install dependencies (takes ~1-2 seconds)
pnpm install

# Start development server (ready in ~200ms)
pnpm dev
# ✓ Opens at http://localhost:5173/manabox-csv-viewer/

# Build for production (takes ~7 seconds)
pnpm run build
# ✓ Creates optimized build in ./dist/

# Run linting (takes ~1-2 seconds)
pnpm run lint
# ✓ No timeout needed - very fast

# Preview production build
pnpm run preview
# ✓ Opens at http://localhost:4173/manabox-csv-viewer/
```

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Table**: @tanstack/react-table v8
- **CSV**: PapaParse
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Debouncing**: use-debounce
- **Build Tool**: Vite 7.1.4
- **Package Manager**: pnpm 9.15.9
- **Images**: Scryfall API (`https://api.scryfall.com/cards/{id}`)

## Key Project Structure
```
manabox-csv-viewer/
├── src/
│   ├── components/          # React components
│   │   ├── CardImage.tsx    # Scryfall image handling
│   │   ├── CsvUpload.tsx    # Drag-and-drop CSV upload
│   │   ├── DataTable.tsx    # Main table with sorting/filtering
│   │   ├── ImageLightbox.tsx # Image modal
│   │   └── Toolbar.tsx      # Search, export, dense mode
│   ├── data/
│   │   └── sampleCsv.ts     # Sample MTG data
│   ├── hooks/
│   │   └── useScryfallCache.ts # Image caching logic
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── utils/
│   │   └── storage.ts       # localStorage utilities
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── .github/workflows/
│   ├── pages.yml            # GitHub Pages deployment
│   └── copilot-setup-steps.yml # Copilot environment setup
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration with GitHub Pages base
├── tsconfig.app.json        # TypeScript config with @/* alias
├── eslint.config.js         # ESLint configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Validation & Testing

### Manual Application Testing (REQUIRED after changes)
Always validate changes by running complete user scenarios:

1. **Start dev server and verify basic load**:
   ```bash
   pnpm dev
   # Navigate to http://localhost:5173/manabox-csv-viewer/
   ```

2. **Test sample data functionality**:
   - Click "Load Sample Data" button
   - Verify table loads with MTG cards showing estimated value
   - Verify search functionality works (try "Lightning")
   - Verify export CSV downloads file correctly

3. **Test CSV upload (if applicable)**:
   - Drag and drop CSV or use "Browse Files"
   - Verify table updates with new data

4. **Test table features**:
   - Sort columns by clicking headers
   - Use search to filter results
   - Toggle dense mode
   - Test pagination if >10 rows

### Code Quality Checks
Always run before committing:
```bash
# TypeScript compilation check
pnpm run build

# Linting (must pass - no warnings/errors)
pnpm run lint
```

### Expected Behavior Notes
- **Scryfall API**: In development/CI environments, Scryfall API calls may be blocked - this is normal and expected. The app gracefully handles failed image loads.
- **localStorage**: CSV data and image cache persist between sessions
- **Estimated Value**: Automatically calculated as Price × Quantity when applicable
- **No backend**: Everything runs client-side

## Configuration Details

### TypeScript Configuration
- **Strict mode enabled** with comprehensive linting rules
- **Path alias**: `@/*` maps to `./src/*`
- **Target**: ES2022 with modern React JSX transform

### Vite Configuration
- **Base path**: `/manabox-csv-viewer/` (configured for GitHub Pages)
- **Hot reload**: Enabled for development
- **Build output**: `./dist/` directory

### GitHub Pages Deployment
- **Auto-deploy**: Triggered on pushes to main branch
- **Build process**: Uses pnpm and deploys to GitHub Pages
- **URL**: `https://[username].github.io/manabox-csv-viewer/`

## Development Conventions
- **Components**: Keep small and readable, one responsibility each
- **TypeScript**: Use strict typing, no `any` types
- **Accessibility**: Include alt text, focusable controls, ESC key handlers
- **CSS**: Use Tailwind classes, avoid custom CSS when possible
- **State**: Minimal state, prefer React built-ins over external state management

## Common Commands & Timing
| Command | Purpose | Time | Notes |
|---------|---------|------|-------|
| `pnpm install` | Install dependencies | ~1-2s | Very fast due to pnpm efficiency |
| `pnpm dev` | Start dev server | ~200ms | Ready almost instantly |
| `pnpm run build` | Production build | ~7s | TypeScript compilation + Vite build |
| `pnpm run lint` | Run ESLint | ~1-2s | Fast linting check |
| `pnpm run preview` | Preview build | ~1s | Serves built files locally |

## Pre-Commit Checklist
Before opening any PR, verify:
- [ ] `pnpm run build` succeeds without errors
- [ ] `pnpm run lint` passes with no warnings
- [ ] Sample CSV and "Load Sample Data" button work
- [ ] Drag-and-drop CSV functionality works
- [ ] Table shows rows with sorting/filtering/pagination
- [ ] ScryfallId column triggers image thumbnails (may fail in CI - OK)
- [ ] "Estimated value" calculation appears when applicable
- [ ] Export CSV downloads correctly
- [ ] Search functionality filters results
- [ ] Dense mode toggle works
- [ ] No console errors in browser (except Scryfall API blocks)

## Troubleshooting
- **Images not loading**: Normal in CI/restricted networks - Scryfall API may be blocked
- **Build failures**: Run `pnpm run lint` first to catch common issues
- **TypeScript errors**: Check `tsconfig.app.json` for path alias configuration
- **CSS not applying**: Verify Tailwind classes and check `tailwind.config.js`
- **404 on GitHub Pages**: Ensure `vite.config.ts` has correct base path

## File Editing Guidelines
- **Always test changes** with the validation scenarios above
- **Keep changes minimal** - this is a working application
- **Follow existing patterns** in components and utilities
- **Update types** in `src/types/index.ts` when adding new data structures
- **Test CSV functionality** with both sample data and custom uploads