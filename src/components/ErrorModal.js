import React from 'react';

function ErrorModal({ errorMsg, setError }) {
  return (
    <div className="errorModal">
      <div className="errorContent">
        <div className="errorHeader">
          <h2 className="modalTitle">{errorMsg}</h2>
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
    </div>
  );
}

export default ErrorModal;
