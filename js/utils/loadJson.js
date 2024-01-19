export async function loadJson(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading JSON from ${url}:`, error);
    throw error;
  }
}