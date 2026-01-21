const sessions = new Map();

export function setSession(userId, data) {
  sessions.set(userId, data);
  setTimeout(() => sessions.delete(userId), 60_000); // 1 Minute
}

export function getSession(userId) {
  return sessions.get(userId);
}

export function clearSession(userId) {
  sessions.delete(userId);
}
