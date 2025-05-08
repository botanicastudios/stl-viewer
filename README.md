# STL Viewer Web Component

A simple and lightweight STL file viewer web component built with Three.js and bundled with Vite.

## Installation

### NPM

```bash
# Install from npm
npm install @botanicastudios/stl-viewer

# Or include directly from jsDelivr
<script src="https://cdn.jsdelivr.net/npm/@botanicastudios/stl-viewer@0.0.1/dist/stl-viewer.iife.js"></script>
```

For development:

```bash
# Clone repository and install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

After installing, include the script in your HTML and use the custom element. There are two ways to use this component:

### 1. Using the IIFE Build (Auto-Registration)

This approach automatically registers the custom element, making it simpler to use:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      stl-viewer {
        width: 500px;
        height: 500px;
        display: block;
      }
    </style>
    <!-- Include the IIFE build which auto-registers the component -->
    <script src="node_modules/@botanicastudios/stl-viewer/dist/stl-viewer.iife.js"></script>
  </head>
  <body>
    <!-- Use the component with a path to your STL file -->
    <stl-viewer
      model="path/to/your/model.stl"
      autorotate="initial"
    ></stl-viewer>
  </body>
</html>
```

### 2. Using ES Module Build (Manual Registration)

This approach gives you more control and is better for modern build systems:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      stl-viewer {
        width: 500px;
        height: 500px;
        display: block;
      }
    </style>
  </head>
  <body>
    <!-- Create a container for the viewer -->
    <div id="stl-container"></div>

    <!-- Import as an ES module -->
    <script type="module">
      import { STLViewer } from "./node_modules/@botanicastudios/stl-viewer/dist/stl-viewer.js";

      // Register the element if not already registered
      if (!customElements.get("stl-viewer")) {
        customElements.define("stl-viewer", STLViewer);
      }

      // Create and use the element
      const viewer = document.createElement("stl-viewer");
      viewer.setAttribute("model", "path/to/your/model.stl");
      viewer.setAttribute("autorotate", "initial");
      viewer.style.width = "100%";
      viewer.style.height = "100%";
      document.getElementById("stl-container").appendChild(viewer);
    </script>
  </body>
</html>
```

### Using jsDelivr CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      stl-viewer {
        width: 500px;
        height: 500px;
        display: block;
      }
    </style>
    <!-- Include the IIFE version from jsDelivr -->
    <script src="https://cdn.jsdelivr.net/npm/@botanicastudios/stl-viewer@0.0.1/dist/stl-viewer.iife.js"></script>
  </head>
  <body>
    <!-- Use the component with a path to your STL file -->
    <stl-viewer
      model="path/to/your/model.stl"
      autorotate="initial"
    ></stl-viewer>
  </body>
</html>
```

## Attributes

- `model`: (Required) Path to the STL file to display.
- `autorotate`: (Optional) Enable auto-rotation of the model. Options:
  - `autorotate` or `autorotate="1"`: Always rotate the model
  - `autorotate="2"` (or any number): Rotate at specified speed
  - `autorotate="initial"`: Rotate until the user interacts with the model

## Features

- Renders STL files in 3D
- Orbit controls for rotating and zooming
- Auto-rotates the model
- Loading indicator while model downloads
- Responsive design
- Uses web components for encapsulation
- Safe for multiple script loads on the same page
