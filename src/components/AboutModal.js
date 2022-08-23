import React from "react";

const AboutModal = props => {
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
          <button onClick={props.onClose} className='close button'>X</button>
        </div>
        <div className="aboutMain">
          <p>
            The definition of ‘backronym’ (bakre,nim) is ‘an acronym deliberately formed from a phrase whose initial letters spell out a particular word or words, either to create a memorable name or as a fanciful explanation of a word’s origin. ie “Biodiversity Serving Our Nation, or BISON”’.
          </p> 
          <div className="aboutHowTo">
            <h2 className="howToTitle">How To Use Backronyms</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus assumenda debitis distinctio architecto fuga magnam inventore placeat, nostrum repudiandae non doloribus aut magni rerum pariatur officia laborum quaerat tenetur laboriosam.</p>   
            
          </div>           
        </div>
        <div className="modalFooter">
          Made with ☕ and 💘 @ Juno College 2022
        </div>
      </div>
    </div>
  )
}
  
export default AboutModal;
