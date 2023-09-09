import { Router } from "express";
import ProductRoutes from "./controllers/ItemController";
import bodyParser from "body-parser";

const routes = Router();

const ProductCtr = ProductRoutes.getInstance();

// Routing

routes.get('/products', ProductCtr.index);
routes.get('/packs', ProductCtr.listPack);
routes.put('/products', bodyParser.json({limit:'10mb'}), ProductCtr.update);
routes.put('/validate', bodyParser.json(), ProductCtr.validate)

export default routes;