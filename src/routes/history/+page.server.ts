interface Photo {
  id: string;
}

export const load = async (event) => {
	const picsumResponse = await event.fetch("https://picsum.photos/v2/list?limit=100");
	const list: Photo[] = await picsumResponse.json();
	return {
		data: list.map((photo, idx) => {
			const width = idx & 1 ? 1200 : 900;
			const height = idx & 1 ? 900 : 1200;
			return {
				width,
				height,
				url: `https://picsum.photos/id/${photo.id}/${width}/${height}`
			};
		})
	};
};
