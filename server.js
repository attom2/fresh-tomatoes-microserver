const express = require('express');
const { request, response } = require('express');

const app = express();

// app.locals.comments = [
// 	{movie_id: [		
// 		{id: 1, comment: 5828, user_name: 'Bob', data: Date.now()},
// 		{id: 1, comment: 5828, user_name: 'Bob', data: Date.now()},
// 		{id: 1, comment: 5828, user_name: 'Bob', data: Date.now()},},
// ]
app.locals.test = []
app.locals.usersFavorites = [
    {userID: 60, favorites:[475430]},
    {userID: 10, favorites:[603]}
] 
app.use(express.json());

app.set('port', process.env.POST || 3001);


app.get("/api/v1/favorites", (request, response) => {
    return response.status(200).json(app.locals.usersFavorites);
});

app.post("/api/v1/favorites", (request, response) => {
    const {userID, movieID} = request.body
    const user = app.locals.usersFavorites.find(user => user.userID === Number(userID));
    user.favorites.push(Number(movieID))
    return response.status(200).json(app.locals.usersFavorites);
});

app.listen(app.get('port'), () => {
    console.log(`We are now listening on port ${app.get('port')}`)
})