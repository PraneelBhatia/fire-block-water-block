import * as THREE from 'three';

export class GameRenderer {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  tileSize = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 8;
    this.camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      100,
    );
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    directional.castShadow = true;
    this.scene.add(directional);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 8;
    this.camera.left = -viewSize * aspect;
    this.camera.right = viewSize * aspect;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  gridToWorld(x: number, y: number): THREE.Vector3 {
    return new THREE.Vector3(
      x * this.tileSize - 3.5,
      0,
      -y * this.tileSize + 2.5,
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
