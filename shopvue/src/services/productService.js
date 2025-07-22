import { db } from '../utility/FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';


const productCollection = collection(db, 'product');

export default {
    async createProduct(productData){
        const docRef = await addDoc(productCollection, productData);

        return { id: docRef.id, ...productData};
    },

    async getProducts() {
        const querySnapshot = await getDocs(productCollection);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getProductById(productId) {
        const docRef = doc(db, 'product', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('Product not found');
        }
    },

    async updateProduct(productId, productData) {
        const docRef = doc(db, 'product', productId);
        await updateDoc(docRef, productData);

        return { id: productId, ...productData };
    },

    async deleteProduct(productId) {
        const docRef = doc(db, 'product', productId);
        await deleteDoc(docRef);

        return { id: productId };
    }
}
