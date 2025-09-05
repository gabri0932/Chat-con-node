import {MongoClient } from "mongodb"
import 'dotenv/config' //para las variables de entornos del .env

const url = process.env.MONGO_URL
const database = process.env.DATABASE

let client;
let conecctionIsOpen = false;

