const fs = require('fs');
const path = require('path');


const PORT = process.env.PORT || 3001;

const { animals } = require('./data/animals');

const express = require('express');

//instantiates the server
const app = express();



//parse incoming string or array data
app.use(express.urlencoded({extended: true}));

//parse incoming json data
app.use(express.json());




function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}



validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string'){
        return false;
    }
    if(!animal.diet || typeof animal.diet !== ' string'){
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;
}




function createNewAnimal(body, animalsArray){
    console.log(body);

    //our functions main code will go here!
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(path.join(__dirname, './data/animals.json'),

    //stringify converts the javascript data to json
    //null means we dont want to edit our existing data
    // 2 means we want to create white space between our values to make it more readable
    JSON.parse.stringify({animals: animalsArray}, null,2)
    
    
    );

    //return finished code to post route for response
    return animal;
}



// callback function will run everytime that route is accessed from that route with get request && res.send sends string to client
app.get('/api/animals/', (req, res) => {
    let results = animals;
    console.log(req.query);

    if (req.query) {
        results = filterByQuery(req.query, results);
      }

    res.json(results);
  });


//get to demonstrate params

app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    
    if (result){
       res.json(result); 
    } else {
        res.send(404);
    }
    

});



function createNewAnimal(body, animalsArray){
    const animal = body;
    animalsArray.push(animal);

    return animal;
}



//set up post routes
app.post('/api/animals',(req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');

    } else {


    //add animal to jason file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    //req.body is where our incoming content will be
    console.log(req.body);
    //not typical but to test to make sure the data sent from the client gets to the endpoint correctly
    //changed from req.body to animal

    res.json(animal);
    }
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