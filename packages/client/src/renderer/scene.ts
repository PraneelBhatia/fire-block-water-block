import * as THREE from 'three';

export class GameRenderer {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  tileSize = 1;

  // Grid dimensions for centering
  private gridWidth = 0;
  private gridHeight = 0;
  private viewSize = 8;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();

    // Bright sky background — lively Minecraft-ish feel
    this.scene.background = new THREE.Color(0x7ec8e3);

    // Very light atmospheric fog matching sky
    this.scene.fog = new THREE.FogExp2(0x7ec8e3, 0.006);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      -this.viewSize * aspect,
      this.viewSize * aspect,
      this.viewSize,
      -this.viewSize,
      0.1,
      200,
    );

    // OG Bloxorz camera angle
    const distance = 40;
    const elevationAngle = 35 * (Math.PI / 180);
    const rotationAngle = 315 * (Math.PI / 180);

    this.camera.position.set(
      distance * Math.cos(elevationAngle) * Math.sin(rotationAngle),
      distance * Math.sin(elevationAngle),
      distance * Math.cos(elevationAngle) * Math.cos(rotationAngle),
    );
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    // --- Lighting (bright, sunny, outdoor) ---
    // Strong ambient so nothing is too dark
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);

    // Bright sunlight from upper-right
    const mainLight = new THREE.DirectionalLight(0xfffbe8, 1.0);
    mainLight.position.set(8, 20, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 60;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    mainLight.shadow.bias = -0.002;
    mainLight.shadow.radius = 3;
    this.scene.add(mainLight);

    // Warm fill from left
    const fillLight = new THREE.DirectionalLight(0xffe0b2, 0.3);
    fillLight.position.set(-10, 8, -4);
    this.scene.add(fillLight);

    // Cool fill from right for dimension
    const coolFill = new THREE.DirectionalLight(0xb2e0ff, 0.2);
    coolFill.position.set(10, 6, 8);
    this.scene.add(coolFill);

    // Sky/ground hemisphere — bright blue sky, warm earthy ground
    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.4);
    this.scene.add(hemi);

    window.addEventListener('resize', () => this.onResize());
  }

  /** Call when a new level loads to center the camera on the grid */
  centerOnGrid(width: number, height: number) {
    this.gridWidth = width;
    this.gridHeight = height;

    const centerX = (width - 1) * this.tileSize / 2;
    const centerZ = -(height - 1) * this.tileSize / 2;

    const distance = 40;
    const elevationAngle = 35 * (Math.PI / 180);
    const rotationAngle = 315 * (Math.PI / 180);

    this.camera.position.set(
      centerX + distance * Math.cos(elevationAngle) * Math.sin(rotationAngle),
      distance * Math.sin(elevationAngle),
      centerZ + distance * Math.cos(elevationAngle) * Math.cos(rotationAngle),
    );
    this.camera.lookAt(centerX, 0, centerZ);

    const maxDim = Math.max(width, height);
    this.viewSize = Math.max(5, maxDim * 0.75);
    this.onResize();
  }

  onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.left = -this.viewSize * aspect;
    this.camera.right = this.viewSize * aspect;
    this.camera.top = this.viewSize;
    this.camera.bottom = -this.viewSize;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /** Convert grid coordinates to world position */
  gridToWorld(x: number, y: number): THREE.Vector3 {
    return new THREE.Vector3(
      x * this.tileSize,
      0,
      -y * this.tileSize,
    );
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  startLoop(update: () => void) {
    const loop = () => {
      update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
