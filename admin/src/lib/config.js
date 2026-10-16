// Backend origin. Overridable via REACT_APP_SITE_URL for local development.
// Defaults to production so behaviour is unchanged when the variable is unset.
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://kitobplus.uz';
