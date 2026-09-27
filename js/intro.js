// Logo intro: a lacquer medallion with the naga in raised relief spins in,
// then the camera dives toward the coil while the page opens from that point.
import * as THREE from '../vendor/three.module.min.js';
import { SVGLoader } from '../vendor/SVGLoader.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const CENTER = { x: 1000, y: 1030 };   // centre of the traced logo in SVG pixels
const DIVE = { x: 1165, y: 1210 };     // the open loop of the naga's coil
const DISC_R = 1060;
const FREEZE = (() => { const v = new URLSearchParams(location.search).get('introT'); return v == null ? null : +v; })();

const ease = {
  outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inCubic: t => t * t * t,
};
const clamp01 = v => Math.min(1, Math.max(0, v));
const span = (t, a, b) => clamp01((t - a) / (b - a));

function shapesFrom(svgText) {
  const data = new SVGLoader().parse(svgText);
  const shapes = [];
  for (const path of data.paths) shapes.push(...SVGLoader.createShapes(path));
  return shapes;
}

function reliefGeometry(shapes, depth) {
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth, bevelEnabled: true, bevelThickness: 9, bevelSize: 5, bevelSegments: 2, curveSegments: 5,
  });
  geo.translate(-CENTER.x, -CENTER.y, 0);
  return geo;
}

function rimGeometry() {
  // Lathe profile of the raised gold rim with a bevelled outer edge.
  const R = DISC_R, face = 30, rim = 66, rimW = 70;
  const p = [
    [R - rimW, -face], [R - rimW + 14, -rim], [R - 14, -rim], [R, -rim + 16],
    [R, rim - 16], [R - 14, rim], [R - rimW + 14, rim], [R - rimW, face],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(p, 160);
  g.rotateX(Math.PI / 2);
  return g;
}

export async function playIntro({ canvas, root, onReveal, onDone, signal }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.7;

  const camera = new THREE.PerspectiveCamera(30, 1, 10, 20000);

  const [nagaSvg, textSvg] = await Promise.all([
    fetch('img/naga.svg').then(r => r.text()),
    fetch('img/text.svg').then(r => r.text()),
  ]);
  if (signal?.aborted) return;

  const gold = new THREE.MeshStandardMaterial({ color: 0xc9a44c, metalness: 1, roughness: 0.28 });
  const relief = new THREE.MeshStandardMaterial({ color: 0xf1e7c2, metalness: 0.35, roughness: 0.38 });
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x1a3d29, metalness: 0.15, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide });

  const medal = new THREE.Group();
  const faceGeo = new THREE.CylinderGeometry(DISC_R - 60, DISC_R - 60, 60, 160);
  faceGeo.rotateX(Math.PI / 2);
  medal.add(new THREE.Mesh(faceGeo, lacquer));
  medal.add(new THREE.Mesh(rimGeometry(), gold));

  const nagaShapes = shapesFrom(nagaSvg);
  const textShapes = shapesFrom(textSvg);
  const front = new THREE.Group();
  const nagaMesh = new THREE.Mesh(reliefGeometry(nagaShapes, 38), [relief, gold]);
  const textMesh = new THREE.Mesh(reliefGeometry(textShapes, 30), [relief, gold]);
  front.add(nagaMesh, textMesh);
  front.scale.set(0.9, -0.9, 1);          // SVG y points down
  front.position.z = 30;
  medal.add(front);
  const back = front.clone();
  back.rotation.y = Math.PI;
  back.position.z = -30;
  medal.add(back);
  scene.add(medal);

  const key = new THREE.DirectionalLight(0xfff1c8, 2.4);
  key.position.set(-1800, 1400, 2600);
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(0xb9f06a, 1.2);
  rimLight.position.set(2200, -600, -800);
  scene.add(rimLight);

  // The dive target in medallion space (flipped y, scaled like the relief).
  const diveLocal = new THREE.Vector3((DIVE.x - CENTER.x) * 0.9, -(DIVE.y - CENTER.y) * 0.9, 80);

  function fit() {
    const w = root.clientWidth, h = root.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  fit();
  window.addEventListener('resize', fit);

  // Distance so the medallion fills ~62% of the short side.
  const baseDist = () => {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const need = (DISC_R * 2) / 0.72;
    const byH = need / (2 * Math.tan(vFov / 2));
    const byW = byH / Math.min(camera.aspect, 1);
    return Math.max(byH, byW);
  };

  const T = { spin: 1700, hold: 350, dive: 1150 };
  const total = T.spin + T.hold + T.dive;
  const start = performance.now();
  const world = new THREE.Vector3();
  let revealed = false, finished = false;

  return new Promise(resolve => {
    function frame(now) {
      if (finished) return;
      if (signal?.aborted) { cleanup(); return; }
      const t = FREEZE != null ? FREEZE : now - start;
      const d0 = baseDist();

      const s = ease.outExpo(span(t, 0, T.spin));
      medal.rotation.y = (1 - s) * -Math.PI * 3;
      medal.rotation.x = (1 - s) * 0.35;
      const sc = 0.55 + 0.45 * s;
      medal.scale.setScalar(sc);
      key.position.x = -2600 + 4200 * ease.inOutCubic(span(t, 700, T.spin + 300));
      medal.updateMatrixWorld();

      const dv = span(t, T.spin + T.hold, total);
      const dz = ease.inCubic(dv);
      world.copy(diveLocal).applyMatrix4(medal.matrixWorld);
      camera.position.set(world.x * dz, world.y * dz, d0 + (world.z + 40 - d0) * dz);
      camera.lookAt(world.x * dz, world.y * dz, 0);
      camera.updateMatrixWorld();

      // Screen position of the dive point drives the CSS opening.
      const p = world.clone().project(camera);
      root.style.setProperty('--ox', ((p.x + 1) / 2 * 100).toFixed(2) + '%');
      root.style.setProperty('--oy', ((1 - p.y) / 2 * 100).toFixed(2) + '%');
      const open = ease.inCubic(span(t, T.spin + T.hold + T.dive * 0.55, total));
      root.style.setProperty('--open', (open * 150).toFixed(2) + 'vmax');
      if (!revealed && open > 0.02) { revealed = true; onReveal?.(); }

      renderer.render(scene, camera);
      if (FREEZE != null) { window.__introFrame = true; return; }
      if (t >= total) { cleanup(); return; }
      requestAnimationFrame(frame);
    }
    function cleanup() {
      finished = true;
      window.removeEventListener('resize', fit);
      renderer.dispose();
      pmrem.dispose();
      if (!revealed) onReveal?.();
      onDone?.();
      resolve();
    }
    // Expose for skip.
    root._stopIntro = () => { if (!finished) cleanup(); };
    requestAnimationFrame(frame);
  });
}
