export const takeUniqueOrThrow = <T extends unknown[]>(values: T): T[number] | null => {
	if (values.length === 0) return null;
	if (values.length !== 1) throw new Error("Found non-unique value");
	return values[0];
};
