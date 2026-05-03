# Changelog

## [Unreleased] - 2026-05-03

### Fixed
- **Critical**: Added missing `useEffect` import in `app/tracking/page.tsx` that would cause runtime crash
- **Security**: Moved hardcoded Mapbox token to environment variables (`NEXT_PUBLIC_MAPBOX_TOKEN`)
- **Memory Leak**: Fixed MutationObserver cleanup in `dashboard-layout.tsx` to prevent memory leaks
- **Bug**: Improved cost comparison parsing in `app/compare/page.tsx` to handle edge cases with currency formatting

### Added
- Environment variable configuration with `.env.example` template
- `.env.local` file for local development (gitignored)
- Error handling for missing Mapbox token with helpful console message

### Changed
- Refactored route comparison logic to be more robust with fallback values
- Improved MutationObserver implementation to check for sidebar existence before observing

### Security
- Removed hardcoded API tokens from client-side code
- Added environment variable validation for Mapbox integration
