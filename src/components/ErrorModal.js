import React from 'react';

function ErrorModal({ errorMsg, setError }) {
  setTimeout(() => {
    setError('');
  }, 3000);

  return (
    <div
      className="errorModal"
      onClick={() => {
        setError('');
      }}
    >
      <div className="errorMsgContainer">
        <p className="errorMessage">{errorMsg}</p>
        
        <div className="errorBar">
          <span className="progress"></span>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
