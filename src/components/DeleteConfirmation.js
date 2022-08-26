import React from 'react';

function DeleteConfirmation({ setDeleteWarning, handleDelete, deleteID }) {
  return (
    <div className="errorModal" onClick={() => { setDeleteWarning(false) }}>
      <div className="errorMsgContainer">
        <p className="errorMessage">Are you sure you want to proceed? Changes are irreversible and your amazing backronym will be lost forever! &#x1F625;</p>
       
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
  );
}

export default DeleteConfirmation;
