export const useCounter = () => {
  let count = 0;
  return () => (count += 1);
};
