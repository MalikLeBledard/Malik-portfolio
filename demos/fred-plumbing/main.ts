// Booking screen of the app mockup: pick services and a time slot, see the total, book.
const SERVICES = [
  { icon: '💧', name: 'Leak repair', note: 'Pipes, joints, under-sink', price: 89 },
  { icon: '🌀', name: 'Drain unclog', note: 'Sink, shower or bath', price: 75 },
  { icon: '🔥', name: 'Water heater', note: 'Check + flush', price: 120 },
  { icon: '🚽', name: 'Toilet repair', note: 'Running or blocked', price: 69 },
];
const SLOTS = ['9:00', '11:30', '14:00', '16:30'];

const selected = new Set<number>([0]);
let slot = 1;

const servicesEl = document.getElementById('services')!;
const slotsEl = document.getElementById('slots')!;
const totalEl = document.getElementById('total')!;
const done = document.getElementById('done')!;
const doneText = document.getElementById('doneText')!;

const total = () => [...selected].reduce((sum, i) => sum + SERVICES[i].price, 0);

const render = () => {
  servicesEl.innerHTML = SERVICES.map(
    (s, i) => `
      <button class="svc ${selected.has(i) ? 'on' : ''}" data-i="${i}">
        <span class="ic">${s.icon}</span>
        <div><b>${s.name}</b><small>${s.note}</small></div>
        <em>$${s.price}</em>
      </button>`
  ).join('');
  slotsEl.innerHTML = SLOTS.map((t, i) => `<button class="slot ${i === slot ? 'on' : ''}" data-slot="${i}">${t}</button>`).join('');
  totalEl.textContent = `$${total()}`;
};

servicesEl.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
  if (!btn) return;
  const i = Number(btn.dataset.i);
  if (selected.has(i)) selected.delete(i);
  else selected.add(i);
  render();
});
slotsEl.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-slot]');
  if (!btn) return;
  slot = Number(btn.dataset.slot);
  render();
});
document.getElementById('book')!.addEventListener('click', () => {
  if (!selected.size) return;
  doneText.textContent = `Your plumber arrives today at ${SLOTS[slot]}. Total: $${total()}, paid after the job.`;
  done.classList.add('show');
});
document.getElementById('again')!.addEventListener('click', () => done.classList.remove('show'));

render();
