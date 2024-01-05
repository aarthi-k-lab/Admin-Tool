import React, { useEffect } from 'react';
import {
  Route, Switch,
} from 'react-router-dom';
import AdminTool from './AdminTool/AdminTool';

const ProtectedRoutes = () => {
  useEffect(() => {
  }, []);
  return (
    <Switch>
      <Route path="/admin-tool" render={() => <AdminTool />} />
    </Switch>
  );
};

ProtectedRoutes.defaultProps = {
};
ProtectedRoutes.propTypes = {
};

export default ProtectedRoutes;
