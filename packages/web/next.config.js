const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa')({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});

const withTM = require('next-transpile-modules')(['@frontend/shared', '@frontend/ckeditor']);

module.exports = withPlugins([withPWA, withTM, withImages]);
