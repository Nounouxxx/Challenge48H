import express from "express";
import routes from "./routes/enigma_route.js"


var app = express();


app.use(express.json())
app.use(routes);

app.listen(4545, () => {
    console.log("Le serveur a correctement démarré.");
})