import React from 'react';

function DeleteConfirmation({ setDeleteWarning, handleDelete, deleteID }) {
  return (
    <div className="errorModal" onClick={() => { setDeleteWarning(false) }}>
      <div className="errorMsgContainer deleteMsgContainer">
        <h3>Warning!</h3>
        <p className="errorMessage">Are you really sure you want to proceed? Your decision is irreversible and your amazing backronym will be lost forever! &#x1F625;</p>
       
        <div className="deleteControls">
          <button
            className="cancelBtn"
            onClick={(e) => {
              e.preventDefault();
              setDeleteWarning(false);
            }}
          >Cancel</button>

          <button
            className="deleteBackronym"
            onClick={(e) => handleDelete(e, deleteID)}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
