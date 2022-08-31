import React from 'react';

function ErrorModal({ errorMsg, setError, setIsProfane }) {
  setTimeout(() => {
    setError('');
    setIsProfane(false);
  }, 3000);

  return (
    <div
      className="errorModal"
      onClick={() => {
        setError('');
        setIsProfane(false);
      }}
    >
      <div className="errorMsgContainer">
        <p className="errorMessage">{errorMsg}</p>

      </div>
    </div>
  );
}

export default ErrorModal;
