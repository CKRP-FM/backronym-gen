import React from 'react';
import Footer from './Footer';
import {FaLinkedin} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useEffect } from 'react';

const AboutModal = props => {
  //statement to check if modal is opened and enable/disables main content scrolling
  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [props.show])

  if (!props.show) {
    return null
  } 
  
  return (
    <div className="aboutModal" onClick={props.onClose}>
      {/* the onClick function here will close the modal if clicked outside of the modal borders */}
      <div className="aboutContent" onClick={e => e.stopPropagation()}>
        <div className="aboutHeader">
          <h2 className="modalTitle">Backronym Generator</h2>
          {/* binds the close event */}
          <button onClick={props.onClose} className='closeButton'><span className="sr-only">Close</span>🍕</button>
        </div>
        <div className="aboutMain">
          <p>
            The definition of ‘backronym’ (bakre,nim) is ‘an acronym deliberately formed from a phrase whose initial letters spell out a particular word or words, either to create a memorable name or as a fanciful explanation of a word’s origin. ie “Biodiversity Serving Our Nation, or BISON”’.
          </p> 
          <div className="aboutHowTo">
            <h2 className="howToTitle">How To Use Backronyms</h2>
            <p>First, enter a word that you want an acronym for. Our generator will first give you a random list of words for the first initial. Then, our generator will give you words that it think best suits your previously selected word. This will repeat until your backronym is created! Neat! Make sure you save your awesome backronym to our backronym gallery. Logged in users can be able to like and delete backronyms, so be sure to create an account!</p>              
          </div>           
        </div>
        <div className="teamGit">
          <h3 className="teamHeader">Crafted by...</h3>
          <div className="teamContainer">
            <div className="team team1">
              <h3 className="initials">CC</h3>
              <IconContext.Provider value={{className: "linkedIn", size: 28}}>
              <div>
                <a href="https://www.linkedin.com/in/chxw/">
                  <FaLinkedin />
                </a>
              </div>   
              </IconContext.Provider>
            </div>
            <div className="team team2">
              <h3 className="initials">RS</h3>
              <IconContext.Provider value={{ className: "linkedIn", size: 28}}>
                <div>
                  <a href="www.linkedin.com/in/ryansted">
                    <FaLinkedin />
                  </a>
                </div>
              </IconContext.Provider>
            </div>
            <div className="team team3">
              <h3 className="initials">KP</h3>
              <IconContext.Provider value={{ className: "linkedIn", size: 28}}>
                <div>
                  <a href="https://www.linkedin.com/in/keonpierre/">
                    <FaLinkedin />
                  </a>
                </div>
              </IconContext.Provider>
            </div>
            <div className="team team4">
              <h3 className="initials">PY</h3>
              <IconContext.Provider value={{ className: "linkedIn", size: 28}}>
                <div>
                  <a href="https://www.linkedin.com/in/pingyuuu/">
                    <FaLinkedin />
                  </a>
                </div>
              </IconContext.Provider>
            </div>
          </div>
        </div>
        <div className="modalFooter">
          <Footer />
        </div>
      </div>
    </div>
  )
}
  
export default AboutModal;
