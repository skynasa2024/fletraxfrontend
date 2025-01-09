export const PolylineColors = [
  '#5271FF',
  '#119DA4',
  '#BB9F06',
  '#55251D',
  '#231B1B',
  '#E75A7C',
  '#036016'
];

export const getColor = (index: number) => {
  return PolylineColors[index % PolylineColors.length];
};
