export const load = async (event) => {
	return {
		user: event.locals.user
			? {
					id: event.locals.user.id,
					githubId: event.locals.user.githubId,
					username: event.locals.user.username,
				}
			: null,
	};
};
