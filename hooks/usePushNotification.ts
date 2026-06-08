import { useEffect } from 'react';
import { savePushSubscription, removePushSubscription } from 'service/api/notification';
import LocalStorage from 'public/utils/Localstorage';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export const usePushNotification = () => {
  useEffect(() => {
    const token = LocalStorage.getItem('LogmeToken');
    if (!token) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const setup = async () => {
      try {
        // Service Worker 등록
        const registration = await navigator.serviceWorker.register('/sw.js');

        // 이미 구독 중이면 스킵
        const existing = await registration.pushManager.getSubscription();
        if (existing) return;

        // 권한 요청 — 거부해도 앱은 30초 폴링으로 정상 동작
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Push 구독
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // 서버에 구독 저장
        await savePushSubscription(subscription);
      } catch (err) {
        console.warn('Push 구독 설정 실패 (폴링으로 폴백):', err);
      }
    };

    setup();

    // 로그아웃 시 구독 해제
    return () => {
      navigator.serviceWorker.getRegistration('/sw.js').then(async (reg) => {
        if (!reg) return;
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return;
        await removePushSubscription(sub.endpoint).catch(() => {});
        await sub.unsubscribe().catch(() => {});
      });
    };
  }, []);
};
