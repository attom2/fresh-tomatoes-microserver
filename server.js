const express = require('express');
const app = express();
const cors = require('cors');
const { request, response } = require('express');

app.locals.allComments = {
	comments: [
		{ 475430: [		
			{user_id: 32, comment: 'This movie was awesome. I love Leo.', user_name: 'Dennis', date: 1519211811670},
			{user_id: 41, comment: 'Kept me on the edge of my seat. 98 minutes of wow.', user_name: 'Clark', date: 1519211811670},
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
  { user_id: 60, movie_ids: [475430, 451184, 554993, 603] },
  { user_id: 10, movie_ids: [603] },
]; 
app.use(express.json());
app.use(cors());

app.set('port', process.env.POST || 3001);

app.get("/api/v1/favorites/", (request, response) => {
    return response.status(200).json(app.locals.usersFavorites);
});

app.patch("/api/v1/favorites/", (request, response) => {
    const { user_id, movie_id }  = request.body;
	const user = app.locals.usersFavorites.find(user => user.user_id === Number(user_id));
	if(!user) {
		return response.status(404).send({
			error: `User ${Number(user_id)} not found. Expected format: {user_id: <number>, movie_id: <number> }!`,
		});
	} else if (user.movie_ids.includes(Number(movie_id))) {
		const indexToDelete = user.movie_ids.indexOf(Number(movie_id));
		user.movie_ids.splice(indexToDelete, 1);
		return response.status(200).json(user.movie_ids);
	} else if (!user.movie_ids.includes(Number(movie_id))) {
		return response.status(404).send({
			error: `User ${Number(user_id)} has not favorited the movie with movie_id ${movie_id}. Expected format: {user_id: <number>, movie_id: <number> }!`,
		});
	}
});

app.get("/api/v1/favorites/:id", (request, response) => {
	const userID = request.params.id;
	const usersFavorites = app.locals.usersFavorites.find(user => user.user_id === Number(userID))
    return response.status(200).json(usersFavorites);
});

app.post("/api/v1/favorites", (request, response) => {
    const { user_id, movie_id } = request.body;
	const user = app.locals.usersFavorites.find(user => user.user_id === Number(user_id));
	if(!user) {
		return response.status(404).send({
			error: `Expected format: {user_id: <number>, movie_id: <number> }!`,
		});
	} else if (!user.movie_ids.includes(Number(movie_id))) {
		user.movie_ids.push(Number(movie_id));
	}
    return response.status(200).json(user.movie_ids);
});

app.get("api/v1/asdf", (request, response) => {
	// const { user_id, movie_id }  = request.body;
	// const user = app.locals.usersFavorites.find(user => user.user_id === Number(user_id));
	// if(!user) {
	// 	return response.sendStatus(404);
	// } else if (user.movie_ids.includes(Number(movie_id))) {
	// 	const indexToDelete = user.movie_ids.indexOf(movie_id);
	// 	user.movie_id.splice(indexToDelete, i);
	// }
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

app.post("/api/v1/comments/:movie_id", (request, response) => {
	const {movie_id, user_id, user_name, comment} = request.body;
	const movieID = parseInt(movie_id);
	const date = Date.now();
	const addedMovie = { user_id, comment, user_name, date };

	for (let requiredParameter of ['comment', 'user_id', 'user_name', 'movie_id']) {
		if (!request.body[requiredParameter]) {
			return response.status(422).send({
				error: `Expected format: {user_id: <integer>, comment: <string>, user_name: <string>, movie_id: <integer>}. Missing a required parameter of ${requiredParameter}!`
			})
		}
	}

	let currentCommentKeys = app.locals.allComments.comments.map(movie => parseInt(Object.keys(movie)));

	if (!currentCommentKeys.includes(movieID)) app.locals.allComments.comments.push({[movieID]: [addedMovie]});
	
	const foundMovie = app.locals.allComments.comments.find(movie => {
		const movieKey = parseInt(Object.keys(movie)[0])
		return movieKey === movieID
	})
	const foundMovieIndex = app.locals.allComments.comments.indexOf(foundMovie);
	const foundMovieKey = Object.keys(foundMovie);

	if (currentCommentKeys.includes(movieID)) app.locals.allComments.comments[foundMovieIndex][foundMovieKey].push(addedMovie);

	return response.status(200).json(app.locals.allComments.comments[foundMovieIndex][foundMovieKey]);
})

app.listen(app.get('port'), () => {
    console.log(`We are now listening on port ${app.get('port')}`)
})