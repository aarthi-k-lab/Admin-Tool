import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// const Shadow = ({ onClick, username }) => {
//   return (
//     <span onClick={onClick}>{ username }</span>
//   )
// };

// const renderProp = data => <Shadow onClick={data.handleClick} username={data.username} />;
ReactDOM.render(
  // <GlobalStore.Provider>
  <App />,
  //   <GlobalStore.Consumer>
  //     {renderProp}
  //   </GlobalStore.Consumer>
  // </GlobalStore.Provider>,
  document.getElementById('app'),
);
