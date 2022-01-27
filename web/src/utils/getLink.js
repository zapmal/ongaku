export function getLink(author, authors) {
  const authorPath = author
    .split(' ')
    .filter((a) => a !== '')
    .map((a) => a.replace(/[^a-zA-Z ]/g, ''))
    .join('-')
    .toLowerCase();

  const authorsArray = authors.split(',');
  let linkText = '';

  if (authorsArray.length === 1 || author === authorsArray[authorsArray.length - 1]) {
    linkText = author;
  } else {
    linkText = `${author},`;
  }

  return [linkText, authorPath];
}
