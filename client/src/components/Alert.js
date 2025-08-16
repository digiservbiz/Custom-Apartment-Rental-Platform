import React from 'react';

const Alert = ({ type, message }) => {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
};

Alert.defaultProps = {
  type: 'info',
};

export default Alert;
