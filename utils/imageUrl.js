export const ICON_URL = {
	"Feijão": require("../constants/icons/beans2.png"),
	"Arroz": require("../constants/icons/rice.png"),
	"Soja": require("../constants/icons/soy.png")
};

export const findImg = (data, icon) => {
	if (icon && ICON_URL[icon]) {
		return ICON_URL[icon]
	}
	return require("../constants/icons/question.png")
};
