import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class STLViewer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.connected = true;

    const shadowRoot = this.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";

    shadowRoot.appendChild(container);

    if (!this.hasAttribute("model")) {
      throw new Error("model attribute is required");
    }

    const model = this.getAttribute("model");

    let camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener(
      "resize",
      function () {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
      },
      false
    );
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    let scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    new STLLoader().load(model, (geometry) => {
      let material = new THREE.MeshPhongMaterial({
        color: 0xe0e0e0,
        specular: 100,
        shininess: 100,
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(middle);
      mesh.geometry.applyMatrix4(
        new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
      );

      geometry.computeBoundingSphere();
      const boundingSphere = geometry.boundingSphere;

      const fov = camera.fov * (Math.PI / 180);
      const distance = boundingSphere.radius / Math.sin(fov / 2);

      const padding = 1.2;
      camera.position.z = distance * padding;
      camera.lookAt(0, 0, 0);

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

      let animate = () => {
        controls.update();
        renderer.render(scene, camera);
        if (this.connected) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    });
  }

  disconnectedCallback() {
    this.connected = false;
  }
}

customElements.define("stl-viewer", STLViewer);

export default STLViewer;
