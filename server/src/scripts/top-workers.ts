const BASE = 'http://localhost:3000';

async function main() {
  const [workers, shifts] = await Promise.all([
    fetch(`${BASE}/workers`).then((r) => r.json()),
    fetch(`${BASE}/shifts`).then((r) => r.json()),
  ]);

  const counts = new Map<string, number>();
  for (const shift of shifts) {
    if (shift.workerId && !shift.cancelled) {
      counts.set(shift.workerId, (counts.get(shift.workerId) ?? 0) + 1);
    }
  }

  const result = workers
    .map((w: { id: string; name: string }) => ({ name: w.name, shifts: counts.get(w.id) ?? 0 }))
    .filter((w: { shifts: number }) => w.shifts > 0)
    .sort((a: { shifts: number }, b: { shifts: number }) => b.shifts - a.shifts)
    .slice(0, 3);

  console.log(JSON.stringify(result, null, 2));
}

main();
