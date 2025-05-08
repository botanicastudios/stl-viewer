// Import the necessary Three.js modules
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Define the component class
class STLViewer extends HTMLElement {
  constructor() {
    super();
    this.renderer = null;
    this.camera = null;
    this.resizeObserver = null;
  }

  connectedCallback() {
    this.connected = true;

    const shadowRoot = this.attachShadow({ mode: "open" });

    // Create container
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.position = "relative";

    // Create loading indicator
    const loadingContainer = document.createElement("div");
    loadingContainer.style.position = "absolute";
    loadingContainer.style.top = "0";
    loadingContainer.style.left = "0";
    loadingContainer.style.width = "100%";
    loadingContainer.style.height = "100%";
    loadingContainer.style.display = "flex";
    loadingContainer.style.justifyContent = "center";
    loadingContainer.style.alignItems = "center";
    loadingContainer.style.zIndex = "100";

    const spinner = document.createElement("div");
    spinner.style.width = "50px";
    spinner.style.height = "50px";
    spinner.style.border = "5px solid rgba(0, 0, 0, 0.1)";
    spinner.style.borderRadius = "50%";
    spinner.style.borderTop = "5px solid #000000";
    spinner.style.animation = "spin 1s linear infinite";

    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    loadingContainer.appendChild(spinner);
    shadowRoot.appendChild(styleElement);
    shadowRoot.appendChild(container);
    container.appendChild(loadingContainer);

    if (!this.hasAttribute("model")) {
      throw new Error("model attribute is required");
    }

    const model = this.getAttribute("model");

    this.camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight || 1,
      1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Initially set renderer size to avoid zero dimensions
    // We'll update this with the correct dimensions once we can measure the container
    this.renderer.setSize(100, 100);
    container.appendChild(this.renderer.domElement);

    // Create a ResizeObserver to detect container size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
      }
    });

    // Start observing the container
    this.resizeObserver.observe(container);

    // Also keep the window resize listener for backward compatibility
    window.addEventListener(
      "resize",
      () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          this.renderer.setSize(container.clientWidth, container.clientHeight);
          this.camera.aspect = container.clientWidth / container.clientHeight;
          this.camera.updateProjectionMatrix();
        }
      },
      false
    );

    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableZoom = true;
    let scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    // Show progress during loading
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, loaded, total) => {
      if (total > 0) {
        const percent = Math.round((loaded / total) * 100);
        spinner.textContent = `${percent}%`;
      }
    };

    // Hide loading indicator when done
    loadingManager.onLoad = () => {
      loadingContainer.style.display = "none";
    };

    // Show error if loading fails
    loadingManager.onError = (url) => {
      spinner.textContent = "Error loading model";
      spinner.style.animation = "none";
      spinner.style.border = "none";
      spinner.style.color = "red";
    };

    new STLLoader(loadingManager).load(model, (geometry) => {
      let material = new THREE.MeshPhongMaterial({
        color: 0xf5f5f5,
        specular: 100,
        shininess: 100,
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Center the model
      let middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(middle);
      mesh.geometry.applyMatrix4(
        new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
      );

      // Calculate bounding sphere and fit camera to view it
      geometry.computeBoundingSphere();
      const boundingSphere = geometry.boundingSphere;

      // Position camera to fit the entire model
      const fov = this.camera.fov * (Math.PI / 180);
      const distance = boundingSphere.radius / Math.sin(fov / 2);

      // Add some padding
      const padding = 1.2;
      this.camera.position.z = distance * padding;
      this.camera.lookAt(0, 0, 0);

      // Check if autorotate attribute exists
      if (this.hasAttribute("autorotate")) {
        controls.autoRotate = true;

        // Get rotation value
        const rotateValue = this.getAttribute("autorotate");

        // Check if it should only rotate initially
        const initialOnly = rotateValue === "initial";

        // Set rotation speed if a numeric value is provided
        if (rotateValue && !isNaN(parseFloat(rotateValue))) {
          controls.autoRotateSpeed = parseFloat(rotateValue);
        } else {
          controls.autoRotateSpeed = 1;
        }

        // Add event listener to stop rotation after user interaction if set to initial
        if (initialOnly) {
          // Listen for control events that indicate user interaction
          controls.addEventListener("start", () => {
            controls.autoRotate = false;
          });
        }
      } else {
        controls.autoRotate = false;
      }

      // Force initial resize after model is loaded
      setTimeout(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          this.renderer.setSize(container.clientWidth, container.clientHeight);
          this.camera.aspect = container.clientWidth / container.clientHeight;
          this.camera.updateProjectionMatrix();
        }
      }, 0);

      let animate = () => {
        controls.update();
        this.renderer.render(scene, this.camera);
        if (this.connected) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    });
  }

  disconnectedCallback() {
    this.connected = false;

    // Clean up the ResizeObserver when component is removed
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}

// Register the component in browser environments, but only in IIFE build
// For ES modules, we export the class for manual registration
if (
  typeof process === "undefined" ||
  !process.env.ROLLUP_FORMAT ||
  process.env.ROLLUP_FORMAT === "iife"
) {
  if (typeof window !== "undefined" && !customElements.get("stl-viewer")) {
    customElements.define("stl-viewer", STLViewer);
  }
}

// Export the component class for ES modules
export { STLViewer };
