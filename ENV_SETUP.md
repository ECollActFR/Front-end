# Configuration des Environnements

Ce projet utilise des fichiers d'environnement pour gérer les différentes configurations (développement, production).

## 📁 Fichiers d'environnement

- `.env.development` - Configuration pour le développement (API locale)
- `.env.production` - Configuration pour la production (API de prod)
- `.env` - Fichier actif (créé automatiquement, **ne pas committer**)

## 🚀 Utilisation

### Développement (recommandé)

Pour développer avec l'API locale :

```bash
npm run start:dev
# ou pour Android
npm run android:dev
# ou pour iOS
npm run ios:dev
```

### Production

Pour tester avec l'API de production :

```bash
npm run start:prod
# ou pour Android
npm run android:prod
# ou pour iOS
npm run ios:prod
```

### Par défaut

Si vous lancez simplement `npm start` ou `expo start`, le fichier `.env` sera utilisé (qui contient par défaut la config de développement).

## 🔄 Problème de cache Expo Go

Si après avoir changé d'environnement, l'ancienne API est toujours utilisée :

1. **Arrêtez complètement Expo** (Ctrl+C dans le terminal)
2. **Videz le cache** :
   ```bash
   npm run start:dev -- --clear
   ```
3. **Rechargez l'app** dans Expo Go

## 🔧 Configuration Android locale

Pour Android, l'URL `http://localhost:8000/api` est automatiquement convertie en `http://10.0.2.2:8000/api` (l'émulateur Android utilise 10.0.2.2 pour accéder à localhost de votre PC).

### Pour tester sur un téléphone physique

Si vous testez sur un téléphone physique (pas l'émulateur), modifiez `.env.development` :

```bash
# Trouvez votre IP locale
hostname -I  # Linux/Mac
# ou
ipconfig     # Windows

# Puis modifiez .env.development
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:8000/api
```

## 📝 Variables disponibles

- `EXPO_PUBLIC_API_BASE_URL` - URL de base de l'API
- `EXPO_PUBLIC_API_TIMEOUT` - Timeout des requêtes en millisecondes

## ⚠️ Important

- Le fichier `.env` est **ignoré par git** (dans `.gitignore`)
- Les fichiers `.env.development` et `.env.production` sont aussi **ignorés par git**
- Pour une nouvelle installation, copiez `.env.example` vers `.env` ou utilisez les scripts npm
