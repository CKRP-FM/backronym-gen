import { Link } from "react-router-dom";

function ProfileDeleteModal({ setDeleteAccountAttempt, handleAccountDeletion }) {
    return (
      <div className="errorModal">
          <div className="errorMsgContainer">
            <p className="errorMessage"> Deleting your account is permanent and will erase ALL your backronyms. Are you sure you want to proceed?</p>
            <div className="deleteButtonContainer">
                <Link to="/login">
                  <button onClick={() => handleAccountDeletion()}>Confirm</button>
                </Link>
                <button onClick={() => setDeleteAccountAttempt(false)}>Cancel</button>
            </div>
          </div>
      </div>
    );
  }
  
  export default ProfileDeleteModal;