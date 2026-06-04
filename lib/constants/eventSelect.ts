export const EVENT_SELECT = `
  *,
  event_users (
    user:users (
      id,
      name,
      username
    )
  ),
  location:locations (
    id,
    name,
    map_url,
    official_url
  ),
  created_by_user:users!events_created_by_fkey (
    id,
    name,
    username
  ),
  booked_by_user:users!events_booked_by_fkey (
    id,
    name,
    username
  )
`;
