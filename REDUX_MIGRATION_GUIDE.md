# Redux Migration Guide

## Summary of Changes

The Redux store has been consolidated and fixed. All Redux files now live in `/src/Hook/Redux/` as the single source of truth.

## New Redux Structure

### Location
- **Store**: `/src/Hook/Redux/Store/store.tsx`
- **Slices**: `/src/Hook/Redux/Slice/`
  - `authSlice.tsx` - User authentication data
  - `tokenSlice.tsx` - Authentication token
  - `headerSlice.tsx` - Page header (title/subtitle)

### Store Configuration

```typescript
{
  auth: {
    user: AuthData | null,
    isAuthenticated: boolean
  },
  token: {
    token: string | null
  },
  header: {
    title: string,
    subtitle: string
  }
}
```

## Key Changes

### 1. Auth Slice (authSlice.tsx)
- **Old**: `state.Auth.value` or `state.userAuth.value`
- **New**: `state.auth.user` and `state.auth.isAuthenticated`
- **Actions**: `setAuthData(userData)`, `clearAuthData()`

### 2. Token Slice (tokenSlice.tsx)
- **Access**: `state.token.token`
- **Actions**: `setToken(token)`, `clearToken()`

### 3. Header Slice (headerSlice.tsx)
- **Old**: `state.header.value.title` and `state.header.value.subtitle`
- **New**: `state.header.title` and `state.header.subtitle`
- **Actions**: `setHeaderData({ title, subtitle })`, `clearHeaderData()`

## Import Paths

### Correct Imports (Use These)
```typescript
import { store, RootState, AppDispatch } from "@/Hook/Redux/Store/store";
import { setAuthData, clearAuthData } from "@/Hook/Redux/Slice/authSlice";
import { setToken, clearToken } from "@/Hook/Redux/Slice/tokenSlice";
import { setHeaderData, clearHeaderData } from "@/Hook/Redux/Slice/headerSlice";
```

### Deprecated Imports (Still Work via Re-exports)
```typescript
// These still work but are deprecated
import { AppDispatch } from "@/utils/redux/store";
import { setHeaderData } from "@/utils/redux/slices/headerSlice";
```

## Usage Examples

### Setting Auth Data (e.g., after login)
```typescript
import { useDispatch } from "react-redux";
import { setAuthData } from "@/Hook/Redux/Slice/authSlice";
import { setToken } from "@/Hook/Redux/Slice/tokenSlice";

const dispatch = useDispatch();

// After successful login
dispatch(setAuthData(response?.data?.data));
dispatch(setToken(response?.data?.token));
```

### Reading Auth Data
```typescript
import { useSelector } from "react-redux";
import { RootState } from "@/Hook/Redux/Store/store";

const authData = useSelector((state: RootState) => state.auth);
const userName = authData.user?.name;
const isLoggedIn = authData.isAuthenticated;
```

### Setting Header Data
```typescript
import { useDispatch } from "react-redux";
import { setHeaderData } from "@/Hook/Redux/Slice/headerSlice";

const dispatch = useDispatch();

dispatch(setHeaderData({ 
  title: "Dashboard", 
  subtitle: "Welcome back" 
}));
```

### Reading Header Data
```typescript
import { useSelector } from "react-redux";
import { RootState } from "@/Hook/Redux/Store/store";

const { title, subtitle } = useSelector((state: RootState) => state.header);
```

## Migration Checklist

- [x] Consolidated Redux store to `/src/Hook/Redux/`
- [x] Fixed authSlice to remove nested `.value`
- [x] Added headerSlice to new location
- [x] Updated store configuration
- [x] Fixed MasterHelper import path
- [x] Fixed SiteLayout to use new structure
- [x] Created backward compatibility re-exports
- [x] Updated LoginForms to work with new structure

## Backward Compatibility

The old import paths (`@/utils/redux/*`) still work through re-exports, but you should gradually migrate to the new paths (`@/Hook/Redux/*`) for consistency.

## Files Updated

1. `/src/Hook/Redux/Slice/authSlice.tsx` - Restructured
2. `/src/Hook/Redux/Slice/tokenSlice.tsx` - Cleaned up
3. `/src/Hook/Redux/Slice/headerSlice.tsx` - Created
4. `/src/Hook/Redux/Store/store.tsx` - Updated with all slices
5. `/src/utils/MasterHelper.tsx` - Fixed import path
6. `/src/components/layout/SiteLayout.tsx` - Updated selectors
7. `/src/utils/redux/store.tsx` - Re-export for compatibility
8. `/src/utils/redux/slices/headerSlice.tsx` - Re-export for compatibility
9. `/src/utils/redux/slices/userAuthSlice.tsx` - Re-export for compatibility
