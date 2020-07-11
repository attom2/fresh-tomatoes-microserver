const express = require('express');
const app = express();
const cors = require('cors');
const { request, response } = require('express');

app.locals.allComments = {
	comments: [
		{ 475430: [		
			{user_id: 60, comment: 'This movie was awesome. I love Leo.', user_name: 'Charlie', date: 1519211811670},
			{user_id: 60, comment: 'Kept me on the edge of my seat. 98 minutes of wow.', user_name: 'Charlie', date: 1519211811670},
			{user_id: 40, comment: 'Didn\t care for it', user_name: 'Bob', date: 1519211811670}
		]},
		{ 338762: [		
			{user_id: 60, comment: 'This movie was awesome. I love Leo.', user_name: 'Charlie', date: 1519211811670},
			{user_id: 60, comment: 'Kept me on the edge of my seat. 98 minutes of wow.', user_name: 'Charlie', date: 1519211811670},
			{user_id: 40, comment: 'Didn\t care for it', user_name: 'Bob', date: 1519211811670}
		]},
	]
}

app.locals.test = []
app.locals.usersFavorites = [
  { user_id: 60, movie_ids: [475430, 451184, 554993] },
  { user_id: 10, movie_ids: [603] },
]; 
app.use(express.json());
app.use(cors());

app.set('port', process.env.POST || 3001);

app.get("/api/v1/favorites/", (request, response) => {
    return response.status(200).json(app.locals.usersFavorites);
});

app.get("/api/v1/favorites/:id", (request, response) => {
	const userID = request.params.id;
	const usersFavorites = app.locals.usersFavorites.find(user => user.user_id === Number(userID))
    return response.status(200).json(usersFavorites);
});

app.post("/api/v1/favorites", (request, response) => {
    const { userID, movieID } = request.body
	const user = app.locals.usersFavorites.find(user => user.user_id === Number(userID));
	if(!user) {
		return response.sendStatus(404);
	}
    user.movie_ids.push(Number(movieID));
    return response.status(200).json(app.locals.usersFavorites);
});

app.get("/api/v1/comments", (request, response) => {
	response.status(200).json(app.locals.comments);
});

app.get("/api/v1/comments/:movie_id", (request, response) => {
	const movieID = parseInt(request.params.movie_id);
	
	const foundMovie = app.locals.allComments.comments.find(movie => {
		let movieKey = parseInt(Object.keys(movie)[0])
		return movieKey === movieID
	});

	if (!foundMovie) response.sendStatus(404);

	response.status(200).json(foundMovie);
});

app.listen(app.get('port'), () => {
    console.log(`We are now listening on port ${app.get('port')}`)
})