import {
  loadCommentsAction,
  postCommentAction,
} from './actions';
import {
  GET_COMMENTS_SAGA,
  POST_COMMENT_SAGA,
} from './types';

describe('Ducks :: Stager -> actions', () => {
  it('trigger GetComments Saga', () => {
    const EvalId = 596401265;
    const expectedAction = {
      type: GET_COMMENTS_SAGA,
      payload: EvalId,
    };
    const action = loadCommentsAction(EvalId);
    expect(action).toEqual(expectedAction);
  });

  it('trigger postComment Saga', () => {
    const comment = 'Dispositioned';
    const expectedAction = {
      type: POST_COMMENT_SAGA,
      payload: comment,
    };
    const action = postCommentAction(comment);
    expect(action).toEqual(expectedAction);
  });
});
