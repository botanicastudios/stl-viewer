# STL Viewer Web Component

A simple and lightweight STL file viewer web component built with Three.js and bundled with Vite.

## Installation

### NPM

```bash
# Install from npm
npm install @botanicastudios/stl-viewer

# Or include directly from jsDelivr
<script src="https://cdn.jsdelivr.net/npm/@botanicastudios/stl-viewer@1.0.0/dist/stl-viewer.umd.cjs"></script>
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

After installing, include the script in your HTML and use the custom element:

### Using NPM package

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
    <!-- Use the component with a path to your STL file -->
    <stl-viewer
      model="path/to/your/model.stl"
      autorotate="initial"
    ></stl-viewer>

    <!-- Include the bundled script from your node_modules -->
    <script src="node_modules/@botanicastudios/stl-viewer/dist/stl-viewer.umd.cjs"></script>
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
  </head>
  <body>
    <!-- Use the component with a path to your STL file -->
    <stl-viewer
      model="path/to/your/model.stl"
      autorotate="initial"
    ></stl-viewer>

    <!-- Include directly from jsDelivr -->
    <script src="https://cdn.jsdelivr.net/npm/@botanicastudios/stl-viewer@1.0.0/dist/stl-viewer.umd.cjs"></script>
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
- Responsive design
- Uses web components for encapsulation
