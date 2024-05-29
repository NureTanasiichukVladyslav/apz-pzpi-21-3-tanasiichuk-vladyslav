export const formatMetricDate = (date: string) => {
  var dt = new Date(date);
  const padL = (nr: number, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${padL(dt.getMonth() + 1)}/${padL(
    dt.getDate()
  )}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(
    dt.getSeconds()
  )}`;
};
