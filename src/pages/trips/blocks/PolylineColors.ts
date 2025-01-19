export const PolylineColors = ['#5271FF', '#FF0000'];

export const getColor = (index: number) => {
  return PolylineColors[index % PolylineColors.length];
};
