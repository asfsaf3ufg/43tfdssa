const sessions = new Map();

export function setSession(userId, data) {
  sessions.set(userId, data);
  setTimeout(() => sessions.delete(userId), 24*60*60*1000); // Session 24h gültig
}

export function getSession(userId) {
  return sessions.get(userId);
}

export function clearSession(userId) {
  sessions.delete(userId);
}
