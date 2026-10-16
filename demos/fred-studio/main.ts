// Interactive dot field: dots are pushed away by the cursor, light up near it, and ripple on click.
const canvas = document.getElementById('field') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const GAP = 30;
type Dot = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };
let dots: Dot[] = [];
let width = 0;
let height = 0;
const pointer = { x: -9999, y: -9999 };
const ripples: { x: number; y: number; r: number }[] = [];

const build = () => {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  dots = [];
  for (let y = GAP / 2; y < height + GAP; y += GAP) {
    for (let x = GAP / 2; x < width + GAP; x += GAP) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
  }
};

window.addEventListener('resize', build);
window.addEventListener('pointermove', (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});
window.addEventListener('pointerleave', () => {
  pointer.x = pointer.y = -9999;
});
window.addEventListener('pointerdown', (e) => ripples.push({ x: e.clientX, y: e.clientY, r: 0 }));

const RADIUS = 150;
const tick = () => {
  ctx.clearRect(0, 0, width, height);
  for (const ripple of ripples) ripple.r += 9;
  while (ripples.length && ripples[0].r > Math.hypot(width, height)) ripples.shift();

  for (const d of dots) {
    const dx = d.x - pointer.x;
    const dy = d.y - pointer.y;
    const dist = Math.hypot(dx, dy);
    if (dist < RADIUS && dist > 0.1) {
      const force = (1 - dist / RADIUS) * 2.2;
      d.vx += (dx / dist) * force;
      d.vy += (dy / dist) * force;
    }
    for (const ripple of ripples) {
      const rd = Math.hypot(d.ox - ripple.x, d.oy - ripple.y);
      const band = Math.abs(rd - ripple.r);
      if (band < 30 && rd > 0) {
        const push = (1 - band / 30) * 1.8;
        d.vx += ((d.ox - ripple.x) / rd) * push;
        d.vy += ((d.oy - ripple.y) / rd) * push;
      }
    }
    d.vx += (d.ox - d.x) * 0.06;
    d.vy += (d.oy - d.y) * 0.06;
    d.vx *= 0.82;
    d.vy *= 0.82;
    d.x += d.vx;
    d.y += d.vy;

    const glow = Math.max(0, 1 - Math.hypot(d.x - pointer.x, d.y - pointer.y) / (RADIUS * 1.6));
    const size = 1.4 + glow * 2.6;
    // Blend from soft grey to indigo/cyan near the cursor.
    const r = Math.round(190 - glow * 150);
    const g = Math.round(190 - glow * 80);
    const b = Math.round(205 + glow * 40);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.55 + glow * 0.45})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(tick);
};

build();
tick();
