export function createId(prefix: string = "id"): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36).slice(-6);
  return `${prefix}-${ts}-${rnd}`;
}


