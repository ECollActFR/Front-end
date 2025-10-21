# Neutria Front-end - Environmental Monitoring App

Application mobile cross-platform (iOS, Android, Web) pour le monitoring environnemental développée avec Expo et React Native.

## Vue d'ensemble

Cette application mobile permet de surveiller et gérer les conditions environnementales de différentes salles en temps réel. Elle se connecte à l'API Backend Neutria pour afficher les données des capteurs, gérer les salles et leurs équipements.

### Fonctionnalités principales

- **Surveillance multi-salles** : Visualisation de toutes les salles avec recherche et filtrage
- **Données en temps réel** : Affichage des dernières mesures de capteurs (température, humidité, CO2, luminosité, bruit)
- **Gestion des salles** : Création, modification et suppression de salles
- **Responsive design** : Interface adaptative pour mobile et desktop (breakpoint à 768px)
- **Mode clair/sombre** : Support automatique du thème système
- **Gestion des équipements** : Visualisation des équipements associés à chaque salle

## Technologies utilisées

- **Expo SDK** ~53.0.0 - Framework React Native
- **React** 19.1.0 - Bibliothèque UI
- **React Native** 0.81.4 - Framework mobile
- **Expo Router** ~6.0.10 - Navigation file-based
- **TypeScript** ~5.3.3 - Typage statique
- **React Native Reanimated** ~4.1.1 - Animations
- **React Native Gesture Handler** ~2.28.0 - Gestion des gestes

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Pour le développement mobile :
  - iOS : macOS avec Xcode
  - Android : Android Studio avec SDK Android
- Expo Go app (pour tester sur appareil physique)

## Installation

### 1. Cloner le dépôt

```bash
git clone <repository-url>
cd neutria/Front-end
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Vérifier la configuration de l'API dans `constants/config.ts` :

```typescript
export const API_BASE_URL = 'https://your-api-url.com';
```

## Démarrage

### Serveur de développement

```bash
npm start
# ou
npx expo start
```

### Plateformes spécifiques

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Structure du projet

```
.
├── app/                          # Navigation Expo Router
│   ├── (tabs)/                   # Groupe de navigation par onglets
│   │   ├── _layout.tsx          # Layout des onglets
│   │   └── index.tsx            # Écran d'accueil (liste des salles)
│   ├── room/
│   │   └── [id].tsx             # Écran de détail d'une salle
│   ├── _layout.tsx              # Layout racine
│   └── +not-found.tsx           # Écran 404
├── components/                   # Composants réutilisables
│   ├── atoms/                   # Composants atomiques
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Icon.tsx
│   │   ├── Input.tsx
│   │   └── LoadingSpinner.tsx
│   ├── molecules/               # Composants moléculaires
│   │   ├── AmenityChip.tsx
│   │   ├── AmenityList.tsx
│   │   ├── ConfirmDeleteModal.tsx
│   │   ├── DetailRow.tsx
│   │   ├── EquipmentItem.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── SearchBar.tsx
│   ├── organisms/               # Composants organismes
│   │   ├── RoomCard.tsx
│   │   ├── RoomEditModal.tsx
│   │   └── SensorCard.tsx
│   └── ui/                      # Composants UI système
│       └── icon-symbol.tsx
├── constants/                    # Constantes et configuration
│   ├── config.ts                # Configuration API
│   └── theme.ts                 # Thème et couleurs
├── hooks/                        # Custom hooks
│   ├── useRooms.ts              # Hook de gestion des salles
│   └── useRoomDetail.ts         # Hook de détail d'une salle
├── services/                     # Services API
│   └── roomService.ts           # Service de gestion des salles
├── types/                        # Définitions TypeScript
│   └── room.ts                  # Types pour les salles
├── CLAUDE.md                     # Instructions pour Claude Code
└── README.md                     # Ce fichier
```

## Palette de couleurs

L'application utilise une palette de couleurs cohérente définie dans `constants/theme.ts` :

### Mode clair
- **Textes principaux** : `#7692ff` (bleu)
- **Textes secondaires** : `#1E2E3D` (bleu nuit)
- **Arrière-plan** : `#EAECEB` (gris clair/pierre)
- **Arrière-plan secondaire** : `#FFFFFF` (blanc)
- **Boutons** : `#7E9F78` (vert olive)
- **Icônes** : `#7E9F78` (vert olive)
- **Liens** : `#ef7b45` (orange)
- **Bordures** : `#7E9F78` (vert olive)

