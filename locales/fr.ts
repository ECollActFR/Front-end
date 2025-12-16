export const fr = {
  // Navigation
  nav: {
    home: 'Accueil',
    settings: 'Paramètres',
    user: 'Utilisateur',
    acquisitionSystems: 'Systèmes',
    admin: 'Administration',
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

  user: {
    title: 'Mon Profil',
    subtitle: 'Vos informations personnelles',
    loading: 'Chargement...',
    error: 'Erreur lors du chargement',
    retry: 'Réessayer',
    username: 'Nom d\'utilisateur',
    email: 'Email',
    roles: 'Rôles',
    createdAt: 'Créé le',
    editProfile: 'Modifier le profil',
    logout: 'Se déconnecter',
    loggingOut: 'Déconnexion...',
    logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },

  // Add room modal
  addRoom: {
    title: 'Ajouter une salle',
    nameLabel: 'Nom de la salle',
    namePlaceholder: 'Ex: Salle de réunion A',
    nameRequired: 'Le nom de la salle est requis',
    buildingLabel: 'Bâtiment',
    selectBuildingPlaceholder: 'Sélectionner un bâtiment',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Description de la salle...',
    sensorTypesLabel: 'Types de capteurs',
    acquisitionSystemLabel: 'Système d\'acquisition',
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
    acquisitionSystem: 'Système d\'acquisition',
    acquisitionSystemId: 'ID du système',
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
    acquisitionSystemLabel: 'Système d\'acquisition',
    acquisitionSystemPlaceholder: 'Sélectionnez un système d\'acquisition',
    noAcquisitionSystem: 'Aucun système d\'acquisition',
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

    // User Section
    user: 'Utilisateur',
    email: 'Adresse mail',


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

  // Acquisition Systems
  acquisitionSystems: {
    title: 'Systèmes d\'acquisition',
    subtitle: 'Gérez vos ESP32',
    searchPlaceholder: 'Rechercher un système...',
    noSystems: 'Aucun système trouvé',
    error: 'Erreur lors du chargement des systèmes',
    activeSensors: 'capteurs actifs',
    enabledTasks: 'tâches actives',
    statusActive: 'Actif',
    statusInactive: 'Inactif',
    statusError: 'Erreur',
  },

  // Acquisition System Detail
  acquisitionSystemDetail: {
    generalInfo: 'Informations générales',
    networkConfig: 'Configuration réseau',
    sensors: 'Capteurs',
    tasks: 'Tâches',
    systemConfig: 'Configuration système',
    deviceType: 'Type d\'appareil',
    firmware: 'Version firmware',
    createdAt: 'Créé le',
    wifiSsid: 'WiFi SSID',
    ntpServer: 'Serveur NTP',
    timezone: 'Fuseau horaire',
    gmtOffset: 'Décalage GMT',
    daylightOffset: 'Décalage heure d\'été',
    sensorType: 'Type de capteur',
    enabled: 'Activé',
    readInterval: 'Intervalle de lecture',
    taskName: 'Nom de la tâche',
    interval: 'Intervalle',
    priority: 'Priorité',
    taskConfig: 'Configuration',
    debugMode: 'Mode debug',
    bufferSize: 'Taille du buffer',
    deepSleep: 'Deep sleep',
    webServer: 'Serveur web',
    webServerPort: 'Port serveur web',
  },

  // Edit Acquisition System
  editAcquisitionSystem: {
    title: 'Modifier le système',
    cancel: 'Annuler',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    success: 'Le système a été modifié avec succès',
    error: 'Une erreur est survenue lors de la modification',
    
    // General Information
    generalInfo: 'Informations générales',
    name: 'Nom',
    namePlaceholder: 'Nom du système',
    deviceType: 'Type d\'appareil',
    deviceTypePlaceholder: 'Type d\'appareil',
    firmwareVersion: 'Version firmware',
    systemStatus: 'Statut système',
    
    // Network Configuration
    networkConfig: 'Configuration réseau',
    wifiSsid: 'WiFi SSID',
    ntpServer: 'Serveur NTP',
    timezone: 'Fuseau horaire',
    gmtOffset: 'Décalage GMT (s)',
    daylightOffset: 'Décalage heure d\'été (s)',
    
    // System Configuration
    systemConfig: 'Configuration système',
    debugMode: 'Mode debug',
    bufferSize: 'Taille du buffer',
    deepSleep: 'Deep sleep',
    webServer: 'Serveur web',
    webServerPort: 'Port serveur web',
    
    // Sensors
    sensors: 'Capteurs',
    sensor: 'Capteur',
    sensorType: 'Type',
    enabled: 'Activé',
    readInterval: 'Intervalle (ms)',
    addSensor: 'Ajouter un capteur',
    
    // Tasks
    tasks: 'Tâches',
    task: 'Tâche',
    taskName: 'Nom',
    interval: 'Intervalle (ms)',
    priority: 'Priorité',
    addTask: 'Ajouter une tâche',
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

  // Admin
  admin: {
    title: 'Administration',
    clientAccounts: 'Comptes Clients',
    addClientAccount: 'Ajouter un compte',
    editClientAccount: 'Modifier le compte',
    deleteClientAccount: 'Supprimer le compte',
    companyName: 'Nom de l\'entreprise',
    siret: 'SIRET',
    address: 'Adresse',
    city: 'Ville',
    postalCode: 'Code postal',
    country: 'Pays',
    phone: 'Téléphone',
    contactEmail: 'Email de contact',
    isActive: 'Compte actif',
    active: 'Actif',
    inactive: 'Inactif',
    users: 'Utilisateurs',
    addUser: 'Ajouter un utilisateur',
    editUser: 'Modifier l\'utilisateur',
    deleteUser: 'Supprimer l\'utilisateur',
    viewUsers: 'Voir les utilisateurs',
    backToAccounts: 'Retour aux comptes',
    noClientAccounts: 'Aucun compte client trouvé',
    noUsers: 'Aucun utilisateur trouvé',
    loadingMore: 'Chargement...',
    searchPlaceholder: 'Rechercher un compte client...',
    searchUsersPlaceholder: 'Rechercher un utilisateur...',
    createdAt: 'Créé le',
    userCount: '{{count}} utilisateur',
    userCount_plural: '{{count}} utilisateurs',
    confirmDeleteClient: 'Êtes-vous sûr de vouloir supprimer ce compte client ? Cette action est irréversible et supprimera également tous les utilisateurs associés.',
    confirmDeleteUser: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
    clientAccountCreated: 'Le compte client a été créé avec succès',
    clientAccountUpdated: 'Le compte client a été modifié avec succès',
    clientAccountDeleted: 'Le compte client a été supprimé avec succès',
    userCreated: 'L\'utilisateur a été créé avec succès',
    userUpdated: 'L\'utilisateur a été modifié avec succès',
    userDeleted: 'L\'utilisateur a été supprimé avec succès',
  },

  // Theme names
  theme: {
    light: 'Clair',
    dark: 'Sombre',
  },
};

export type TranslationKeys = typeof fr;
