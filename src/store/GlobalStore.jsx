import React from 'react';
import PropTypes from 'prop-types';

import Global from '../models/Global';

const GlobalContext = React.createContext();

class GlobalStore extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateValue = this.handleUpdateValue.bind(this);
    const global = new Global();
    global.addEventListener('change', this.handleUpdateValue);
    this.state = {
      value: global,
    };
  }

  handleUpdateValue(value) {
    this.setState({ value });
  }

  render() {
    const { children } = this.props;
    const { value } = this.state;
    return (
      <GlobalContext.Provider value={value}>
        {children}
      </GlobalContext.Provider>
    );
  }
}

GlobalStore.propTypes = {
  children: PropTypes.node.isRequired,
};

export default {
  Provider: GlobalStore,
  Consumer: GlobalContext.Consumer,
};
