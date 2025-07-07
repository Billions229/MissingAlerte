# Missing Alert - Architecture React Native (Expo) Complète

## 🏗️ Stack Technologique Recommandée

### Frontend (React Native + Expo)
```json
{
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/drawer": "^6.6.6",
    
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "expo-location": "~16.1.0",
    "expo-camera": "~13.4.4",
    "expo-image-picker": "~14.3.2",
    "expo-notifications": "~0.20.1",
    "expo-secure-store": "~12.3.1",
    "expo-font": "~11.4.0",
    "expo-splash-screen": "~0.20.5",
    "expo-constants": "~14.4.2",
    "expo-linking": "~5.0.2",
    "expo-router": "^2.0.0",
    
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-maps": "1.7.1",
    "react-native-svg": "13.9.0",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-reanimated": "~3.3.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0",
    
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "redux-persist": "^6.0.0",
    "redux-toolkit-query": "^1.9.7",
    
    "@supabase/supabase-js": "^2.38.4",
    "react-native-url-polyfill": "^2.0.0",
    
    "react-native-toast-message": "^2.1.6",
    "react-native-modal": "^13.0.1",
    "react-native-paper": "^5.11.1",
    "react-native-vector-icons": "^10.0.2",
    "react-native-image-cache-wrapper": "^0.0.4",
    
    "formik": "^2.4.5",
    "yup": "^1.3.3",
    "react-hook-form": "^7.47.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    
    "react-native-permissions": "^3.10.1",
    "react-native-device-info": "^10.11.0",
    "react-native-network-info": "^5.2.1",
    "@react-native-async-storage/async-storage": "1.18.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "@types/react-native": "~0.72.2",
    "@typescript-eslint/eslint-plugin": "^6.7.4",
    "@typescript-eslint/parser": "^6.7.4",
    "eslint": "^8.51.0",
    "eslint-config-expo": "^7.0.0",
    "prettier": "^3.0.3",
    "typescript": "^5.1.3",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0",
    "detox": "^20.13.0"
  }
}
```

### Backend (Supabase)
```yaml
# Supabase Services
- Authentication (Phone + SMS OTP)
- PostgreSQL Database (Real-time)
- Storage (Images/Videos)
- Edge Functions (Business logic)
- Real-time subscriptions
- Row Level Security (RLS)

# Additional Services
- Google Maps API
- Twilio (SMS backup)
- SendGrid (Email notifications)
- Expo Push Notifications
```

### Web Dashboard (Next.js + Supabase)
```yaml
# Next.js 13+ with App Router
- Admin panel for authorities
- Family dashboard  
- Analytics & reporting
- Moderation tools
- Real-time updates
```

## 📁 Structure de Projet Complète## 🔧 Configuration & Setup

### Configuration Supabase
```typescript
// src/core/config/supabase.config.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
```

### Redux Store Configuration
```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { rootReducer } from './root.reducer'
import { authMiddleware } from './middleware/auth.middleware'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'alerts'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authMiddleware),
})

export const persistor = persistStore(store)
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```


# Missing Alert - Structure Complète React Native + Expo

