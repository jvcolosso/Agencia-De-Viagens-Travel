const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
const router = require('./source/routes');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});