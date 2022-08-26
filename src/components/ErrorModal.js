import React from 'react';

function ErrorModal({ errorMsg, setError }) {
  {
    setTimeout(() => {
      setError('');
    }, 3000);
  }
  return (
    <div className="errorModal">
      <p className="errorMessage">{errorMsg}</p>
    </div>
  );
}

export default ErrorModal;
