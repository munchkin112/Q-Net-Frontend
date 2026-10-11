export function toggleFavorite(favorites: string[], name: string): string[] {
  return favorites.includes(name)
    ? favorites.filter((favorite) => favorite !== name)
    : [...favorites, name];
}
