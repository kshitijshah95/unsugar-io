/**
 * Feature Flags Configuration
 * Central place to enable/disable features
 */

export interface FeatureFlags {
  enableGoogleSSO: boolean;
  enableGitHubSSO: boolean;
  enableAppleSSO: boolean;
  enableEmailAuth: boolean;
  enableBlogTracking: boolean;
  enableProfileEditing: boolean;
}

/**
 * Feature flags - toggle features on/off
 * Set to false to disable a feature
 */
export const features: FeatureFlags = {
  // SSO Authentication (DISABLED)
  enableGoogleSSO: false,
  enableGitHubSSO: false,
  enableAppleSSO: false,
  
  // Email/Password Authentication (ENABLED)
  enableEmailAuth: true,
  
  // Blog Features
  enableBlogTracking: true,
  
  // User Profile
  enableProfileEditing: true,
};

/**
 * Helper function to check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return features[feature];
};

/**
 * Check if any SSO provider is enabled
 */
export const isAnySSOEnabled = (): boolean => {
  return features.enableGoogleSSO || features.enableGitHubSSO || features.enableAppleSSO;
};

export default features;
