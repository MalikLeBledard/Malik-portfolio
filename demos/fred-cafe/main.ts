import * as THREE from 'three';

// A rotating 3D coffee cup with crema, steam and floating coffee beans.
const canvas = document.getElementById('scene') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 1.2, 9);

scene.add(new THREE.HemisphereLight(0xffe7cc, 0x2b1a11, 1.1));
const key = new THREE.DirectionalLight(0xffd2a1, 2.6);
key.position.set(4, 6, 5);
scene.add(key);
const rim = new THREE.DirectionalLight(0xd08a45, 2.2);
rim.position.set(-5, 2, -4);
scene.add(rim);

const group = new THREE.Group();
scene.add(group);

// Cup body (lathe profile)
const profile = [
  [0, -1.1], [0.95, -1.1], [1.05, -1.0], [1.18, -0.4], [1.3, 0.4], [1.38, 1.0], [1.42, 1.1],
  [1.32, 1.1], [1.26, 0.45], [1.12, -0.35], [1.0, -0.95], [0, -0.95],
].map(([x, y]) => new THREE.Vector2(x, y));
const ceramic = new THREE.MeshStandardMaterial({ color: 0xfff8ef, roughness: 0.25, metalness: 0.05 });
const cup = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), ceramic);
group.add(cup);

// Caramel band around the cup
const band = new THREE.Mesh(
  new THREE.CylinderGeometry(1.335, 1.275, 0.32, 96, 1, true),
  new THREE.MeshStandardMaterial({ color: 0xd08a45, roughness: 0.45, side: THREE.DoubleSide })
);
band.position.y = 0.45;
group.add(band);

// Coffee surface with a latte-art ring
const coffee = new THREE.Mesh(
  new THREE.CircleGeometry(1.3, 96),
  new THREE.MeshStandardMaterial({ color: 0x4a2814, roughness: 0.35 })
);
coffee.rotation.x = -Math.PI / 2;
coffee.position.y = 0.92;
group.add(coffee);
const crema = new THREE.Mesh(
  new THREE.RingGeometry(0.25, 0.75, 96),
  new THREE.MeshStandardMaterial({ color: 0xe8c39a, roughness: 0.5 })
);
crema.rotation.x = -Math.PI / 2;
crema.position.y = 0.93;
group.add(crema);

// Handle
const handle = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.12, 24, 64, Math.PI * 1.2), ceramic);
handle.position.set(1.42, 0.15, 0);
handle.rotation.z = -Math.PI * 0.6;
group.add(handle);

// Saucer
const saucer = new THREE.Mesh(
  new THREE.CylinderGeometry(2.1, 1.6, 0.16, 96),
  new THREE.MeshStandardMaterial({ color: 0xf3e3cf, roughness: 0.3 })
);
saucer.position.y = -1.2;
group.add(saucer);

// Steam: soft sprites drifting upward
const steamTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const steam = Array.from({ length: 26 }, (_, i) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false }));
  s.userData = { offset: i / 26, drift: Math.random() * Math.PI * 2 };
  group.add(s);
  return s;
});

// Floating beans
const beanMat = new THREE.MeshStandardMaterial({ color: 0x5b3219, roughness: 0.55 });
const beans = Array.from({ length: 9 }, (_, i) => {
  const bean = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), beanMat);
  bean.scale.set(1, 0.62, 1.35);
  const crease = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.025, 8, 32, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x2b1a11 })
  );
  crease.rotation.y = Math.PI / 2;
  crease.position.y = 0.13;
  bean.add(crease);
  const angle = (i / 9) * Math.PI * 2;
  bean.userData = { angle, radius: 2.0 + (i % 3) * 0.35, y: -0.6 + (i % 4) * 0.55, spin: 0.4 + Math.random() };
  scene.add(bean);
  return bean;
});

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});

const resize = () => {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // Push the cup to the right half on wide screens, centre it on mobile.
  const wide = w > 900;
  group.position.set(wide ? 2.5 : 0.3, wide ? -0.35 : -2.6, 0);
  group.scale.setScalar(wide ? 0.72 : 0.5);
};
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const t = clock.getElapsedTime();
  group.rotation.y += (pointer.x * 0.6 + t * 0.25 - group.rotation.y) * 0.04;
  group.rotation.x += (pointer.y * 0.15 + 0.18 - group.rotation.x) * 0.05;
  group.position.y += Math.sin(t * 1.2) * 0.002;
  crema.rotation.z = t * 0.3;

  steam.forEach((s) => {
    const k = (t * 0.18 + s.userData.offset) % 1;
    s.position.set(Math.sin(k * 6 + s.userData.drift) * 0.35, 1.1 + k * 2.6, Math.cos(k * 5 + s.userData.drift) * 0.25);
    s.scale.setScalar(0.35 + k * 0.9);
    (s.material as THREE.SpriteMaterial).opacity = Math.sin(k * Math.PI) * 0.5;
  });

  beans.forEach((bean) => {
    const d = bean.userData;
    const a = d.angle + t * 0.18;
    bean.position.set(
      group.position.x + Math.cos(a) * d.radius,
      group.position.y + d.y + Math.sin(t + d.angle) * 0.18,
      Math.sin(a) * d.radius * 0.6
    );
    bean.rotation.set(t * d.spin, t * d.spin * 0.7, 0);
  });

  renderer.render(scene, camera);
});