```
missing_alert/
├── 📱 mobile_app/                    # React Native Expo App
│   ├── app/                          # Expo Router structure
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   ├── verify-otp.tsx
│   │   │   └── profile-setup.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx             # Home/Alerts
│   │   │   ├── map.tsx
│   │   │   ├── volunteers.tsx
│   │   │   └── profile.tsx
│   │   ├── alert/
│   │   │   ├── create.tsx
│   │   │   ├── [id].tsx              # Alert details
│   │   │   └── edit/[id].tsx
│   │   ├── _layout.tsx
│   │   └── +not-found.tsx
│   │
│   ├── src/
│   │   ├── 🎯 core/                  # Core business logic
│   │   │   ├── constants/
│   │   │   │   ├── app.constants.ts
│   │   │   │   ├── api.constants.ts
│   │   │   │   ├── routes.constants.ts
│   │   │   │   └── colors.constants.ts
│   │   │   ├── config/
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── supabase.config.ts
│   │   │   │   └── environment.config.ts
│   │   │   ├── types/
│   │   │   │   ├── api.types.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── alert.types.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   └── navigation.types.ts
│   │   │   ├── utils/
│   │   │   │   ├── validators.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── permissions.ts
│   │   │   │   └── location.utils.ts
│   │   │   ├── services/
│   │   │   │   ├── supabase.service.ts
│   │   │   │   ├── location.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── camera.service.ts
│   │   │   │   └── analytics.service.ts
│   │   │   └── errors/
│   │   │       ├── app.errors.ts
│   │   │       └── error-handler.ts
│   │   │
│   │   ├── 🗂️ features/              # Feature-based architecture
│   │   │   ├── auth/
│   │   │   │   ├── store/
│   │   │   │   │   ├── auth.slice.ts
│   │   │   │   │   └── auth.api.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   ├── useLogin.ts
│   │   │   │   │   └── useOTPVerification.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── OTPInput.tsx
│   │   │   │   │   ├── PhoneInput.tsx
│   │   │   │   │   └── AuthButton.tsx
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts
│   │   │   │       └── otp.service.ts
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── store/
│   │   │   │   │   ├── alerts.slice.ts
│   │   │   │   │   └── alerts.api.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useAlerts.ts
│   │   │   │   │   ├── useCreateAlert.ts
│   │   │   │   │   ├── useUpdateAlert.ts
│   │   │   │   │   └── useNearbyAlerts.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── AlertCard.tsx
│   │   │   │   │   ├── AlertList.tsx
│   │   │   │   │   ├── AlertForm.tsx
│   │   │   │   │   ├── AlertDetails.tsx
│   │   │   │   │   ├── AlertStatusBadge.tsx
│   │   │   │   │   ├── PhotoPicker.tsx
│   │   │   │   │   └── LocationPicker.tsx
│   │   │   │   └── services/
│   │   │   │       ├── alerts.service.ts
│   │   │   │       └── geolocation.service.ts
│   │   │   │
│   │   │   ├── volunteers/
│   │   │   │   ├── store/
│   │   │   │   │   ├── volunteers.slice.ts
│   │   │   │   │   └── volunteers.api.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useVolunteers.ts
│   │   │   │   │   ├── useRegisterVolunteer.ts
│   │   │   │   │   └── useSightingReport.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── VolunteerCard.tsx
│   │   │   │   │   ├── VolunteerStats.tsx
│   │   │   │   │   ├── SightingForm.tsx
│   │   │   │   │   ├── VolunteerBadge.tsx
│   │   │   │   │   └── VolunteerMap.tsx
│   │   │   │   └── services/
│   │   │   │       └── volunteers.service.ts
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   ├── store/
│   │   │   │   │   ├── notifications.slice.ts
│   │   │   │   │   └── notifications.api.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useNotifications.ts
│   │   │   │   │   └── usePushNotifications.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── NotificationItem.tsx
│   │   │   │   │   ├── NotificationList.tsx
│   │   │   │   │   └── NotificationBadge.tsx
│   │   │   │   └── services/
│   │   │   │       ├── notifications.service.ts
│   │   │   │       └── push.service.ts
│   │   │   │
│   │   │   └── maps/
│   │   │       ├── store/
│   │   │       │   ├── maps.slice.ts
│   │   │       │   └── maps.api.ts
│   │   │       ├── hooks/
│   │   │       │   ├── useLocation.ts
│   │   │       │   ├── useGeocoding.ts
│   │   │       │   └── useMapMarkers.ts
│   │   │       ├── components/
│   │   │       │   ├── CustomMap.tsx
│   │   │       │   ├── AlertMarker.tsx
│   │   │       │   ├── UserLocationMarker.tsx
│   │   │       │   ├── MapControls.tsx
│   │   │       │   └── LocationSearch.tsx
│   │   │       └── services/
│   │   │           ├── maps.service.ts
│   │   │           └── geocoding.service.ts
│   │   │
│   │   ├── 🎨 shared/                # Shared components
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   │   ├── EmptyState.tsx
│   │   │   │   │   └── Avatar.tsx
│   │   │   │   ├── forms/
│   │   │   │   │   ├── FormField.tsx
│   │   │   │   │   ├── FormError.tsx
│   │   │   │   │   ├── DatePicker.tsx
│   │   │   │   │   └── ImageUpload.tsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Container.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── SafeAreaContainer.tsx
│   │   │   │   └── navigation/
│   │   │   │       ├── TabBar.tsx
│   │   │   │       ├── DrawerContent.tsx
│   │   │   │       └── HeaderRight.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAppState.ts
│   │   │   │   ├── useNetworkStatus.ts
│   │   │   │   ├── useDebounce.ts
│   │   │   │   ├── useAsyncStorage.ts
│   │   │   │   └── usePermissions.ts
│   │   │   ├── styles/
│   │   │   │   ├── theme.ts
│   │   │   │   ├── colors.ts
│   │   │   │   ├── typography.ts
│   │   │   │   ├── spacing.ts
│   │   │   │   └── global.styles.ts
│   │   │   └── constants/
│   │   │       ├── dimensions.ts
│   │   │       ├── fonts.ts
│   │   │       └── icons.ts
│   │   │
│   │   ├── 🏪 store/                 # Redux store
│   │   │   ├── store.ts
│   │   │   ├── root.reducer.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   └── logger.middleware.ts
│   │   │   └── persist/
│   │   │       └── persist.config.ts
│   │   │
│   │   ├── 🌐 api/                   # API layer
│   │   │   ├── client.ts
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.endpoints.ts
│   │   │   │   ├── alerts.endpoints.ts
│   │   │   │   ├── users.endpoints.ts
│   │   │   │   └── volunteers.endpoints.ts
│   │   │   ├── types/
│   │   │   │   ├── responses.ts
│   │   │   │   └── requests.ts
│   │   │   └── interceptors/
│   │   │       ├── auth.interceptor.ts
│   │   │       └── error.interceptor.ts
│   │   │
│   │   └── 🌍 localization/          # Internationalization
│   │       ├── i18n.ts
│   │       ├── locales/
│   │       │   ├── en.json
│   │       │   └── fr.json
│   │       └── hooks/
│   │           └── useTranslation.ts
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── sounds/
│   │
│   ├── __tests__/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── app.config.ts
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── 🌐 web_dashboard/                 # Next.js Dashboard
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   │   ├── alerts/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx
│   │   │   ├── family/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── alerts/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   └── alerts/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── Charts/
│   │   │       ├── LineChart.tsx
│   │   │       ├── BarChart.tsx
│   │   │       └── PieChart.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── features/
│   │       ├── alerts/
│   │       │   ├── AlertTable.tsx
│   │       │   ├── AlertForm.tsx
│   │       │   └── AlertStats.tsx
│   │       └── users/
│   │           ├── UserTable.tsx
│   │           └── UserForm.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── hooks/
│   │   ├── use-alerts.ts
│   │   ├── use-users.ts
│   │   └── use-auth.ts
│   │
│   ├── types/
│   │   ├── database.types.ts
│   │   └── auth.types.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── 🗄️ supabase/                     # Supabase Backend
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_alerts.sql
│   │   ├── 003_create_volunteers.sql
│   │   ├── 004_create_notifications.sql
│   │   └── 005_create_sightings.sql
│   │
│   ├── functions/
│   │   ├── alert-notifications/
│   │   │   ├── index.ts
│   │   │   └── package.json
│   │   ├── geofencing/
│   │   │   ├── index.ts
│   │   │   └── package.json
│   │   ├── sms-notifications/
│   │   │   ├── index.ts
│   │   │   └── package.json
│   │   └── email-notifications/
│   │       ├── index.ts
│   │       └── package.json
│   │
│   ├── policies/
│   │   ├── profiles.sql
│   │   ├── alerts.sql
│   │   ├── volunteers.sql
│   │   └── notifications.sql
│   │
│   ├── seed/
│   │   ├── profiles.sql
│   │   ├── alerts.sql
│   │   └── volunteers.sql
│   │
│   ├── config.toml
│   └── schema.sql
│
├── 📚 docs/                         # Documentation
│   ├── api/
│   │   ├── supabase-endpoints.md
│   │   ├── authentication.md
│   │   └── real-time.md
│   ├── deployment/
│   │   ├── expo-build.md
│   │   ├── app-store.md
│   │   ├── play-store.md
│   │   └── web-deployment.md
│   ├── architecture/
│   │   ├── redux-architecture.md
│   │   ├── expo-router.md
│   │   └── supabase-setup.md
│   ├── development/
│   │   ├── setup-guide.md
│   │   ├── coding-standards.md
│   │   └── testing-guide.md
│   └── user-guides/
│       ├── family-guide.md
│       ├── volunteer-guide.md
│       └── admin-guide.md
│
├── 🧪 testing/                      # Tests centralisés
│   ├── e2e/
│   │   ├── detox/
│   │   │   ├── config.json
│   │   │   └── tests/
│   │   │       ├── auth.test.js
│   │   │       ├── alerts.test.js
│   │   │       └── volunteers.test.js
│   │   └── playwright/
│   │       ├── config.ts
│   │       └── tests/
│   │           ├── dashboard.test.ts
│   │           └── admin.test.ts
│   │
│   ├── performance/
│   │   ├── lighthouse/
│   │   └── load-testing/
│   │
│   └── integration/
│       ├── supabase.test.ts
│       └── api.test.ts
│
├── 🚀 deployment/                   # Scripts de déploiement
│   ├── scripts/
│   │   ├── build-android.sh
│   │   ├── build-ios.sh
│   │   ├── deploy-web.sh
│   │   ├── deploy-functions.sh
│   │   └── setup-env.sh
│   │
│   ├── docker/
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   │
│   ├── ci-cd/
│   │   ├── .github/
│   │   │   └── workflows/
│   │   │       ├── mobile-build.yml
│   │   │       ├── web-deploy.yml
│   │   │       └── tests.yml
│   │   │
│   │   └── gitlab/
│   │       └── .gitlab-ci.yml
│   │
│   └── environments/
│       ├── development.env
│       ├── staging.env
│       └── production.env
│
├── 📋 project-management/           # Gestion de projet
│   ├── requirements/
│   │   ├── functional-requirements.md
│   │   ├── technical-requirements.md
│   │   └── non-functional-requirements.md
│   │
│   ├── design/
│   │   ├── wireframes/
│   │   ├── ui-mockups/
│   │   ├── user-flows/
│   │   └── design-system/
│   │
│   ├── planning/
│   │   ├── roadmap.md
│   │   ├── sprint-planning.md
│   │   └── risk-assessment.md
│   │
│   └── api-specs/
│       ├── openapi.yaml
│       └── postman-collection.json
│
├── 🔧 tools/                       # Outils de développement
│   ├── generators/
│   │   ├── component-generator.js
│   │   └── screen-generator.js
│   │
│   ├── scripts/
│   │   ├── setup-project.sh
│   │   ├── db-backup.sh
│   │   └── cleanup.sh
│   │
│   └── configs/
│       ├── eslint.config.js
│       ├── prettier.config.js
│       └── jest.config.js
│
├── .gitignore
├── .env.example
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

## 🏛️ Architecture Patterns

### Redux Toolkit + RTK Query
- **State Management**: Redux Toolkit pour la gestion d'état
- **API Calls**: RTK Query pour les appels API optimisés
- **Persistence**: Redux Persist pour la persistence
- **Middleware**: Custom middleware pour l'authentification

### Expo Router
- **File-based Routing**: Navigation basée sur la structure des fichiers
- **Nested Navigation**: Support des navigations imbriquées
- **Deep Linking**: Liens profonds automatiques
- **Type Safety**: Navigation typée avec TypeScript

### Supabase Integration
- **Real-time**: Subscriptions en temps réel
- **Authentication**: Auth avec OTP SMS
- **Row Level Security**: Sécurité au niveau des lignes
- **Edge Functions**: Fonctions serverless
- **Storage**: Stockage de fichiers sécurisé

## 🎯 Features Principales

### Mobile App (React Native + Expo)
- **Authentification**: Login avec numéro de téléphone + OTP
- **Création d'alertes**: Formulaire avec photo, localisation, informations
- **Carte interactive**: Affichage des alertes à proximité
- **Bénévolat**: Inscription et signalement d'observations
- **Notifications**: Push notifications en temps réel
- **Offline Support**: Fonctionnement hors ligne partiel

### Web Dashboard (Next.js)
- **Admin Panel**: Gestion des alertes et utilisateurs
- **Analytics**: Statistiques et métriques détaillées
- **Modération**: Outils de modération de contenu
- **Responsive Design**: Interface adaptative
- **Real-time Updates**: Mises à jour en temps réel