// lib/deviceId.js
export function getOrCreateDeviceId() {
  if (typeof window === 'undefined') return null;
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}
