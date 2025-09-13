import moment from "moment";

export const formatDate = (dateEntry) => {
	// const date = new Date(dateEntry);
	const date = moment(new Date(dateEntry)).format("DD/MM/YYYY HH:mm");
	// const day = date.getDate();
	// const year = date.getFullYear();
	// const month = date.getMonth();
	// const fullMonth = month + 1;
	// const formatDate = `${day}/${fullMonth}/${year}`;
	return date;
};

export const formatDateFirebase = (entry) => {
	const entrada = entry.appDate;
	let date = "";
	let atTime = "";
	if (typeof entrada === "object") {
		// console.log("dateEntryEntrada: ", entrada);
		const newDate = moment(
			new Date(entrada.seconds * 1000 + entrada.nanoseconds / 1000000)
		).format("DD/MM/YYYY - HH:mm");
		// const newDate = new Date(
		// entrada.seconds * 1000 + entrada.nanoseconds / 1000000
		// );
		date = newDate.split("-")[0];
		atTime = newDate.split("-")[1];
	} else {
		// console.log("dateEntry: ", entry);
		date = moment(entry).format("YYYY-MM-DD");
		// atTime = entrada.split("T")[1].split(".")[0];
		// console.log("intraDate: ", date);
		// atTime = date.toLocaleTimeString();
	}

	// const [year, month, day] = date.split("-");
	// const formatDate = [day, month, year].join("/");
	const dateF = `${date} - ${atTime}`;
	// const dateF = `${date} - `;
	// console.log("dateF", dateF);
	// const dateF = "-";
	return dateF;
};
