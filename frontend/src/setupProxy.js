const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://stunning-fishstick-9qqgjp5wrg9hp447-8080.app.github.dev',
      changeOrigin: true,
      secure: false,
    })
  );
};
