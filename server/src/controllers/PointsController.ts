import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
    async index(request: Request, response: Response) {
        const { city, zip, items } = request.query;

        const parsedItems = String(items)
            .split(",")
            .map((item) => Number(item.trim()));

        const points = await knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", parsedItems)
            .where("city", String(city))
            .where("zip", String(zip))
            .distinct()
            .select("points.*");

        const serializedPoints = points.map((point) => {
            return {
                ...point,
                image_url: `http://192.168.0.3:5555/uploads/${point.image}`,
            };
        });

        return response.json(serializedPoints);

        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex("points").where("id", id).first();

        if (!point) {
            return response.status(400).json({ message: "Point not found." });
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.3:5555/uploads/${point.image}`,
        };

        /**SELECT * FROM items
         * JOIN point_items ON items.id = point_items.item_id
         * WHERE point_items.point_id = { id }
         */

        const items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", id)
            .select("items.title");

        return response.json({ point: serializedPoint, items });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            zip,
            items,
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image:
                "https://images.unsplash.com/photo-1584680226833-0d680d0a0794?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            zip,
        };

        const insertedIds = await trx("points").insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(",")
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                };
            });
        await trx("point_items").insert(pointItems);
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
        });
    }
}

export default PointsController;
