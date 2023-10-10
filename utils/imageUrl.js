export const ICON_URL = [
	{ title: "Feijão", uri: require("../constants/icons/beans2.png") },
	{ title: "Arroz", uri: require("../constants/icons/rice.png") },
	{ title: "Soja", uri: require("../constants/icons/soy.png") }
];

export const findImg = (data, icon) => {
	const newData = data.filter((data) => data.title === icon);
	return newData[0].uri;
};
