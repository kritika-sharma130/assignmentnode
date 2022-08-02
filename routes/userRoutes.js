import userController from "../controllers/userController.js";
import bodyParser from 'body-parser';
import authMiddleware from '../middlewares/authMiddleware.js';

export default function userRouter(express) {
    const router = express.Router();

    router.route("/login").post(bodyParser.json(), userController().login);
    router.route("/signup").post(bodyParser.json(), userController().createUser);
    router.route("/send-email").post(bodyParser.json(), userController().sendEmail)
    router.route("/:id").get(authMiddleware().handleAuthentication, userController().getUser);
    router.route("/:id").post(authMiddleware().handleAuthentication, bodyParser.json(), userController().updateUser);
    router.route("/:id").delete(authMiddleware().handleAuthentication, userController().deleteUser);

    return router;
}