export const formatNumber = (num: number): string => {
  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
  } else {
    return num.toString();
  }
};
