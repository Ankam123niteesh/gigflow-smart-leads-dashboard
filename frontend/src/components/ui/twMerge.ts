export const twMerge = (...classes: Array<string | false | undefined | null>): string => {
  return classes.filter(Boolean).join(' ');
};
