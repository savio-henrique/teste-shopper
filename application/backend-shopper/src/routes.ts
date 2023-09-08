import { Router } from "express";
import ProductRoutes from "./controllers/ItemController";

const routes = Router();

const ProductCtr = ProductRoutes.getInstance();

// Routing

routes.get('/products', ProductCtr.index);
routes.get('/packs', ProductCtr.listPack);
routes.put('/products', ProductCtr.update)
export default routes;