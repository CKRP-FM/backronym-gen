import React from 'react';

function ErrorModal({ errorMsg, setError }) {
  {
    setTimeout(() => {
      setError('');
    }, 2000);
  }
  return (
    <div className="errorModal">
      <p className="errorMessage">{errorMsg}</p>
    </div>
  );
}

export default ErrorModal;
