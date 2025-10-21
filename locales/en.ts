import { TranslationKeys } from './fr';

export const en: TranslationKeys = {
  // Navigation
  nav: {
    home: 'Home',
    settings: 'Settings',
  },

  // Home screen
  home: {
    title: 'ECollAct',
    subtitle: 'Choose your room',
    addButton: '+ Add',
    searchPlaceholder: 'Search for a room...',
    noRooms: 'No rooms found',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
  },

  // Add room modal
  addRoom: {
    title: 'Add a room',
    nameLabel: 'Room name',
    namePlaceholder: 'E.g.: Meeting room A',
    nameRequired: 'Room name is required',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Room description...',
    cancel: 'Cancel',
    create: 'Create',
    creating: 'Creating...',
    success: 'Room created successfully',
    error: 'An error occurred during creation',
  },

  // Room details
  room: {
    back: 'Back',
    delete: 'Delete',
    edit: 'Edit',
    realTimeData: 'Real-time data',
    equipment: 'Equipment',
    amenities: 'Amenities',
    noData: 'No data available',
  },

  // Edit room modal
  editRoom: {
    title: 'Edit room',
    nameLabel: 'Room name',
    namePlaceholder: 'Enter room name',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Enter a description',
    sensorTypesLabel: 'Sensor types',
    amenitiesLabel: 'Amenities',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    success: 'Room updated successfully',
    error: 'An error occurred during update',
  },

  // Delete confirmation
  deleteConfirm: {
    title: 'Confirm deletion',
    message: 'Are you sure you want to delete this room? This action is irreversible.',
    cancel: 'Cancel',
    confirm: 'Delete',
    success: 'Room deleted successfully',
    error: 'An error occurred during deletion',
  },

  // Settings screen
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',

    // Appearance section
    appearance: 'Appearance',
    themeAuto: 'Automatic',
    themeAutoDesc: 'Follow system theme',
    themeLight: 'Light',
    themeLightDesc: 'Always in light mode',
    themeDark: 'Dark',
    themeDarkDesc: 'Always in dark mode',
    currentTheme: 'Current theme',
    themePreviewTitle: 'Theme preview',
    primaryText: 'Primary text',
    secondaryText: 'Secondary text',
    accent: 'Accent',

    // Language section
    language: 'Language',
    languageFr: 'Français',
    languageFrDesc: 'Interface en français',
    languageEn: 'English',
    languageEnDesc: 'Interface in English',
    currentLanguage: 'Current language',

    // About section
    about: 'About',
    appName: 'Application',
    appNameValue: 'ECollAct',
    version: 'Version',
    versionValue: '1.0.0',
  },

  // Amenities
  amenities: {
    wifi: 'WiFi',
    projector: 'Projector',
    whiteboard: 'Whiteboard',
    videoConference: 'Video conference',
    airConditioning: 'Air conditioning',
    coffee: 'Coffee',
  },

  // Sensor card
  sensor: {
    invalidDate: 'Invalid date',
    inTheFuture: 'In the future',
    justNow: 'Just now',
    minutesAgo: '{{count}} min ago',
    hoursAgo: '{{count}} h ago',
    daysAgo: '{{count}} d ago',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
  },

  // Theme names
  theme: {
    light: 'Light',
    dark: 'Dark',
  },
};
