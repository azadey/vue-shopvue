import { db } from '../utility/FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';


const productCollection = collection(db, 'product');

export default {
    async createProduct(productData){
        const docRef = await addDoc(productCollection, productData);

        return { id: docRef.id, ...productData};
    }
}
