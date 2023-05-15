import { addDoc, collection } from "firebase/firestore";
import firestore from "../firestore";

export const createSession = (gameName, ownerId) => {
  const sessionCollectionRef = collection(firestore, "sessions");
  addDoc(sessionCollectionRef, {
    owner: ownerId,
    name: gameName,
  });
};
