const getUser = state => state.user;
const getGroups = state => (state.user && state.user.group ? state.user.group : []);

const selectors = {
  getUser,
  getGroups,
};

export default selectors;
