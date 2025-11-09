# ✅ Migration vers TanStack Query - TERMINÉE

## 🎉 Résumé

L'authentification et la gestion d'état utilisateur sont maintenant **complètement gérées par TanStack Query**.

---

## 📦 Ce qui a été fait

### 1. ✅ Système d'authentification avec TanStack Query
**Fichier:** `hooks/queries/useAuthQuery.ts`

Hooks disponibles:
- `useAuthState()` - État d'auth (token, user, isAuthenticated)
- `useLoginMutation()` - Se connecter
- `useLogoutMutation()` - Se déconnecter
- `useValidateToken()` - Valider le token au démarrage
- `useLoadUserInfoMutation()` - Recharger les infos user
- `useUpdateUserMutation()` - Mettre à jour le profil

**Features:**
- ✅ Persistance AsyncStorage automatique
- ✅ Synchronisation avec tokenManager
- ✅ Cache TanStack Query
- ✅ Validation token au démarrage

---

### 2. ✅ AuthProvider simplifié
**Fichier:** `contexts/AuthContext.tsx`

Wrapper léger autour des hooks TanStack Query qui expose:

```typescript
const {
  // État
  user,
  token,
  isAuthenticated,
  isLoading,

  // Actions
  login,
  logout,
  loadUserInfo,
  updateUser,

  // États des mutations
  isLoginPending,
  isLogoutPending,
  isLoadingUserInfo,
  isUpdatingUser
} = useAuth();
```

---

### 3. ✅ Intégration dans l'app

**`app/_layout.tsx`:**
- ✅ AuthProvider remplace UserProvider
- ✅ AuthGuard simplifié (plus besoin de validateToken/loadUserInfo manuel)
- ✅ Hydratation automatique depuis AsyncStorage

**Architecture des Providers:**
```
QueryClientProvider
  └── SettingsProvider
      └── AuthProvider
          └── AuthGuard
              └── App
```

---

### 4. ✅ Migration des composants

Tous les fichiers ont été migrés de `useUser()` vers `useAuth()`:
- ✅ `app/(tabs)/user.tsx`
- ✅ `app/sign-in.tsx`
- ✅ `app/_layout.tsx`

---

### 5. ✅ Nettoyage

- ✅ `contexts/UserContext.tsx` supprimé
- ✅ Pas de références restantes dans le code
- ✅ `tokenManager` toujours synchronisé

---

## 🚀 Utilisation

### Connexion

```typescript
import { useAuth } from '@/contexts/AuthContext';

function SignIn() {
  const { login, isLoginPending } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ username: 'user', password: 'pass' });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogin} disabled={isLoginPending}>
      <Text>{isLoginPending ? 'Connexion...' : 'Se connecter'}</Text>
    </TouchableOpacity>
  );
}
```

### Déconnexion

```typescript
const { logout, isLogoutPending } = useAuth();

const handleLogout = async () => {
  await logout();
  router.replace('/sign-in');
};
```

### Accéder aux données utilisateur

```typescript
const { user, token, isAuthenticated, isLoading } = useAuth();

if (isLoading) return <ActivityIndicator />;
if (!isAuthenticated) return <Text>Non connecté</Text>;

return <Text>Bonjour {user?.username}</Text>;
```

### Mettre à jour le profil

```typescript
const { updateUser, isUpdatingUser } = useAuth();

const handleUpdate = async () => {
  try {
    await updateUser({ username: 'newName' });
    Alert.alert('Succès', 'Profil mis à jour');
  } catch (error) {
    Alert.alert('Erreur', error.message);
  }
};
```

---

## 🎯 Avantages de cette migration

### ✅ Moins de code
- **Avant:** 150 lignes dans UserContext avec useState, useEffect, gestion manuelle
- **Après:** 100 lignes d'AuthProvider qui wrappe TanStack Query

### ✅ Cache intelligent
- Les données user sont automatiquement cachées
- Pas de requêtes inutiles
- Refetch en background si nécessaire

### ✅ État des mutations
- `isLoginPending`, `isLogoutPending` automatiques
- Plus besoin de gérer manuellement loading states
- Meilleure UX

### ✅ Persistance robuste
- AsyncStorage via TanStack Query
- Hydratation automatique au démarrage
- Synchronisation avec tokenManager

### ✅ Validation token
- Validation automatique au démarrage
- Nettoyage automatique si token invalide
- Pas de gestion manuelle

### ✅ DevTools
- Debugging facile avec React Query DevTools
- Visualisation du cache
- Time-travel (optionnel)

---

## 📊 Comparaison Avant/Après

### Avant (React Context)

```typescript
// UserContext.tsx - 150 lignes
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const hydrate = async () => {
    const stored = await AsyncStorage.getItem('user-storage');
    // ... 50 lignes de logique
  };
  hydrate();
}, []);

const login = async (user, token) => {
  setUser(user);
  setToken(token);
  await AsyncStorage.setItem('user-storage', JSON.stringify({ user, token }));
  tokenManager.setToken(token);
};

// ... Plus de logique pour logout, update, validate, etc.
```

