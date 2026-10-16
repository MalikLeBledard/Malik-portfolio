import * as THREE from 'three';

// "Fred", a cartoon dog mascot built from simple shapes. His head follows the cursor,
// his tail wags, and kibble rains around him.
const canvas = document.getElementById('scene') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 1.4, 12);
camera.lookAt(0, 0.6, 0);

scene.add(new THREE.HemisphereLight(0xfff3d6, 0xc77b2a, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(3, 6, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const mat = (color: number, roughness = 0.6) => new THREE.MeshStandardMaterial({ color, roughness });
const fur = mat(0xd98a3d);
const furLight = mat(0xffe2b8);
const dark = mat(0x2a160a, 0.3);
const white = mat(0xffffff, 0.2);

const sphere = (r: number, m: THREE.Material, seg = 48) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), m);
  mesh.castShadow = true;
  return mesh;
};

const dog = new THREE.Group();
scene.add(dog);

// Body
const body = sphere(1, fur);
body.scale.set(1.25, 1, 1.05);
body.position.y = 0.2;
dog.add(body);
const belly = sphere(0.8, furLight);
belly.scale.set(1, 0.95, 0.6);
belly.position.set(0, 0.05, 0.6);
dog.add(belly);

// Legs
[[-0.6, 0.55], [0.6, 0.55], [-0.6, -0.45], [0.6, -0.45]].forEach(([x, z]) => {
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.45, 8, 16), fur);
  leg.position.set(x, -0.65, z);
  leg.castShadow = true;
  dog.add(leg);
  const paw = sphere(0.28, furLight);
  paw.scale.set(1, 0.6, 1.2);
  paw.position.set(x, -1.0, z + 0.08);
  dog.add(paw);
});

// Tail
const tailPivot = new THREE.Group();
tailPivot.position.set(0, 0.55, -0.95);
dog.add(tailPivot);
const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.7, 8, 16), fur);
tail.position.y = 0.4;
tail.rotation.x = -0.5;
tailPivot.add(tail);

// Collar + tag
const collar = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.09, 16, 48), mat(0xff3d5a, 0.4));
collar.rotation.x = Math.PI / 2 - 0.25;
collar.position.set(0, 1.05, 0.25);
dog.add(collar);
const tag = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 32), mat(0xffc93c, 0.2));
tag.rotation.x = Math.PI / 2;
tag.position.set(0, 0.82, 0.86);
dog.add(tag);

// Head
const head = new THREE.Group();
head.position.set(0, 1.75, 0.35);
dog.add(head);
const skull = sphere(0.95, fur);
skull.scale.set(1.08, 1, 1);
head.add(skull);
const muzzle = sphere(0.5, furLight);
muzzle.scale.set(1.15, 0.8, 1);
muzzle.position.set(0, -0.3, 0.72);
head.add(muzzle);
const nose = sphere(0.17, dark);
nose.scale.set(1.3, 0.9, 1);
nose.position.set(0, -0.12, 1.2);
head.add(nose);
const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 24, Math.PI), dark);
mouth.rotation.z = Math.PI;
mouth.position.set(0, -0.42, 1.12);
head.add(mouth);
const tongue = sphere(0.12, mat(0xff6b81, 0.4));
tongue.scale.set(1, 0.5, 1.2);
tongue.position.set(0, -0.56, 1.06);
head.add(tongue);
[-0.38, 0.38].forEach((x) => {
  const eye = sphere(0.17, dark, 32);
  eye.position.set(x, 0.18, 0.84);
  head.add(eye);
  const shine = sphere(0.055, white, 16);
  shine.position.set(x + 0.05, 0.25, 0.98);
  head.add(shine);
  const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.16, 4, 8), dark);
  brow.rotation.z = Math.PI / 2 + (x < 0 ? 0.25 : -0.25);
  brow.position.set(x, 0.45, 0.82);
  head.add(brow);
});
const ears = [-1, 1].map((side) => {
  const ear = sphere(0.42, mat(0x8a4a1c));
  ear.scale.set(0.55, 1.15, 0.3);
  ear.position.set(side * 0.92, 0.05, 0);
  ear.rotation.z = side * 0.35;
  head.add(ear);
  return ear;
});

// Shadow catcher
const ground = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.ShadowMaterial({ opacity: 0.18 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.2;
ground.receiveShadow = true;
dog.add(ground);

// Kibble: little rounded rings and bones raining down
const kibbleMat = mat(0x8b4a1e, 0.7);
const kibble = Array.from({ length: 34 }, (_, i) => {
  const mesh =
    i % 3 === 0
      ? new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.06, 12, 24), kibbleMat)
      : new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.14, 6, 12), kibbleMat);
  mesh.userData = { x: (Math.random() - 0.5) * 12, speed: 0.6 + Math.random() * 0.9, offset: Math.random() * 12, spin: Math.random() * 3 };
  scene.add(mesh);
  return mesh;
});

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});

let wide = true;
const resize = () => {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  wide = w > 900;
  dog.position.set(wide ? 2.6 : 0.4, wide ? -0.6 : -2.6, 0);
  dog.scale.setScalar(wide ? 1 : 0.62);
};
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const t = clock.getElapsedTime();
  // Head looks toward the cursor, body turns a little with it.
  head.rotation.y += (pointer.x * 0.7 - head.rotation.y) * 0.08;
  head.rotation.x += (pointer.y * 0.35 - head.rotation.x) * 0.08;
  head.rotation.z = Math.sin(t * 1.6) * 0.06;
  dog.rotation.y += (pointer.x * 0.25 - 0.35 - dog.rotation.y) * 0.05;
  body.scale.y = 1 + Math.sin(t * 3) * 0.015;
  tailPivot.rotation.z = Math.sin(t * 14) * 0.6;
  ears.forEach((ear, i) => (ear.rotation.x = Math.sin(t * 2 + i) * 0.12));

  kibble.forEach((k) => {
    const d = k.userData;
    const fall = ((t * d.speed + d.offset) % 12) / 12;
    k.position.set(d.x, 6 - fall * 12, -2.5 + Math.sin(d.offset) * 1.5);
    k.rotation.set(t * d.spin, t * d.spin * 0.6, 0);
  });

  renderer.render(scene, camera);
});
