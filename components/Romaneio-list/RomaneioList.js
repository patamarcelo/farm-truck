import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";
import { romaneioSelector } from "../../store/redux/selector";

import CardRomaneio from "../romaneio/CardTruck";

const renderRomaneioList = (itemData) => {
	return <CardRomaneio data={itemData.item} />;
};

const RomaneioList = () => {
	const data = useSelector(romaneioSelector);

	return (
		<FlatList
			data={data}
			keyExtractor={(item) => item.id}
			renderItem={renderRomaneioList}
			ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
		/>
	);
};

export default RomaneioList;
