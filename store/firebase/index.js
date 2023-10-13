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

export const addRomaneioFirebase = async (romaneio) => {
	try {
		const docRef = await addDoc(collection(db, "truckmove"), {
			...romaneio
		});
		console.log("Documento Registrado com id: ", docRef.id);
		return docRef.id;
	} catch (err) {
		console.log("Erro ao salvar no db", err);
	}
};

const updateSingleDoc = async (idDoc) => {
	const documentUpdate = doc(db, "truckmove", idDoc);
	await updateDoc(documentUpdate, {
		id: idDoc
	});
};

export const getDocumentosFirebase = async (idForm) => {
	const q = query(collection(db, "truckmove"), where("id", "==", idForm));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, " => ", doc.data());
	});
	try {
		const response = await updateSingleDoc(idForm);
		console.log(response);
	} catch (err) {
		console.log("Erro ao editar o documento", idForm);
	}
};

export const getAllDocsFirebase = async (farm) => {
	const q = query(
		collection(db, "truckmove"),
		where("fazendaOrigem", "==", farm)
	);
	const querySnapshot = await getDocs(q);
	let allData = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, " => ", doc.data());
		allData.push(doc.data());
	});
	return allData;
};

export const getAndGenerateIdFirebase = async () => {
	const q = query(
		collection(db, "truckmove"),
		where("idApp", "!=", null),
		orderBy("idApp", "desc"),
		limit(1)
	);
	const querySnapshot = await getDocs(q);
	let allData = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, " => ", doc.data());
		allData.push(doc.data());
	});

	return allData;
};
