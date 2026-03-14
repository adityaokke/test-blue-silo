import { Router } from "express";

import * as userController from "../../../modules/users/controller";
import { authenticate } from "../middleware";

const router = Router();

router.get("/", authenticate, userController.getUsers);

export default router;