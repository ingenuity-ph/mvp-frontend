# React MVP Frontend Template

> 🚀 A modern, production-ready React template for building MVPs quickly and efficiently.

This template provides everything you need to start building a React application with authentication, analytics, monitoring, and a complete design system - all configured and ready to go!

## ✨ What's Included

- **React 19** - Latest React with modern features
- **TypeScript 5.7** - Full type safety with strict configuration
- **Vite 6** - Lightning-fast development and builds
- **TanStack Router** - Type-safe, file-based routing
- **TanStack Query** - Server state management with caching
- **Tailwind CSS 4** - Modern styling with custom design system
- **React Aria Components** - Accessible UI primitives
- **AWS Amplify** - Authentication ready (configuration needed)
- **PostHog Analytics** - User behavior tracking
- **Error Monitoring** - Production-ready error boundaries
- **Storybook** - Component documentation and testing

## 🎯 Getting Started

### Step 1: Use This Template

1. Click the **"Use this template"** button at the top of this repository
2. Choose **"Create a new repository"**
3. Give your project a name (e.g., `my-awesome-app`)
4. Choose if you want it public or private
5. Click **"Create repository from template"**

### Step 2: Clone Your New Repository

```bash
# Replace 'your-username' and 'your-repo-name' with your actual values
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Step 3: Install Dependencies

> ⚠️ **Important**: This project uses **yarn** as the package manager. Do not use npm.

```bash
yarn install
```

If you don't have yarn installed:

```bash
# macOS
brew install yarn

# Windows (using Chocolatey)
choco install yarn

# Or install globally with npm
npm install -g yarn
```

### Step 4: Set Up Environment Variables

Copy the example environment file:

```bash
# macOS/Linux
cp .env.sample .env.local

# Windows (Command Prompt)
copy .env.sample .env.local

# Windows (PowerShell)
Copy-Item .env.sample .env.local
```

### Step 5: Initial Configuration

Your `.env.local` file should look like this to get started:

```bash
# .env.local
VITE_API_URL="http://localhost:8000"
VITE_COGNITO_POOL_ID=          # Leave empty for now
VITE_COGNITO_CLIENT_ID=        # Leave empty for now
VITE_COGNITO_DOMAIN=           # Leave empty for now

# Analytics & Monitoring (Leave empty - console logging works by default)
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=
```

> 📝 **Note**: Analytics and monitoring work out of the box using console logging. You don't need to configure PostHog or other services initially. When you're ready for production analytics, ask your team lead for the appropriate credentials.

### Step 6: Start Development

```bash
yarn dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000)

### Step 7: Verify Everything Works

