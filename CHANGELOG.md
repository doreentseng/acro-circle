## 1.1.2 - [2026-06-04]

### Fixes

- Fixed location model under the faded layer when clicking the location link of past event

### Refactor

- Added LocationLink component

## 1.1.1 - [2026-06-04]

### Fixes

- Resolved React rendering error caused by using `Date.now()` inside render phase
- Replaced impure time access with a stable time source to ensure deterministic rendering
- Fixed event sorting instability caused by non-deterministic time calculations

## 1.1.0 - [2026-06-04]

### Fixes

- Added missing objects in `event.location`
- Set correct default form value to create event form

### Refactor

- Extracted create event section into a standalone component for better maintainability

### UI Improvements

- Improved responsive layout behavior
- Adjusted badge positioning to prevent overlap on mobile screens
- Optimized layout switching between desktop and mobile views
- Prevented native dark theme

### Notes

- No functional or API changes
- UI behavior remains consistent across devices with improved responsiveness

## 1.0.0 - [2026-06-03]

- Initial
