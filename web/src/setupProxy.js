// Только для `npm start`: скрипты DRM (/js/drm/*) лежат на backend, а не в web/public.
// В production сайт и backend на одном сервере, этот файл не используется.
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = process.env.REACT_APP_SITE_URL;
  if (!target) return;
  // Форма с фильтром пути: при app.use("/js", …) express отрезал бы /js из адреса.
  app.use(createProxyMiddleware("/js/drm", { target, changeOrigin: true }));
};
