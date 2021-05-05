const scrollIntoView = (item) => {
  const { value } = item;
  const doc = document.querySelector(`#${value}`);
  if (doc) {
    setTimeout(() => {
      doc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 10);
  }
  window.scrollBy(0, 200);
};

module.exports = scrollIntoView;
