import React from 'react';

function ErrorModal({ errorMsg, setError }) {
  return (
    <div className="errorModal">
      <div className="errorMsgContainer">
        <p className="errorMessage">{errorMsg}</p>
        {/* Close error pop up and reset error state when user clicks x */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setError('');
          }}
          className="closeButton"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
