### 2.6.4 - [2026-07-01]

### Fixed

- Removed sensitive door access code from event notes in mock data to prevent accidental exposure of credentials
- Corrected mock event date generation and updated event timestamps for consistency across seeded data

## 2.6.3 - [2026-06-29]

### Improvements
- Adde spacing between emoji, title, and message content in activity reminder notifications
- Updated mock user names and usernames in guest mode

## 2.6.2 - [2026-06-18]

### Added

- Event delete comfirmation

## 2.6.1 - [2026-06-18]

### Fixed

- Removed default notes under guest mode

## 2.6.0 - [2026-06-18]

### Added

- Guest mode with mock data
- Group Notification Notice
- User Profile
- Logout function

## 2.5.1 - [2026-06-08]

### Fixes

- Standardized error handling across the app by introducing `getErrorMessage` utility to safely handle unknown errors
- Replaced manual event filtering logic with `upcoming_events` database view for consistent and centralized event querying

## 2.5.0 - [2026-06-08]

### Style

- Updated global background color to a softer tone for improved UI consistency

### Fixed

- Resolved iOS `datetime-local` input overflow issue by overriding WebKit appearance behavior

### Refactor

- Adjusted Next.js client/server component boundaries to align with App Router architecture

## 2.4.0 - [2026-06-08]

### Added

- Added same-day (0-day) reminder notification for events occurring on the current day.

### Fixed

- Fixed incorrect reminder timing where 3-day reminders were triggered one day early due to flawed day difference calculation.
- Prevented off-by-one errors caused by strict diffDays === N comparison logic.

### Improvements

- Replaced exact day-difference matching with date range window logic for more reliable scheduling.
- Improved reminder accuracy across timezone and execution timing edge cases.
- Enhanced robustness of reminder system against cron delay and boundary timing issues.

## 2.3.0 - [2026-06-05]

### Added

- Introduced new Alert component for displaying user notifications and system messages.

### Fixes

- Updated events query to use upcoming_events table instead of events.
- Filtered out expired events using event_end timestamp.
- Adjusted sorting to display upcoming events in ascending chronological order.

## 2.2.0 - [2026-06-05]

### Added

- Introduced a complete toast notification system, including a Toast Provider, Toast Container, and useToast hook for global usage across the app.

## 2.1.0 - [2026-06-05]

### Changes

- Installed next-themes
- Added ThemeProvider to Next.js app
- Enabled system theme detection
- Added DARD theme

## 2.0.1 - [2026-06-04]

### Fixes

- Improved the Footer layout
- Prevent page scrolling to the top with location link click

## 2.0.0 - [2026-06-04]

### BREAK CHANGES

- Added a LINE Bot feature to send reminder events to LINE group users prior to scheduled events.

### Changes / Refactor

- Refactored event selection to use an independent constant
- Added an underline styling to the location link
- Added ngrok setup to the project.

### Fixes

- Fixed an issue causing an undefined value in events

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
