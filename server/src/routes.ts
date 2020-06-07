import express from "express";
import knex from "./database/connection";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/itemsController";

const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items", async (request, response) => {
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
        return {
            title: item.title,
            id: item.id,
            image_url: `http://localhost:5555/uploads/${item.image}`,
        };
    });

    return response.json(serializedItems);
});
routes.get("/items", itemsController.index);
routes.post("/points", pointsController.create);

export default routes;
