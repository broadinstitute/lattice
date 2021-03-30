## iCoMut v2

### Getting Started
```
npm install
```

### Running Local Server

```
npm run serve
```
This will start the webpack web server locally and the app will run at http://localhost:3001 (as specified in webpack.dev.config.js). The hot-reload has been enabled, so the app will automatically re-run in a web browser when a relevant file change as been detected by the web server. Please note that the hot reload does not actually save an actual bundled and minified library. To bundle the library for production, see the next section.
### Building for Production
```
npm run build
```
This will save the bundled and minified library in the designated location as specified in the webpack.config.js file.
### Additional Notes
1. The `package.json` file in this directory only contains dependencies needed for development.
2. Any dependencies necessary for the visualization itself should be installed at the main directory level (i.e. `pattern-viz`).
