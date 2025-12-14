# Guide d'Utilisation du Système de Pagination Réutilisable

## 🎯 Objectif

Ce guide explique comment utiliser le nouveau système de pagination réutilisable pour toutes les listes d'appels API dans l'application.

## 📁 Structure des Fichiers

### 1. Hook Réutilisable
- **`hooks/useInfiniteList.ts`** : Hook principal pour la pagination infinie
- **`components/InfiniteList.tsx`** : Composant de liste réutilisable

### 2. Hooks Spécifiques
- **`hooks/queries/useClientAccountsQuery.ts`** : Exemple pour les comptes clients
- **`hooks/queries/useAcquisitionSystemsInfiniteQuery.ts`** : Exemple pour les systèmes d'acquisition

## 🚀 Comment Utiliser le Système

### Étape 1: Créer les Query Keys

```typescript
// hooks/queries/useYourEntityQuery.ts
export const yourEntityKeys = {
  all: ['yourEntity'],
  lists: () => [...yourEntityKeys.all, 'list'],
  list: () => [...yourEntityKeys.lists()],
  detail: (id: number) => [...yourEntityKeys.all, 'detail', id.toString()],
};
```

### Étape 2: Créer le Hook de Liste

```typescript
export function useYourEntityInfiniteQuery() {
  return useInfiniteList<YourEntityType>({
    queryKey: yourEntityKeys.list(),
    fetchFunction: yourService.getYourEntities,
    limit: 20,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### Étape 3: Créer les Hooks de Mutations

```typescript
export function useCreateYourEntityMutation() {
  return useCreateMutation<YourEntityType, CreatePayload>({
    mutationFn: yourService.createYourEntity,
    invalidateQueries: [yourEntityKeys.list()],
    context: 'useCreateYourEntityMutation',
  });
}

export function useUpdateYourEntityMutation() {
  return useUpdateMutation<YourEntityType, { id: number; payload: UpdatePayload }>({
    mutationFn: ({ id, payload }) => yourService.updateYourEntity(id, payload),
    invalidateQueries: [yourEntityKeys.list()],
    updateQueries: [
      {
        queryKey: yourEntityKeys.detail(0), // Sera remplacé avec l'ID réel
        data: {} as YourEntityType, // Sera remplacé avec les données réelles
      },
    ],
    context: 'useUpdateYourEntityMutation',
  });
}

export function useDeleteYourEntityMutation() {
  return useDeleteMutation<number>({
    mutationFn: yourService.deleteYourEntity,
    invalidateQueries: [yourEntityKeys.list()],
    removeQueries: [yourEntityKeys.detail(0)], // Sera remplacé avec l'ID réel
    context: 'useDeleteYourEntityMutation',
  });
}
```

### Étape 4: Utiliser dans un Composant

```typescript
import InfiniteList from '@/components/InfiniteList';
import { useYourEntityInfiniteQuery } from '@/hooks/queries/useYourEntityQuery';

export default function YourEntityScreen() {
  const {
    data: entities,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useYourEntityInfiniteQuery();

  const renderItem = ({ item, index }) => (
    <YourEntityCard
      entity={item}
      index={index}
      onPress={() => handleEntityPress(item)}
    />
  );

  return (
    <InfiniteList
      data={entities}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      onRefresh={refetch}
      renderItem={renderItem}
      emptyMessage="Aucune entité trouvée"
      loadingMoreText="Chargement..."
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
```

## 🔧 Configuration du Service

Votre service doit retourner une `HydraCollection<T>` :

```typescript
// services/yourService.ts
export const yourService = {
  async getYourEntities(page: number = 1, limit: number = 20): Promise<HydraCollection<YourEntityType>> {
    return apiClient.get(`/your_entities?page=${page}&limit=${limit}`);
  },
  
  async createYourEntity(payload: CreatePayload): Promise<YourEntityType> {
    return apiClient.post('/your_entities', payload);
  },
  
  async updateYourEntity(id: number, payload: UpdatePayload): Promise<YourEntityType> {
    return apiClient.put(`/your_entities/${id}`, payload);
  },
  
  async deleteYourEntity(id: number): Promise<void> {
    return apiClient.delete(`/your_entities/${id}`);
  },
};
```

## 📋 Interface HydraCollection

```typescript
export interface HydraCollection<T> {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: T[];
  view: {
    '@id': string;
    '@type': 'PartialCollectionView';
    first?: string;
    last?: string;
    next?: string;
    previous?: string;
  };
}
```

## 🎨 Personnalisation du Composant InfiniteList

Le composant `InfiniteList` accepte de nombreuses props pour la personnalisation :

```typescript
interface InfiniteListProps<T> {
  data: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  renderItem: ({ item, index }) => React.ReactElement;
  error?: Error | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  loadingMoreText?: string;
  onEndReachedThreshold?: number;
  contentContainerStyle?: any;
  style?: any;
  showsVerticalScrollIndicator?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  estimatedItemSize?: number;
}
```

## 🔄 Migration des Composants Existantants

### Avant (Ancien système) :
```typescript
// Ancien hook spécifique
export function useClientAccountsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: adminKeys.clientAccountsList(),
    queryFn: ({ pageParam = 1 }) => adminService.getClientAccounts(pageParam, 20),
    // ... configuration spécifique
  });
}

// Ancien composant spécifique
export default function ClientAccountList({ onClientAccountPress, ... }) {
  const { data, isLoading, ... } = useClientAccountsInfiniteQuery();
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      onEndReached={loadMore}
      // ... configuration spécifique
    />
  );
}
```

### Après (Nouveau système réutilisable) :
```typescript
// Hook réutilisable générique
export function useClientAccountsInfiniteQuery() {
  return useInfiniteList<ClientAccount>({
    queryKey: clientAccountKeys.list(),
    fetchFunction: adminService.getClientAccounts,
    // Configuration standardisée
  });
}

// Composant réutilisable générique
export default function ClientAccountList({ onClientAccountPress, ... }) {
  const { data, isLoading, ... } = useClientAccountsInfiniteQuery();
  
  return (
    <InfiniteList
      data={data}
      renderItem={renderItem}
      // Configuration standardisée
    />
  );
}
```

## ✅ Avantages du Système Réutilisable

1. **Maintenabilité** : Un seul fichier à maintenir pour la logique de pagination
2. **Consistance** : Toutes les listes ont le même comportement
3. **Performance** : Optimisations appliquées uniformément
4. **Tests** : Tests centralisés pour la logique de pagination
5. **Évolution** : Améliorations bénéficient à toutes les entités

## 🚨 Points d'Attention

1. **Types** : Assurez-vous que vos services retournent bien des `HydraCollection<T>`
2. **Query Keys** : Utilisez une structure cohérente pour les query keys
3. **Mutations** : Pensez à invalider les queries appropriées après les mutations
4. **Performance** : Utilisez `keyExtractor` et `estimatedItemSize` pour optimiser le rendu

## 📚 Exemples Complets

Voir les fichiers suivants pour des exemples complets :
- `hooks/queries/useClientAccountsQuery.ts` : Implémentation complète pour les comptes clients
- `hooks/queries/useAcquisitionSystemsInfiniteQuery.ts` : Implémentation pour les systèmes d'acquisition
- `app/(tabs)/admin.tsx` : Utilisation dans une page complète
- `components/admin/ClientAccountList.tsx` : Utilisation dans un composant spécifique