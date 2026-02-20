const BASE = 'http://localhost:3000';

async function main() {
  const [workplaces, shifts] = await Promise.all([
    fetch(`${BASE}/workplaces`).then((r) => r.json()),
    fetch(`${BASE}/shifts`).then((r) => r.json()),
  ]);

  const counts = new Map<string, number>();
  for (const shift of shifts) {
    if (shift.workerId && !shift.cancelled) {
      counts.set(shift.workplaceId, (counts.get(shift.workplaceId) ?? 0) + 1);
    }
  }

  const result = workplaces
    .map((wp: { id: string; name: string }) => ({ name: wp.name, shifts: counts.get(wp.id) ?? 0 }))
    .filter((wp: { shifts: number }) => wp.shifts > 0)
    .sort((a: { shifts: number }, b: { shifts: number }) => b.shifts - a.shifts)
    .slice(0, 3);

  console.log(JSON.stringify(result, null, 2));
}

main();
