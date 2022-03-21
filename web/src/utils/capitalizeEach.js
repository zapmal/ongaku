export const capitalizeEach = (str) => {
  const words = str.split(' ');

  for (let index = 0; index < words.length; index++) {
    words[index] = words[index][0].toUpperCase() + words[index].substr(1);
  }

  return words.join(' ');
};
