export function getLink(current, array) {
  const authorPath = current
    .split(' ')
    .filter((a) => a !== '')
    .map((a) => a.replace(/[^a-zA-Z ]/g, ''))
    .join('-')
    .toLowerCase();

  const splittedArray = array.split(',');
  let linkText = '';

  if (splittedArray.length === 1 || current === splittedArray[splittedArray.length - 1]) {
    linkText = current;
  } else {
    linkText = `${current},`;
  }

  return [linkText, authorPath];
}
