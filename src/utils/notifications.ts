// Push Notifications & Offline Sync Manager

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('GoTeam PWA Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.log('Service Worker registration skipped or failed:', err);
        });
    });
  }
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendLocalPushNotification(
        'GoTeam Running Notificações Ativadas! 🏃💨',
        'Você receberá lembretes de treinos, metas semanais da equipe e alertas de ritmo.'
      );
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Notification permission error:', err);
    return false;
  }
};

export const sendLocalPushNotification = (title: string, body: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Try service worker registration first
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg'
      });
    }).catch(() => {
      // Fallback
      new Notification(title, { body, icon: '/favicon.svg' });
    });
  } else {
    try {
      new Notification(title, { body, icon: '/favicon.svg' });
    } catch (e) {
      console.warn('Direct notification error:', e);
    }
  }
};

export const showLocalNotification = (title: string, options?: { body?: string }) => {
  sendLocalPushNotification(title, options?.body || '');
};

// Offline sync queue in localStorage
const OFFLINE_QUEUE_KEY = 'goteam_offline_queue_v1';

export interface QueuedActivity {
  id: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export const getOfflineQueue = (): QueuedActivity[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addToOfflineQueue = (data: Record<string, unknown>) => {
  try {
    const queue = getOfflineQueue();
    const item: QueuedActivity = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      data,
      timestamp: Date.now()
    };
    queue.push(item);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    return item;
  } catch (e) {
    console.error('Failed to store in offline queue:', e);
  }
};

export const saveOfflineItem = (type: string, data: Record<string, unknown>) => {
  addToOfflineQueue({ type, ...data });
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
};
