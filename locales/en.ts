import { TranslationKeys } from './fr';

export const en: TranslationKeys = {
  // Navigation
  nav: {
    home: 'Home',
    settings: 'Settings',
    user: 'User',
    acquisitionSystems: 'Systems',
    admin: 'Admin',
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

  // User screen
  user: {
    title: 'My Profile',
    subtitle: 'Your personal information',
    loading: 'Loading...',
    error: 'Error loading profile',
    retry: 'Retry',
    username: 'Username',
    email: 'Email',
    roles: 'Roles',
    createdAt: 'Created on',
    editProfile: 'Edit Profile',
    logout: 'Logout',
    loggingOut: 'Logging out...',
    logoutConfirm: 'Are you sure you want to logout?',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },

  // Add room modal
  addRoom: {
    title: 'Add a room',
    nameLabel: 'Room name',
    namePlaceholder: 'E.g.: Meeting room A',
    nameRequired: 'Room name is required',
    buildingLabel: 'Building',
    selectBuildingPlaceholder: 'Select a building',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Room description...',
    sensorTypesLabel: 'Sensor types',
    acquisitionSystemLabel: 'Acquisition system',
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
    acquisitionSystem: 'Acquisition System',
    acquisitionSystemId: 'System ID',
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
    acquisitionSystemLabel: 'Acquisition system',
    acquisitionSystemPlaceholder: 'Select an acquisition system',
    noAcquisitionSystem: 'No acquisition system',
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

    // User Section
    user: 'User',
    email: 'Email',

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

  // Acquisition Systems
  acquisitionSystems: {
    title: 'Acquisition Systems',
    subtitle: 'Manage your ESP32',
    searchPlaceholder: 'Search for a system...',
    noSystems: 'No systems found',
    error: 'Error loading systems',
    activeSensors: 'active sensors',
    enabledTasks: 'active tasks',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    statusError: 'Error',
  },

  // Acquisition System Detail
  acquisitionSystemDetail: {
    generalInfo: 'General Information',
    networkConfig: 'Network Configuration',
    sensors: 'Sensors',
    tasks: 'Tasks',
    systemConfig: 'System Configuration',
    deviceType: 'Device Type',
    firmware: 'Firmware Version',
    createdAt: 'Created At',
    wifiSsid: 'WiFi SSID',
    ntpServer: 'NTP Server',
    timezone: 'Timezone',
    gmtOffset: 'GMT Offset',
    daylightOffset: 'Daylight Offset',
    sensorType: 'Sensor Type',
    enabled: 'Enabled',
    readInterval: 'Read Interval',
    taskName: 'Task Name',
    interval: 'Interval',
    priority: 'Priority',
    taskConfig: 'Configuration',
    debugMode: 'Debug Mode',
    bufferSize: 'Buffer Size',
    deepSleep: 'Deep Sleep',
    webServer: 'Web Server',
    webServerPort: 'Web Server Port',
  },

  // Edit Acquisition System
  editAcquisitionSystem: {
    title: 'Edit System',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    success: 'System updated successfully',
    error: 'An error occurred while updating',
    
    // General Information
    generalInfo: 'General Information',
    name: 'Name',
    namePlaceholder: 'System name',
    deviceType: 'Device Type',
    deviceTypePlaceholder: 'Device type',
    firmwareVersion: 'Firmware Version',
    systemStatus: 'System Status',
    
    // Network Configuration
    networkConfig: 'Network Configuration',
    wifiSsid: 'WiFi SSID',
    ntpServer: 'NTP Server',
    timezone: 'Timezone',
    gmtOffset: 'GMT Offset (s)',
    daylightOffset: 'Daylight Offset (s)',
    
    // System Configuration
    systemConfig: 'System Configuration',
    debugMode: 'Debug Mode',
    bufferSize: 'Buffer Size',
    deepSleep: 'Deep Sleep',
    webServer: 'Web Server',
    webServerPort: 'Web Server Port',
    
    // Sensors
    sensors: 'Sensors',
    sensor: 'Sensor',
    sensorType: 'Type',
    enabled: 'Enabled',
    readInterval: 'Interval (ms)',
    addSensor: 'Add Sensor',
    
    // Tasks
    tasks: 'Tasks',
    task: 'Task',
    taskName: 'Name',
    interval: 'Interval (ms)',
    priority: 'Priority',
    addTask: 'Add Task',
  },

  // Admin screen
  admin: {
    title: 'Administration',
    clientAccounts: 'Client Accounts',
    addClientAccount: 'Add Client Account',
    editClientAccount: 'Edit Client Account',
    deleteClientAccount: 'Delete Client Account',
    companyName: 'Company Name',
    siret: 'SIRET',
    address: 'Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country',
    phone: 'Phone',
    contactEmail: 'Contact Email',
    isActive: 'Account active',
    active: 'Active',
    inactive: 'Inactive',
    users: 'Users',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    viewUsers: 'View Users',
    backToAccounts: 'Back to Accounts',
    noClientAccounts: 'No client accounts found',
    noUsers: 'No users found',
    loadingMore: 'Loading...',
    searchPlaceholder: 'Search for a client account...',
    searchUsersPlaceholder: 'Search for a user...',
    createdAt: 'Created on',
    userCount: '{{count}} user',
    userCount_plural: '{{count}} users',
    confirmDeleteClient: 'Are you sure you want to delete this client account? This action is irreversible and will also delete all associated users.',
    confirmDeleteUser: 'Are you sure you want to delete this user? This action is irreversible.',
    clientAccountCreated: 'Client account created successfully',
    clientAccountUpdated: 'Client account updated successfully',
    clientAccountDeleted: 'Client account deleted successfully',
    userCreated: 'User created successfully',
    userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully',
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
