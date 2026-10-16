// Booking card: recompute the price breakdown when the dates change.
const NIGHTLY = 245;
const CLEANING = 90;
const SERVICE_RATE = 0.14;

const checkIn = document.getElementById('in') as HTMLInputElement;
const checkOut = document.getElementById('out') as HTMLInputElement;
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const iso = (d: Date) => d.toISOString().slice(0, 10);

const start = new Date();
start.setDate(start.getDate() + 14);
const end = new Date(start);
end.setDate(end.getDate() + 5);
checkIn.value = iso(start);
checkOut.value = iso(end);
checkIn.min = iso(new Date());

const update = () => {
  const nights = Math.max(1, Math.round((+new Date(checkOut.value) - +new Date(checkIn.value)) / 86400000) || 1);
  const base = nights * NIGHTLY;
  const service = base * SERVICE_RATE;
  document.getElementById('nightsLabel')!.textContent = `$${NIGHTLY} × ${nights} night${nights > 1 ? 's' : ''}`;
  document.getElementById('nightsTotal')!.textContent = money(base);
  document.getElementById('service')!.textContent = money(service);
  document.getElementById('total')!.textContent = money(base + CLEANING + service);
};

checkIn.addEventListener('change', () => {
  if (checkOut.value <= checkIn.value) {
    const next = new Date(checkIn.value);
    next.setDate(next.getDate() + 1);
    checkOut.value = iso(next);
  }
  checkOut.min = checkIn.value;
  update();
});
checkOut.addEventListener('change', update);

document.getElementById('reserve')!.addEventListener('click', () => {
  document.getElementById('note')!.textContent = 'Demo site: this is where the guest would confirm and pay.';
});
const save = document.getElementById('save')!;
save.addEventListener('click', () => {
  save.textContent = save.textContent?.includes('♥') ? '♡ Save' : '♥ Saved';
});

update();
