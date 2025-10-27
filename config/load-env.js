/**
 * Environment loader for Expo
 * Loads the correct .env file based on ENV variable
 * Falls back to .env if .env.{ENV} is not found
 */

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Determine which environment to load
const ENV = process.env.ENV || 'development';

// Path to the environment file
const envPath = path.resolve(__dirname, `../.env.${ENV}`);
const fallbackPath = path.resolve(__dirname, '../.env');

let result;

// Try to load .env.{ENV} first
if (fs.existsSync(envPath)) {
  console.log(`\n🔧 Loading environment from: .env.${ENV}\n`);
  result = dotenv.config({ path: envPath });

  if (!result.error) {
    console.log('✅ Environment variables loaded successfully');
    console.log(`   API URL: ${process.env.EXPO_PUBLIC_API_BASE_URL || 'not set'}\n`);
  }
} else if (fs.existsSync(fallbackPath)) {
  // Fallback to .env if .env.{ENV} doesn't exist
  console.log(`\n🔧 .env.${ENV} not found, loading from: .env\n`);
  result = dotenv.config({ path: fallbackPath });

  if (!result.error) {
    console.log('✅ Environment variables loaded successfully (from .env)');
    console.log(`   API URL: ${process.env.EXPO_PUBLIC_API_BASE_URL || 'not set'}\n`);
  }
} else {
  console.warn(`\n⚠️  Warning: No environment file found (.env.${ENV} or .env)`);
  console.warn('   Using default environment variables\n');
  result = { error: new Error('No env file found') };
}

module.exports = result;
