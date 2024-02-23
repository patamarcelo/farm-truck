import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	addDoc,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
	collRef,
	limit,
	orderBy
} from "firebase/firestore";

import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail
} from "firebase/auth";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
	REACT_APP_FIREBASE_API_KEY,
	REACT_APP_FIREBASE_AUTH_DOMAIN,
	REACT_APP_FIREBASE_PROJECT_ID,
	REACT_APP_FIREBASE_STORAGE_BUCKET,
	REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	REACT_APP_FIREBASE_APP_ID
} from "@env";

const firebaseConfig = {
	apiKey: REACT_APP_FIREBASE_API_KEY,
	authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// export { db };

export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
});

export const authUser = async (email, password) => {
	if (!email || !password) return;
	return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
	onAuthStateChanged(auth, callback);

export const triggerResetEmail = async (email) => {
	console.log("Password reset email sent");
	return await sendPasswordResetEmail(auth, email);
};

export const addRomaneioFirebase = async (romaneio) => {
	try {
		const docRef = await addDoc(collection(db, "truckmove"), {
			...romaneio
		});
		return docRef.id;
	} catch (err) {
		console.log("Erro ao salvar no db", err);
	}
};

export const getAndGenerateIdFirebase = async () => {
	const q = query(
		collection(db, "truckmove"),
		where("idApp", "!=", null),
		orderBy("idApp", "desc"),
		orderBy("relatorioColheita", "desc"),
		limit(1)
	);
	const querySnapshot = await getDocs(q);
	let allData = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		// console.log(doc.id, " => ", doc.data());
		allData.push(doc.data());
	});
	allData.forEach((data) => {
		console.log(data);
	});

	return allData[0];
};

const getLastRomaneioNUmber = async () => {
	const dataFirebase = await getAndGenerateIdFirebase();
	const lastNumber = dataFirebase.relatorioColheita;
	return lastNumber ? lastNumber : 0;
};

const updateSingleDoc = async (idDoc) => {
	const lastNumber = await getLastRomaneioNUmber();
	const documentUpdate = doc(db, "truckmove", idDoc);
	await updateDoc(documentUpdate, {
		id: idDoc,
		relatorioColheita: lastNumber + 1
	});
};

export const getDocumentosFirebase = async (idForm) => {
	try {
		const response = await updateSingleDoc(idForm);
	} catch (err) {
		console.log("Erro ao editar o documento", idForm);
	}
};

export const getAllDocsFirebase = async (farm) => {
	const q = query(
		collection(db, "truckmove"),
		where("fazendaOrigem", "in", farm),
		where("createdBy", "==", "App")
		// orderBy("relatorioColheita")
	);
	const querySnapshot = await getDocs(q);
	let allData = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		const newData = {
			...doc.data(),
			id: doc.id
		};
		allData.push(newData);
	});
	// console.log("allData", allData);
	return allData;
};

export const saveDataOnFirebaseAndUpdate = async (newData) => {
	try {
		const lastRomaneio = await getLastRomaneioNUmber();
		const updatedData = {
			...newData,
			relatorioColheita: lastRomaneio + 1
		};
		const response = await addRomaneioFirebase(updatedData);
		// if (response) {
		// 	await getDocumentosFirebase(response);
		return response;
		// }
	} catch (err) {
		console.log("erro ao salvar os dados", err);
	}
};
