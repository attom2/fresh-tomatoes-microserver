const express = require('express');
const app = express();
const cors = require('cors');
const { request, response } = require('express');

app.locals.comments = {
	comments: [
		{ 475430: [		
			{user_id: 60, comment: 'This movie was awesome. I love Leo.', user_name: 'Charlie', data: Date.now()},
			{user_id: 60, comment: 'Kept me on the edge of my seat. 98 minutes of wow.', user_name: 'Charlie', data: Date.now()},
			{user_id: 40, comment: 'Didn\t care for it', user_name: 'Bob', data: Date.now()}
		]},
		{ 338762: [		
			{user_id: 60, comment: 'This movie was awesome. I love Leo.', user_name: 'Charlie', data: Date.now()},
			{user_id: 60, comment: 'Kept me on the edge of my seat. 98 minutes of wow.', user_name: 'Charlie', data: Date.now()},
			{user_id: 40, comment: 'Didn\t care for it', user_name: 'Bob', data: Date.now()}
		]},
	]
}

app.locals.test = []
app.locals.usersFavorites = [
    {userID: 60, favorites:[475430]},
    {userID: 10, favorites:[603]}
] 
app.use(express.json());
app.use(cors());

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

app.get("/api/v1/comments", (request, response) => {
	response.status(200).json(app.locals.comments);
});

app.get("/api/v1/comments/:movie_id", (request, response) => {
	const movieID = parseInt(request.params.movie_id);
	const commentMovieKeys = Object.values(app.locals.comments.comments);
	
	const foundMovie = app.locals.comments.comments.find(movie => {
		let movieKey = parseInt(Object.keys(movie)[0])
		return movieKey === movieID
	});

	if (!foundMovie) response.sendStatus(404);

	response.status(205).json(foundMovie);
});

app.listen(app.get('port'), () => {
    console.log(`We are now listening on port ${app.get('port')}`)
})