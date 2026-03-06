# Local Test Execution Plan

## Quick Start Commands

### Prerequisites
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets
```

### 1. Pre-Push Smoke Test (Fastest)
Run this before every push to catch critical issues:
```bash
# 1. TypeScript check
npm run lint
npm run build

# 2. Quick unit tests
npm test -- --testPathPattern="unit" --passWithNoTests

# 3. Fast E2E smoke
npx playwright test tests/flows/user-flows.spec.ts --grep="should load"
```

### 2. Full Test Suite Before Production
```bash
# 1. Full linting
npm run lint

# 2. Type checking
npx tsc --noEmit

# 3. Unit tests
npm test

# 4. Integration tests
npx playwright test tests/api/

# 5. E2E tests
npx playwright test

# 6. Generate coverage
npm test -- --coverage
```

### 3. Run Tests by Category

#### Unit Tests Only
```bash
npm test -- --testPathPattern="tests/unit"
# or
npm test -- --testPathPattern="lib"
```

#### Component Tests Only
```bash
npm test -- --testPathPattern="components/.*\\.test\\."
```

#### API Tests Only
```bash
npx playwright test tests/api/
```

#### E2E Tests Only
```bash
npx playwright test tests/flows/
npx playwright test tests/auth/
```

#### Specific Test File
```bash
npm test -- --testPathPattern="permissions"
npx playwright test tests/auth/auth.spec.ts
```

### 4. Development Watch Mode
```bash
# Watch mode for unit tests
npm run test:watch

# For E2E with UI
npx playwright test --ui
```

### 5. Test Isolation Strategies

#### Run Single Test
```bash
npm test -- --testNamePattern="should return true when role has permission"
npx playwright test -g "should display login form"
```

#### Run Tests in Parallel (Playwright)
```bash
npx playwright test --parallel
```

#### Run Tests with Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=safari
```

### 6. Database Setup for Tests

#### Reset Test Database
```bash
# Using Prisma
npx prisma db push --force-reset
npm run db:seed
```

#### Using Test Utilities
```javascript
// In your test file
import { testDb } from './helpers/test-db'

beforeAll(async () => {
  await testDb.clean()
})

afterAll(async () => {
  await testDb.clean()
})
```

### 7. Coverage Reports

#### Unit Test Coverage
```bash
npm test -- --coverage --coverageReporters=text-summary
```

#### Generate HTML Report
```bash
npm test -- --coverage --coverageReporters=html
# Open coverage/lcov-report/index.html
```

#### E2E Coverage
```bash
npx playwright test --trace on
# Traces stored in test-results/
npx playwright show-trace test-results/
```

### 8. Debugging

#### Debug Unit Tests
```bash
npm test -- --inspect-brk
# Open chrome://inspect in browser
```

#### Debug E2E Tests
```bash
npx playwright test --debug
npx playwright test --ui
```

### 9. CI/CD Pipeline Commands
```bash
# GitHub Actions style
npm ci
npm run lint
npm run build
npm test -- --ci
npx playwright test --ci --reporter=html
```

### 10. Performance Testing

#### Load Testing (basic)
```bash
# Using playwright
npx playwright test tests/performance/
```

---

## Test Execution Order

### Recommended Order for Full Regression

1. **Lint & Type Check** (fails fast)
   ```bash
   npm run lint && npx tsc --noEmit
   ```

2. **Unit Tests** (fast feedback)
   ```bash
   npm test
   ```

3. **Component Tests** (isolated UI)
   ```bash
   npm test -- --testPathPattern="components"
   ```

4. **API Tests** (backend logic)
   ```bash
   npx playwright test tests/api/
   ```

5. **E2E Tests** (full flows)
   ```bash
   npx playwright test
   ```

---

## Troubleshooting

### Tests Failing
```bash
# Clear Jest cache
npm test -- --clearCache

# Clear Playwright cache
rm -rf test-results/ playwright/.cache/
```

### Database Issues
```bash
# Check Prisma connection
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Port Issues
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=3001 npm run dev
```

---

## Environment Variables for Testing

```bash
# .env.test
DATABASE_URL="postgresql://user:pass@localhost:5432/test_db"
NEXTAUTH_SECRET="test-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```
