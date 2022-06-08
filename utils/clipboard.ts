export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err: unknown) {}
}
