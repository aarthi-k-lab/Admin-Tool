import * as R from 'ramda';

const callGet = function callGet(endpoint, params = {}) {
  let headers = {};
  if (!R.isEmpty(params)) {
    headers = params;
  }
  return fetch(endpoint,
    {
      method: 'GET',
      headers,
    })
    .then((response) => {
      if (R.prop('ok', response)) {
        return response.json();
      }
      return null;
    })
    .then(
      response => (response),
    );
};

const callPost = function callPost(endpoint, body, params = {}) {
  let headers = {};
  if (!R.isEmpty(params)) {
    headers = params;
  }
  return fetch(endpoint,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    .then((response) => {
      if (R.prop('ok', response)) {
        return response.json();
      }
      return null;
    })
    .then(
      response => (response),
    );
};

export {
  callGet,
  callPost,
};
