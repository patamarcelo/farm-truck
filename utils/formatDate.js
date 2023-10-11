export const formatDate = (dateEntry) => {
	const date = new Date(dateEntry);
	console.log(date);
	const day = date.getDate();
	const year = date.getFullYear();
	const month = date.getMonth();
	const fullMonth = month + 1;
	const formatDate = `${day}/${fullMonth}/${year}`;
	return formatDate;
};
