const express = require('express');

const app = express();

app.use(express.json());

app.set('port', process.env.POST || 3001);

app.listen(app.get('port'), () => {
    console.log(`We are now listening on port ${app.get('port')}`)
})