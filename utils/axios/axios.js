import axios from "axios";

// DAJNGO SERVER
const baseURL = "https://diamante-quality.up.railway.app/diamante/";
const baseURLdev = "http://localhost:8000/diamante/";

// NODE JS SERVER
const baseURLNode = "https://ubs-nodeserver.up.railway.app/romaneios/";
const baseURLdevNode = "http://localhost:5050/romaneios/";

const djangoApi = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURLdev : baseURL,
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Token ${process.env.EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`
	}
});


export const nodeServer = axios.create({
	baseURL:
		process.env.NODE_ENV !== "production" ? baseURLdevNode : baseURLNode,
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Token ${process.env.EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`
	}
});

export default nodeServer;
