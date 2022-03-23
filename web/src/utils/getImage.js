const path = `${import.meta.env.VITE_NODE_API_URL}/static`;

export const getImage = (type, name, defaultImage) => {
  if (!name) {
    return `/assets/default/${type}/${defaultImage}`;
  }
  return `${path}/${type}/${name || defaultImage}`;
};
