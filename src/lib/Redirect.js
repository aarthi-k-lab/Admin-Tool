
const Redirect = {};

Redirect.toLogin = (successRedirectUrl) => {
  window.location = `/api/auth/login?redirectSuccessUrl=${successRedirectUrl}&redirectFailureUrl=/unauthorized`;
};

Redirect.toReport = (successRedirectUrl) => {
  window.location = `/api/auth/powerbi?redirectSuccessUrl=${successRedirectUrl}&redirectFailureUrl=/`;
};

export default Redirect;