✅ Check that the development server started without errors  
✅ Visit [http://localhost:3000](http://localhost:3000) in your browser  
✅ Open browser developer tools (F12) - you should see analytics events in the console  
✅ Try navigating between pages

## 🔄 Keeping Your Template Updated

As we improve this template, you'll want to pull in those updates. **Always use Pull Requests** - never merge directly to main.

### First Time Setup

Add the original template as a remote source:

```bash
git remote add template https://github.com/original-username/mvp-frontend.git
git remote -v  # Verify it was added
```

### Pulling Template Updates (Always via PR)

```bash
# 1. Fetch latest changes from template
git fetch template

# 2. Create a new branch for the update
git checkout -b update-template-$(date +%Y%m%d)

# 3. Merge template changes
git merge template/main --allow-unrelated-histories

# 4. Resolve any conflicts in VS Code (see below)
# 5. Test everything works
yarn dev

# 6. Push branch and create Pull Request
git push origin update-template-$(date +%Y%m%d)
```

Then create a Pull Request in GitHub and **request review from your team lead**.

### Handling Merge Conflicts in VS Code

When conflicts occur, VS Code will show them clearly:

1. **Open VS Code** - conflicted files will be highlighted
2. **Click on conflicted files** - VS Code shows a 3-way merge view
3. **Use VS Code's merge conflict UI**:
   - Click "Accept Current Change" (your project's version)
   - Click "Accept Incoming Change" (template's version)  
   - Click "Accept Both Changes" (merge both)
   - Or manually edit the result

**Common conflicts and what to keep:**
- `package.json` - Keep your project name, accept new dependencies
- `README.md` - Keep your project-specific content  
- `.env.local` - Keep your configuration values

```bash
# After resolving all conflicts in VS Code
git add .
git commit -m "Merge template updates - resolved conflicts"
git push origin update-template-$(date +%Y%m%d)
```

> ⚠️ **Important**: Don't merge the PR yourself! Your team lead should review and merge template updates.

## 🛠️ Development Commands

All commands use **yarn** (never use npm with this project):

```bash
# Start development server (port 3000)
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn serve

# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run component documentation
yarn storybook

# Type checking (find TypeScript errors)
npx tsc --noEmit
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Design system components (DON'T modify)
│   └── layouts/        # Page layout components
├── features/           # Feature-specific components
│   └── auth/          # Authentication components
├── libs/              # Shared utilities and configurations
│   ├── analytics/     # PostHog analytics setup
│   ├── api/          # HTTP client configuration
│   ├── monitoring/   # Error tracking and monitoring
│   └── query/        # React Query configuration
├── routes/            # File-based routing
│   ├── __root.tsx    # Root layout (wraps all pages)
│   ├── (authenticated)/  # Protected routes (require login)
│   └── (unauthenticated)/ # Public routes (login, signup)
└── main.tsx          # App entry point
```

### Where to Add Your Code

- **New pages**: Add files to `src/routes/`
- **New components**: Add to `src/components/` or feature folders
- **Business logic**: Create new folders in `src/features/`
- **API calls**: Add to `src/libs/api/` or feature folders

### Files You Shouldn't Modify (As a Beginner)

- `src/components/ui/` - Design system components
- `src/libs/` - Core library configurations
- `vite.config.js`, `tsconfig.json` - Build configurations

## 📊 Analytics & Monitoring

The template includes analytics and monitoring that work out of the box:

```tsx
import { useAnalytics } from '@/libs/analytics';

function MyComponent() {
  const analytics = useAnalytics();

  const handleButtonClick = () => {
    // This works immediately - logs to console by default
    analytics.track('button_clicked', {
      button_name: 'signup',
      page: 'homepage'
    });
  };

  return <button onClick={handleButtonClick}>Sign Up</button>;
}
```

**What happens by default:**
- Page views are logged to console automatically
- Custom events are logged to console  
- Errors are captured and logged
- No external service setup required

### Production Analytics Setup

When ready for production analytics, ask your **team lead** for:
- PostHog credentials (if your team uses PostHog)
- Sentry DSN (if your team uses Sentry for error tracking)  
- Other monitoring service credentials

Your team should already have these services configured - you just need the environment variables.

## 🐛 Troubleshooting

### "Command not found: yarn"

**Solution**: Install yarn globally
```bash
npm install -g yarn
```

### Development server won't start

1. Check if port 3000 is already in use
2. Try a different port: `yarn dev --port 3001`
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   yarn install
   ```

### TypeScript errors

Run the type checker to see detailed errors:
```bash
npx tsc --noEmit
```

### Build fails

1. Fix any TypeScript errors first
2. Check that all environment variables are set
3. Try clearing the build cache:
   ```bash
   rm -rf dist
   yarn build
   ```

### Analytics not working

1. **Check browser console** (F12) - analytics events should appear there
2. Verify the analytics service is initialized (check console messages)
3. If using production analytics credentials, verify they're correct in `.env.local`

## ⚠️ Important Notes

- **Always use yarn**: Never mix npm and yarn in this project
- **Environment variables**: Never commit `.env.local` to git (it's already in .gitignore)
- **Package manager**: The project is configured for yarn - using npm may cause issues
- **Node version**: Use Node 18+ for best compatibility
- **VS Code Recommended**: This template assumes VS Code for merge conflict resolution

## 📋 Team Collaboration

- **Junior Developers**: Follow this README for setup, create PRs for template updates
- **Team Leads**: Review and merge template update PRs, manage production credentials
- **Production Services**: Team leads should provide analytics/monitoring credentials when ready

---

**Happy coding!** 🎉 If you run into issues, check the troubleshooting section above or create an issue in this repository.