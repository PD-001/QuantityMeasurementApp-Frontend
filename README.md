# Quantity Measurement App — Frontend

An Angular 21 application for performing unit conversions, comparisons, and arithmetic operations across length, weight, volume, and temperature — secured with Google OAuth2 and JWT authentication.

---

## 🔗 Live Links

| Resource | URL |
|---|---|
| **Frontend App** | [quantitymeasurementapp-prakash.netlify.app](https://69e0c4dac4a3167ef5297772--quantitymeasurementapp-prakash.netlify.app/login) |
| **Backend API** | `https://quantitymeasurementappbackend-i56j.onrender.com` |
| **Swagger UI** | [API Docs on Render](https://quantitymeasurementappbackend-i56j.onrender.com/swagger-ui/index.html) |

---

## Features

- **Google OAuth2 login** — authenticate securely via your Google account
- **JWT session management** — token stored and sent automatically with every request
- **Unit operations** — compare, convert, add, subtract, and divide quantities
- **Measurement history** — view and manage all past operations
- **User profile** — displays authenticated Google account details
- **Route guards** — unauthenticated users are redirected to the login page
- **Responsive UI** — works on desktop and mobile browsers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Angular 21 |
| Auth | Google OAuth2 + JWT |
| HTTP | Angular `HttpClient` |
| Routing | Angular Router with `AuthGuard` |
| Hosting | Netlify |

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts              Protects routes from unauthenticated access
│   │   └── services/
│   │       ├── auth.service.ts            Handles login, logout, and token management
│   │       └── measurement.service.ts     Calls the backend measurement API endpoints
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login.component.html       Login page with Google OAuth2 button
│   │   │   └── login.component.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.html   Measurement history and summary view
│   │   │   └── dashboard.component.ts
│   │   ├── operations/
│   │   │   ├── operations.component.html  UI for compare, convert, add, subtract, divide
│   │   │   └── operations.component.ts
│   │   └── profile/
│   │       ├── profile.component.html     Displays current user's Google profile
│   │       └── profile.component.ts
│   │
│   ├── shared/
│   │   ├── components/navbar/
│   │   │   ├── navbar.component.html      Top navigation bar
│   │   │   └── navbar.component.ts
│   │   └── models/
│   │       └── measurement.model.ts       TypeScript interfaces for API data shapes
│   │
│   ├── app.component.ts                   Root application component
│   ├── app.config.ts                      Application-level providers and configuration
│   └── app.routes.ts                      Route definitions with lazy loading and guards
│
├── environments/                          Environment-specific API base URLs
├── index.html
├── main.ts
└── styles.css
```

---

## Getting Started (Local)

### Prerequisites

- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)
- The [backend API](https://github.com/PD-001/QuantityMeasurementApp) running locally or accessible via its deployed URL

### 1. Clone the repository

```bash
git clone https://github.com/PD-001/QuantityMeasurementApp-Frontend.git
cd QuantityMeasurementApp-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Open `src/environments/environment.ts` and set the backend API base URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

For the deployed backend, use:

```typescript
apiUrl: 'https://quantitymeasurementappbackend-i56j.onrender.com'
```

### 4. Run the application

```bash
ng serve
```

The app starts at `http://localhost:4200`

---

## Authentication Flow

```
1. User clicks "Login with Google" on the login page
2. Browser is redirected to the backend OAuth2 authorization endpoint:
   GET /oauth2/authorization/google
3. User authenticates with their Google account
4. Backend mints a JWT and redirects to the frontend:
   http://localhost:4200?token=<jwt>
5. AuthService extracts and stores the token
6. All subsequent API calls include the token:
   Authorization: Bearer <your_token>
7. AuthGuard checks for a valid token before allowing access to protected routes
```

---

## Pages & Routes

| Route | Component | Auth Required | Description |
|---|---|---|---|
| `/login` | `LoginComponent` | ❌ | Google login entry point |
| `/dashboard` | `DashboardComponent` | ✅ | Measurement history and totals |
| `/operations` | `OperationsComponent` | ✅ | Perform unit operations |
| `/profile` | `ProfileComponent` | ✅ | View Google account details |

---

## Supported Operations

All operations are performed by calling the backend REST API. Supported unit types:

| Type | Units |
|---|---|
| Length | `FEET`, `INCHES`, `YARDS`, `CENTIMETERS` |
| Weight | `KILOGRAM`, `GRAM`, `POUND` |
| Volume | `LITRE`, `MILLILITRE`, `GALLON` |
| Temperature | `CELSIUS`, `FAHRENHEIT` |

Operations available: **Compare**, **Convert**, **Add**, **Subtract**, **Divide**

---

## Deployment (Netlify)

The app is deployed on Netlify with a `_redirects` file to support Angular's client-side routing:

```
/*    /index.html   200
```

This ensures deep links and page refreshes resolve correctly instead of returning a 404.

Build command:
```bash
ng build --configuration production
```

Publish directory: `dist/<project-name>/browser`

---

## Related Repositories

| Repo | Description |
|---|---|
| [`QuantityMeasurementApp-Frontend`](https://github.com/PD-001/QuantityMeasurementApp-Frontend) | This repo — Angular 21 frontend |
| [`QuantityMeasurementApp`](https://github.com/PD-001/QuantityMeasurementApp) | Spring Boot REST API backend |