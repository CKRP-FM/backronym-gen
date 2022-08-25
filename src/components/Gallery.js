import firebase from '../firebase';

import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext.js';

function Gallery() {
  //useState for gallery of user's backronym
  const [gallery, setGallery] = useState([]);
	const [backronymFilter, setBackronymFilter] = useState('recent');
	const {user} = useUserAuth();

  // delete entry
  function handleDelete(e, resultKey) {
    e.preventDefault();
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${resultKey}`);
    remove(dbRef);
  }

	//updating like count
	function handleLike(resultKey, resultLikes) {
		const addLike = resultLikes + 1;
		const updatedLikes = {
			likes: addLike,
		}

		const database = getDatabase(firebase);
		const childRef = ref(database, `/${resultKey}`);
		update(childRef, updatedLikes);
	}

  //connect to firebase when Gallery component mounts
  useEffect(() => {
    // database details
    const database = getDatabase(firebase);
    const dbRef = ref(database);

		//for every change in the firebase db, push the new value into our gallery state
		onValue(dbRef, (response) => {
			console.log(response.val());
			const newState = [];
			const data = response.val();
			for (let key in data) {
				newState.push(
					{
						key: key,
						timestamp: data[key].timestamp,
						email: data[key].email,
						userInput: data[key].userInput, //["k", "e", "o", "n"]
						results: data[key].results, // ["key", "eel", "on", "new"]
						likes: data[key].likes,
					}
				)
			}

			if (backronymFilter === 'recent') {
				newState.sort((a, b) => b.timestamp - a.timestamp);
			} else if (backronymFilter === 'oldest') {
				newState.sort((a, b) => a.timestamp - b.timestamp);
			} else if (backronymFilter === 'alphabetical') {
				newState.sort((a, b) => {
					return a.userInput.join('').localeCompare(b.userInput.join(''), {ignorePunctuation: true})
				})
			}
			//setting the user's fb submission to our gallery state
			setGallery(newState);
			console.log(gallery)
		})
	}, [backronymFilter]);

	const setFilter = (e) => {
		setBackronymFilter(e.target.value);
	}

	return (
		<div className="wrapper">
			<h2>Backronym Gallery</h2>
			<p className='galleryDesc'>WOW. Wall of Wisdom. Check out these cool backronyms!</p>

			<label htmlFor='filter'></label>
			<select id="filter"
			onChange={setFilter}
			value={backronymFilter}>
				<option value="recent">Most Recent</option>
				<option value="alphabetical">Alphabetical</option>
				<option value="oldest">Oldest to Newest</option>
			</select>

			<ul className="resultsDisplay">
				{
					// map over the gallery state (from firebase). Results is each submission
					gallery.map((result) => {
						return (
							<li key={result.key}>
							{
								user === null ? "" :
									user.email === result.email ?
									<button onClick={(e) => handleDelete(e, result.key)}>X</button> :
										user.email === null && result.email === 'anonymous' ?
											<button onClick={(e) => handleDelete(e, result.key)}>X</button> : ""
							}

							{user ? <button className='likeBtn' onClick={() => handleLike(result.key, result.likes)}>Like</button> : null}

							<h3>{result.userInput}</h3>
							{/* mapping over each user's submission results array item (each word in array is the initial) */}
							{result.results.map((initialWord, index) => {
							  return <p key={`${result.key}-${index}`}>{initialWord}</p>;
							})}

							<p className='likeCount'>{result.likes}</p>

						  </li>
						)
					})
				}
			</ul>        
		</div>
	)
}

export default Gallery;