### Mode sombre
- **Textes principaux** : `#EAECEB` (gris clair)
- **Textes secondaires** : `#7692ff` (bleu)
- **Arrière-plan** : `#1E2E3D` (bleu nuit)
- **Arrière-plan secondaire** : `#2A3F54` (bleu nuit clair)
- **Boutons** : `#7E9F78` (vert olive)
- **Icônes** : `#7E9F78` (vert olive)
- **Liens** : `#ef7b45` (orange)
- **Bordures** : `#7E9F78` (vert olive)

## Architecture

### Navigation

L'application utilise Expo Router pour une navigation file-based :
- Routes définies dans le dossier `app/`
- Navigation par onglets dans `app/(tabs)/`
- Routes dynamiques avec `[id].tsx`

### Gestion d'état

- **Custom hooks** pour la logique métier
- **React hooks** (useState, useEffect) pour l'état local
- Pas de bibliothèque de gestion d'état globale pour le moment

### Services API

Les services dans `services/` gèrent les appels API :
- `roomService.ts` : CRUD pour les salles
- Configuration centralisée dans `constants/config.ts`

## Fonctionnalités détaillées

### Écran d'accueil

- Liste de toutes les salles avec cartes visuelles
- Barre de recherche pour filtrer par nom ou description
- Bouton "Ajouter" pour créer une nouvelle salle
- Layout responsive (grille 3 colonnes sur desktop)
- Indicateur de disponibilité des salles

### Détail d'une salle

- En-tête avec couleur de la salle
- Affichage des dernières données de capteurs en temps réel
- Liste des équipements
- Liste des commodités
- Statut de disponibilité
- Boutons d'édition et suppression
- Bouton de réservation (si disponible)

### Gestion des salles

- Modal de création/édition
- Sélection des types de capteurs
- Validation des champs requis
- Confirmation avant suppression

## Développement

### Commandes utiles

```bash
# Linter
npm run lint

# Reset du projet
npm run reset-project
```

### Ajout de nouveaux composants

1. Créer le composant dans le dossier approprié (`atoms/`, `molecules/`, `organisms/`)
2. Utiliser TypeScript pour le typage
3. Utiliser les couleurs du thème avec `useThemeColor`
4. Exporter depuis `components/index.ts` si nécessaire

### Bonnes pratiques

- **Pas de bibliothèques web-only** : N'utilisez pas Radix UI, Headless UI ou autres bibliothèques spécifiques au web
- **Thème** : Toujours utiliser les couleurs du thème via `useThemeColor`
- **Alias de chemin** : Utiliser `@/` pour les imports
- **TypeScript** : Typer toutes les props et fonctions
- **Responsive** : Utiliser `useWindowDimensions` et le breakpoint 768px

## Connexion au Backend

L'application se connecte à l'API Neutria Backend. Assurez-vous que :
1. Le backend est démarré et accessible
2. L'URL de l'API est correctement configurée dans `constants/config.ts`
3. CORS est configuré sur le backend pour autoriser l'application

Endpoints utilisés :
- `GET /api/rooms` - Liste des salles
- `GET /api/rooms/{id}` - Détail d'une salle
- `GET /api/rooms/{id}/last` - Salle avec dernières captures
- `POST /api/rooms` - Création d'une salle
- `PUT /api/rooms/{id}` - Modification d'une salle
- `DELETE /api/rooms/{id}` - Suppression d'une salle
- `GET /api/capture_types` - Types de capteurs

## Build pour production

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

### Web

```bash
npx expo export:web
```

## Compatibilité

- **iOS** : iOS 13.4+
- **Android** : Android 5.0+ (API 21+)
- **Web** : Navigateurs modernes (Chrome, Firefox, Safari, Edge)

## Dépannage

### Problèmes de connexion API

```bash
# Vérifier l'URL de l'API dans constants/config.ts
# Vérifier que le backend est démarré
# Vérifier la configuration CORS du backend
```

### Problèmes de build

```bash
# Nettoyer le cache
npx expo start -c

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## Contribution

1. Fork le dépôt
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence GNU General Public License v3.0 (GPL-3.0).

## Auteurs

- Projet maintenu par l'équipe Neutria

## Support

Pour les problèmes, questions ou contributions, utilisez le système d'issues GitHub.
