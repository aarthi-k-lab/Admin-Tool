const getCommentsData = state => (state.comments.comments ? state.comments.comments : []);

const selectors = {
  getCommentsData,
};

export default selectors;
