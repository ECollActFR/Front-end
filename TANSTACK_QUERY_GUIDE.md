# TanStack Query Integration Guide

## 📚 Vue d'ensemble

TanStack Query (React Query) a été ajouté pour gérer le **cache des données serveur** (appels API). Votre **React Context API** reste en place pour l'état client (auth, settings, UI).

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   React Context API                 │
│   (État client)                     │
│   • Authentification (user, token)  │
│   • Settings (theme, langue)        │
│   • État UI                         │
└─────────────────────────────────────┘
              +
┌─────────────────────────────────────┐
│   TanStack Query                    │
│   (Données serveur)                 │
│   • Cache automatique               │
│   • Appels API (rooms, user info)   │
│   • Refetch background              │
│   • Synchronisation                 │
└─────────────────────────────────────┘
```

---

## 🚀 Hooks disponibles

### User Queries

#### `useUserInfoQuery(token, enabled)`
Charge les informations de l'utilisateur courant avec cache automatique.

```typescript
import { useUserInfoQuery } from '@/hooks/queries/useUserQuery';
import { useUser } from '@/contexts/UserContext';

function UserProfile() {
  const { token } = useUser();
  const { data: user, isLoading, error } = useUserInfoQuery(token);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Erreur: {error.message}</Text>;

  return <Text>{user?.username}</Text>;
}
```

**Avantages:**
- ✅ Cache automatique (10 min)
- ✅ Refetch en arrière-plan
- ✅ Pas de duplication d'état
- ✅ Loading/error states automatiques

#### `useUpdateUserMutation(token)`
Met à jour les informations utilisateur et met à jour le cache.

```typescript
import { useUpdateUserMutation } from '@/hooks/queries/useUserQuery';

function EditProfile() {
  const { token } = useUser();
  const mutation = useUpdateUserMutation(token);

  const handleUpdate = () => {
    mutation.mutate(
      { username: 'newName' },
      {
        onSuccess: (updatedUser) => {
          Alert.alert('Succès', 'Profil mis à jour');
        },
        onError: (error) => {
          Alert.alert('Erreur', error.message);
        },
      }
    );
  };

  return (
    <TouchableOpacity onPress={handleUpdate} disabled={mutation.isPending}>
      <Text>{mutation.isPending ? 'Envoi...' : 'Mettre à jour'}</Text>
    </TouchableOpacity>
  );
}
```

---

### Room Queries

#### `useRoomsQuery()`
Charge la liste de toutes les rooms.

```typescript
import { useRoomsQuery } from '@/hooks/queries/useRoomsQuery';

