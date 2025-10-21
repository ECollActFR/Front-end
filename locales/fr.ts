export const fr = {
  // Navigation
  nav: {
    home: 'Accueil',
    settings: 'Paramètres',
  },

  // Home screen
  home: {
    title: 'ECollAct',
    subtitle: 'Choisissez votre salle',
    addButton: '+ Ajouter',
    searchPlaceholder: 'Rechercher une salle...',
    noRooms: 'Aucune salle trouvée',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
  },

  // Add room modal
  addRoom: {
    title: 'Ajouter une salle',
    nameLabel: 'Nom de la salle',
    namePlaceholder: 'Ex: Salle de réunion A',
    nameRequired: 'Le nom de la salle est requis',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Description de la salle...',
    cancel: 'Annuler',
    create: 'Créer',
    creating: 'Création...',
    success: 'La salle a été créée avec succès',
    error: 'Une erreur est survenue lors de la création',
  },

  // Room details
  room: {
    back: 'Retour',
    delete: 'Supprimer',
    edit: 'Modifier',
    realTimeData: 'Données en temps réel',
    equipment: 'Équipements',
    amenities: 'Commodités',
    noData: 'Aucune donnée disponible',
  },

  // Edit room modal
  editRoom: {
    title: 'Modifier la salle',
    nameLabel: 'Nom de la salle',
    namePlaceholder: 'Entrez le nom de la salle',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Entrez une description',
    sensorTypesLabel: 'Types de capteurs',
    amenitiesLabel: 'Commodités',
    cancel: 'Annuler',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    success: 'La salle a été modifiée avec succès',
    error: 'Une erreur est survenue lors de la modification',
  },

  // Delete confirmation
  deleteConfirm: {
    title: 'Confirmer la suppression',
    message: 'Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.',
    cancel: 'Annuler',
    confirm: 'Supprimer',
    success: 'La salle a été supprimée avec succès',
    error: 'Une erreur est survenue lors de la suppression',
  },

  // Settings screen
  settings: {
    title: 'Paramètres',
    subtitle: 'Personnalisez votre expérience',

    // Appearance section
    appearance: 'Apparence',
    themeAuto: 'Automatique',
    themeAutoDesc: 'Suit le thème du système',
    themeLight: 'Clair',
    themeLightDesc: 'Toujours en mode clair',
    themeDark: 'Sombre',
    themeDarkDesc: 'Toujours en mode sombre',
    currentTheme: 'Thème actuel',
    themePreviewTitle: 'Aperçu du thème',
    primaryText: 'Texte principal',
    secondaryText: 'Texte secondaire',
    accent: 'Accent',

    // Language section
    language: 'Langue',
    languageFr: 'Français',
    languageFrDesc: 'Interface en français',
    languageEn: 'English',
    languageEnDesc: 'Interface in English',
    currentLanguage: 'Langue actuelle',

    // About section
    about: 'À propos',
    appName: 'Application',
    appNameValue: 'ECollAct',
    version: 'Version',
    versionValue: '1.0.0',
  },

  // Amenities
  amenities: {
    wifi: 'WiFi',
    projector: 'Projecteur',
    whiteboard: 'Tableau blanc',
    videoConference: 'Visioconférence',
    airConditioning: 'Climatisation',
    coffee: 'Café',
  },

  // Sensor card
  sensor: {
    invalidDate: 'Date invalide',
    inTheFuture: 'Dans le futur',
    justNow: "À l'instant",
    minutesAgo: 'Il y a {{count}} min',
    hoursAgo: 'Il y a {{count}} h',
    daysAgo: 'Il y a {{count}} j',
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    close: 'Fermer',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
  },

  // Theme names
  theme: {
    light: 'Clair',
    dark: 'Sombre',
  },
};

export type TranslationKeys = typeof fr;
