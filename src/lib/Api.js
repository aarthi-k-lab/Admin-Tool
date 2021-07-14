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
    });
};

const callGetText = function callGetText(endpoint, params = {}) {
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
        return response.text();
      }
      return null;
    });
};

const callPost = function callPost(endpoint, body, params = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (!R.isEmpty(params)) {
    Object.assign(headers, params);
  }
  return fetch(endpoint,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    .then((response) => {
      if (R.prop('ok', response)
      || R.equals(R.prop('status', response), 422)
      || R.equals(R.prop('status', response), 500)) {
        if (R.equals(R.prop('status', response), 204)) {
          return {
            statusCode: 204,
            status: 'No Content',
            ...body,
          };
        }
        return response ? response.json() : null;
      }
      return null;
    });
};

function put(endpoint, body, params = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (!R.isEmpty(params)) {
    Object.assign(headers, params);
  }
  return fetch(endpoint,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })
    .then((response) => {
      if (R.prop('ok', response)) {
        return response.json();
      }
      throw new RangeError('HTTP status code not in range (2xx).');
    });
}

export {
  callGet,
  callGetText,
  callPost,
  put,
};
