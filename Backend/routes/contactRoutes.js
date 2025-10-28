import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getAllContacts, getContactFromDmList, searchContacts } from "../controllers/contactConteroller.js";


const contactRoutes = Router();


contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/get-contact-for-dm", verifyToken, getContactFromDmList);
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

getAllContacts


export default contactRoutes;
