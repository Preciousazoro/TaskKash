// Simple in-memory cache for profile data (5 minutes TTL)
const profileCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getProfileCache(userId: string) {
  const cached = profileCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

export function setProfileCache(userId: string, data: any) {
  profileCache.set(userId, { data, timestamp: Date.now() });
}

export function clearProfileCache(userId: string) {
  profileCache.delete(userId);
}
