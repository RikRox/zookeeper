const PORT = process.env.PORT || 3001;

const { animals } = require('./data/animals');

const express = require('express');

//instantiates the server
const app = express();

// callback function will run everytime that route is accessed from that route with get request && res.send sends string to client
app.get('/', (req, res) => {
    let results = animals;
    console.log(req.query);

    if (req.query) {
        results = filterByQuery(req.query, results);
      }

    res.json(results);
  });


//make the server listen
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
  });


  function filterByQuery(query, animalsArray) {
    let personalityTraitsArray =[];
    //we save animals Array as filtered results

    let filteredResults = animalsArray;


    if(query.personalityTraits){
        //save personalityTraits as a dedicated array
        //if personalityTraits is a string, plce it into a new arry and sae

        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
            
        } else {
            personalityTraitsArray = query.personalityTraits;
        }


        //loop through ech trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            
            //check the trait against ech animal int he filteredResults array.
            //remember it is initially a copy of the animals array
            //but but here we are updating it for each trait in the .forEach() loop
            //for each trait being targeted by the filter, the filteredResults
            //array will then contain only the entries that contain the trait,
            //so at the end we'll have an array of animals that have every one
            //of the traits when the .forEach() loop is finished
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );

        });

    }


    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
  }