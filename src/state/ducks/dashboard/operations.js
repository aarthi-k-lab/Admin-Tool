import { onExpandView } from './actions';

const onExpand = dispatch => () => dispatch(onExpandView());

const operations = {
  onExpand,
};

export default operations;
