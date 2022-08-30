import axios from 'axios';

function profanityFilter(word) {

    let results;
    const isProfane = async () => {
        results = await axios
            .get(
                `https://www.purgomalum.com/service/containsprofanity?text=${word}`
            )
            .then((response) => {
                // console.log("success: " + response.data)
                return response.data;
            })
            .catch((err) => {
                // console.log('error: ' + err);
                return err.data;
            })
        console.log(results);
    }
     
    return results;
}

export default profanityFilter;