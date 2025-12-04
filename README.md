# frontend-frutech

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Start Backend API Server (Required)

**IMPORTANT:** Before running the frontend, you must start the backend server in a separate terminal:

```sh
npm run server
```

This will start the JSON server on `http://localhost:3000` with the mock API endpoints.

### Compile and Hot-Reload for Development

In a **separate terminal**, run:

```sh
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Compile and Minify for Production

```sh
npm run build
```
