export const formatDate = (date: string) => {
  var dt = new Date(date);
  const padL = (nr: number, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()}`;
};
