import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { loginUser } from "../utils/auth";
import { authUser } from "../store/firebase";

import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import { setUser, setProjetos, setUserAttr } from "../store/redux/romaneios";
import { useDispatch } from "react-redux";
function LoginScreen() {
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigation();
	const context = useContext(AuthContext);
	const dispatch = useDispatch();

	const loginUserhandler = async ({ email, password }) => {
		setIsLoading(true);
		try {
			const user = await authUser(email, password);
			context.authenticate(user.user.accessToken);
			dispatch(setUser(user.user));
			const pl = JSON.parse(user.user.reloadUserInfo.customAttributes);
			dispatch(setProjetos(pl.projetosLiberados));
			dispatch(setUserAttr(pl));
		} catch (error) {
			console.log("erro ao logar usuário", error);
			Alert.alert(
				"Erro ao Fazer Login!!",
				`Tente novamente mais tarde!! ${error}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <LoadingOverlay message={"Conectando você..."} />;
	}
	return <AuthContent isLogin onAuthenticate={loginUserhandler} />;
}

export default LoginScreen;
