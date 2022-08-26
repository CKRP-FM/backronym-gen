import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="errorPageContainer wrapper">
      <div className="errorPageImg">
        <img src={require('../assets/404-ufo.png')} alt="3D render of UFO showing 404" />
      </div>
      <h1>ERROR - This page does not exist.</h1>
      <Link to={`/`}>
        <button>Back</button>
      </Link>
    </div>
  );
}

export default ErrorPage;