**Utilisation:**
```typescript
const { token, user, login, logout, loadUserInfo } = useUser();
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);
  try {
    const response = await userService.login(credentials);
    const user = await userService.getUserInfo(response.token);
    await login(user, response.token);
    router.replace('/(tabs)');
  } catch (error) {
    // handle error
  } finally {
    setIsLoading(false);
  }
};
```

---

### Après (TanStack Query)

```typescript
// useAuthQuery.ts - Utilise les primitives de TanStack Query
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await userService.login(credentials);
      const user = await userService.getUserInfo(response.token);
      return { token: response.token, user };
    },
    onSuccess: async ({ token, user }) => {
      await saveAuthToStorage(token, user);
      queryClient.setQueryData(authKeys.state, { token, user, isAuthenticated: true });
    },
  });
}
```

**Utilisation:**
```typescript
const { login, isLoginPending } = useAuth();

const handleLogin = async () => {
  try {
    await login(credentials);
    router.replace('/(tabs)');
  } catch (error) {
    // handle error
  }
};
// Loading state automatique avec isLoginPending !
```

---

## 🔧 Configuration TanStack Query

La configuration est dans `config/queryClient.ts`:

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 10 * 60 * 1000,        // 10 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  }
}
```

**Pour l'auth spécifiquement:**
- `staleTime: Infinity` - L'état d'auth ne devient jamais "stale"
- `gcTime: Infinity` - Reste en cache indéfiniment
- AsyncStorage comme source de vérité

---

## 🧪 Tests à effectuer

### ✅ Flow de connexion
1. Ouvrir l'app → Devrait rediriger vers /sign-in
2. Entrer identifiants → Login
3. Devrait naviguer vers /(tabs)
4. User data devrait s'afficher

### ✅ Persistance
1. Se connecter
2. Fermer l'app complètement
3. Rouvrir → Devrait rester connecté
4. User data devrait être là

### ✅ Token invalide
1. Se connecter
2. Invalider le token manuellement (AsyncStorage ou backend)
3. Rafraîchir l'app
4. Devrait déconnecter automatiquement

### ✅ Déconnexion
1. Cliquer sur logout
2. Devrait rediriger vers /sign-in
3. Token et user data effacés
4. Cache nettoyé

### ✅ Update profile
1. Modifier le profil utilisateur
2. Données mises à jour immédiatement
3. Persistées dans AsyncStorage
4. Cache mis à jour

---

## 📱 Plateformes testées

- ✅ **Web** - Fonctionne
- ⏳ **iOS** - À tester
- ⏳ **Android** - À tester

---

## 🎓 Ressources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Auth Best Practices](https://tkdodo.eu/blog/practical-react-query)
- Guide complet: `TANSTACK_QUERY_GUIDE.md`

---

## 🚀 Prochaines étapes (optionnel)

### 1. DevTools (Développement)
Ajouter React Query DevTools pour le debugging:

```bash
npm install @tanstack/react-query-devtools
```

Dans `_layout.tsx`:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

### 2. Optimistic Updates
Pour des updates instantanées:

```typescript
const mutation = useUpdateUserMutation();

mutation.mutate(data, {
  onMutate: async (newData) => {
    // Snapshot et mise à jour optimiste
    const previous = queryClient.getQueryData(authKeys.state);
    queryClient.setQueryData(authKeys.state, { ...previous, user: newData });
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback si erreur
    queryClient.setQueryData(authKeys.state, context.previous);
  },
});
```

### 3. Refresh Token
Ajouter une gestion de refresh token:

```typescript
export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: (refreshToken: string) =>
      userService.refreshToken(refreshToken),
    onSuccess: (newToken) => {
      // Update token in cache
    },
  });
}
```

---

## ✨ Conclusion

Votre application utilise maintenant:
- ✅ **TanStack Query** pour l'authentification et le cache API
- ✅ **Context API** pour les settings (theme, langue)
- ✅ **AsyncStorage** pour la persistance
- ✅ **tokenManager** pour l'accès au token hors React

**Résultat:** Code plus simple, plus performant, plus maintenable ! 🎊

---

## 🆘 Problèmes courants

### Token non synchronisé
Si le token n'est pas disponible dans les services API:
- Vérifier que `tokenManager.setToken()` est appelé
- C'est fait automatiquement dans `useAuthQuery.ts`

### Redirect infini
Si l'app redirige en boucle:
- Vérifier `isLoading` dans AuthGuard
- S'assurer que la validation token fonctionne

### Cache pas à jour
Forcer un refetch:
```typescript
queryClient.invalidateQueries({ queryKey: authKeys.state });
```

---

**Migration complétée avec succès ! 🚀**
