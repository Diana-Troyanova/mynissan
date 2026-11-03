// MyNissan: приём push-уведомлений от мостика. Страницы не кэшируются — только уведомления.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { b: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.t || "MyNissan", {
    body: d.b || "",
    icon: "icon-192.png",
    badge: "badge-96.png",
    tag: d.tag || undefined,
    data: { u: d.u || "./" }
  }));
});

// нажали на уведомление — открываем приложение (или переключаемся на уже открытое)
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.u) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const w of list) if (w.url.startsWith(self.registration.scope) && "focus" in w) return w.focus();
    return self.clients.openWindow(url);
  }));
});