function RoomsList() {
  const { data: rooms, isLoading, error, refetch } = useRoomsQuery();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Erreur: {error.message}</Text>;

  return (
    <FlatList
      data={rooms}
      renderItem={({ item }) => <RoomItem room={item} />}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

**Features automatiques:**
- ✅ Pull-to-refresh gratuit
- ✅ Cache 10 minutes
- ✅ Refetch automatique sur focus

#### `useRoomDetailQuery(roomId, enabled)`
Charge les détails d'une room avec données capteurs.

```typescript
import { useRoomDetailQuery } from '@/hooks/queries/useRoomsQuery';

function RoomDetail({ roomId }: { roomId: number }) {
  const { data: room, isLoading } = useRoomDetailQuery(roomId);

  // Cache 1 minute (données capteurs changent souvent)
  // Auto-refetch en background

  return (
    <View>
      <Text>{room?.name}</Text>
      {room?.lastCapturesByType.map(capture => (
        <Text key={capture.type}>{capture.value}</Text>
      ))}
    </View>
  );
}
```

#### `useCreateRoomMutation()`
Crée une nouvelle room et met à jour le cache.

```typescript
import { useCreateRoomMutation } from '@/hooks/queries/useRoomsQuery';

function CreateRoom() {
  const mutation = useCreateRoomMutation();

  const handleCreate = () => {
    mutation.mutate(
      {
        name: 'Nouvelle Room',
        building: '/api/buildings/1',
        captureTypes: ['/api/capture_types/1'],
      },
      {
        onSuccess: () => {
          // Le cache de la liste est automatiquement invalidé
          router.back();
        },
      }
    );
  };

  return (
    <TouchableOpacity onPress={handleCreate}>
      <Text>Créer</Text>
    </TouchableOpacity>
  );
}
```

#### `useUpdateRoomMutation(roomId)`
Met à jour une room existante.

```typescript
const mutation = useUpdateRoomMutation(roomId);

mutation.mutate(updatedData, {
  onSuccess: () => {
    // Cache de la room et de la liste automatiquement mis à jour
  },
});
```

#### `useDeleteRoomMutation()`
Supprime une room.

```typescript
const mutation = useDeleteRoomMutation();

mutation.mutate(roomId, {
  onSuccess: () => {
    // Cache nettoyé automatiquement
    router.back();
  },
});
```

---

## 📝 Exemple de Migration

### ❌ Avant (sans React Query)

```typescript
function UserScreen() {
  const { token, user, loadUserInfo } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        await loadUserInfo();
      } catch (err: any) {
        setError(err?.message || 'Failed to load user info');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return <Text>{user?.username}</Text>;
}
```

**Problèmes:**
- ❌ Code boilerplate (useState, useEffect)
- ❌ Pas de cache
- ❌ Refetch à chaque mount
- ❌ Pas de refetch background

### ✅ Après (avec React Query)

```typescript
function UserScreen() {
  const { token } = useUser();
  const { data: user, isLoading, error } = useUserInfoQuery(token);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>{error.message}</Text>;

  return <Text>{user?.username}</Text>;
}
```

**Avantages:**
- ✅ 80% moins de code
- ✅ Cache automatique (10 min)
- ✅ Refetch intelligent
- ✅ Background updates
- ✅ Loading/error states automatiques

---

## 🎯 Quand utiliser React Query vs Context

### Utiliser **React Context** pour:
- ✅ Authentification (token, login, logout)
- ✅ Settings utilisateur (theme, langue)
- ✅ État UI (modals, navigation)
- ✅ État synchrone/local

### Utiliser **TanStack Query** pour:
- ✅ Données API/serveur
- ✅ Listes (rooms, users, etc.)
- ✅ Détails d'entités
- ✅ Tout ce qui nécessite du cache

---

## ⚙️ Configuration

Le `QueryClient` est configuré dans `/config/queryClient.ts`:

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,      // Fresh pendant 5 min
    gcTime: 10 * 60 * 1000,        // Cache pendant 10 min
    retry: 2,                       // 2 tentatives en cas d'échec
    refetchOnWindowFocus: true,     // Refetch au focus (web)
    refetchOnReconnect: true,       // Refetch à la reconnexion
  }
}
```

---

## 🔍 DevTools (optionnel)

Pour le debugging, vous pouvez ajouter les DevTools:

```bash
npm install @tanstack/react-query-devtools
```

Dans `app/_layout.tsx`:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// En bas du JSX
<ReactQueryDevtools initialIsOpen={false} />
```

---

## 📦 Query Keys

Les query keys sont centralisées pour faciliter l'invalidation:

```typescript
// hooks/queries/useRoomsQuery.ts
export const roomKeys = {
  all: ['rooms'],
  lists: () => [...roomKeys.all, 'list'],
  detail: (id: number) => [...roomKeys.all, 'detail', id],
};

// Invalider toutes les rooms
queryClient.invalidateQueries({ queryKey: roomKeys.all });

// Invalider une room spécifique
queryClient.invalidateQueries({ queryKey: roomKeys.detail(1) });
```

---

## 🚀 Performance Tips

1. **Optimistic Updates** pour les mutations instantanées:
```typescript
mutation.mutate(data, {
  onMutate: async (newData) => {
    // Annuler les refetch en cours
    await queryClient.cancelQueries({ queryKey: roomKeys.detail(id) });

    // Snapshot de l'ancien état
    const previous = queryClient.getQueryData(roomKeys.detail(id));

    // Mise à jour optimiste
    queryClient.setQueryData(roomKeys.detail(id), newData);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback en cas d'erreur
    queryClient.setQueryData(roomKeys.detail(id), context?.previous);
  },
});
```

2. **Prefetching** pour des transitions instantanées:
```typescript
const queryClient = useQueryClient();

const prefetchRoom = (roomId: number) => {
  queryClient.prefetchQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => roomService.getRoomDetail(roomId),
  });
};

// Prefetch au hover (web) ou au focus
<TouchableOpacity onPressIn={() => prefetchRoom(room.id)}>
```

3. **Pagination** pour grandes listes:
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: roomKeys.lists(),
  queryFn: ({ pageParam = 1 }) => roomService.getRooms(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextPage,
});
```

---

## 📚 Ressources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React Query + React Native Guide](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)

---

## 🎉 Résumé

**Vous avez maintenant:**
- ✅ Context API pour l'état client (auth, settings)
- ✅ TanStack Query pour les données serveur (cache API)
- ✅ Hooks prêts à l'emploi pour users et rooms
- ✅ Cache automatique et intelligent
- ✅ Performance optimale
- ✅ Code plus simple et maintenable

**Migration progressive:**
Pas besoin de tout migrer d'un coup ! Vous pouvez:
1. Garder le code actuel fonctionnel
2. Utiliser React Query pour les nouvelles features
3. Migrer progressivement les anciens appels API

Bon développement ! 🚀
