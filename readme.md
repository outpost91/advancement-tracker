# Ranger Tracker App

The Royal Ranger Tracker App is a PWA that will track Rangers merits and advancements using firebase as the backend and stencil on the fron end.

## Features Included in the Ranger Tracker PWA

- Stencil for easily building and loading standardized Web Components
- Ionic Framework
- Routing
- Push Notifications setup
- Unit Tests
- Pre-rendering
- zero config lazy loading
- zero config code splitting
- Polyfills selectively loaded depending on the browser support
- ES6 by default for new browsers, ES5 for older browsers
- Everything needed for an add to homescreen PWA (service worker, web manifest and iOS meta tags)

## Getting Started

To start building a Royal Ranger Tracker PWA, clone this repo to a new directory:

```bash
git clone https://github.com/outpost91/advancement-tracker.git my-pwa
cd my-pwa
git remote rm origin
```

and run:

```bash
npm install
npm start
```

## Production

To build your PWA for production, run:

```bash
npm run build
```
A production build includes everything needed for your project to be a PWA right out of the box. This includes both a Web Manifest (src/manifest.json) and a Service Worker (www/sw.js).


## Hosting

For top PWA performance, your app should be hosted with a hosting provider that supports HTTPS and HTTP2 out of the box.

Currently recommend [Firebase Hosting](https://firebase.google.com/docs/hosting/)

## Service Workers

For info on how Service Workers work in Stencil check out our [Service Worker docs](https://stenciljs.com/docs/service-workers).

## Developing with a Service Worker

In some cases, for instance when you are working on adding [web push notifications](https://developers.google.com/web/fundamentals/push-notifications/) or [background sync](https://developers.google.com/web/updates/2015/12/background-sync), both which require a Service Worker, it can be handy to be able to dev builds with a service worker.

To do this with the Advancement Tracker PWA simply run `npm run devWithSW`. This will start a dev build, but with the Service Worker also getting livereloaded.

## Unit Tests

To run the unit tests once, run:

```
npm test
```

To run the unit tests and watch for file changes during development, run:

```
npm run test.watch
```

## Testing your PWA's performance

We recommend using https://www.webpagetest.org/easy with the `Run Lighthouse Audit` option turned on. This will give you an in depth look into your PWAs load performance on the average device connected to the average network. For more info on how to use webpagetest check out https://zoompf.com/blog/2015/07/the-seo-experts-guide-to-web-performance-using-webpagetest-2.

## Why Advancement Tracker?

Creating a PWA for Advancement tracking will give you a quick turnaround for unique UI changes to fit your needs. 
