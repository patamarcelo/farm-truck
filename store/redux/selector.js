export const romaneioSelector = (state) => {
	console.log("from State: ", state.romaneios.cargas);
	return state.romaneios.cargas;
};

export const romaneiosFarmSelector = (state) => {
	const romaneios = state.romaneios.romaneiosFarm;
	const format = romaneios.map((data) => {
		let createdAtForm;
		if (typeof data.createdAt === "object") {
			createdAtForm = new Date(
				data.createdAt.seconds * 1000 +
					data.createdAt.nanoseconds / 1000000
			);
		} else {
			createdAtForm = new Date(data.createdAt);
		}
		const sortDate =
			typeof data.appDate === "object"
				? new Date(
						data.appDate.seconds * 1000 +
							data.appDate.nanoseconds / 1000000
				  )
				: new Date(data.appDate);
		return { ...data, sortDate, createdAtForm };
	});
	return format;
};
