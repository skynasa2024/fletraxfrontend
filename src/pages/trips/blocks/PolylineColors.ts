export const PolylineColors = ['#5271FF', '#FF0000'];

export const getColor = (index: string) => {
  // Hash string to number
  let hash = 0;
  for (let i = 0; i < index.length; i++) {
    hash = index.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PolylineColors[Math.abs(hash) % PolylineColors.length];
};
