import Knex from "knex";

export async function seed(knex: Knex) {
    await knex("items").insert([
        { title: "Lights bubs", image: "bubs.svg" },
        { title: "Batties", image: "batties.svg" },
        { title: "Papers & Cardboards", image: "papers-cardboards.svg" },
        { title: "Electronic Waste", image: "eletronic.svg" },
        { title: "Organic Waste", image: "organic.svg" },
        { title: "Kitchen oil", image: "oil.svg" },
    ]);
}
