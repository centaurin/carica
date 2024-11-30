import {
	SQL,
	sql,
	type AnyColumn,
	type InferColumnsDataTypes,
	type InferSelectModel,
} from "drizzle-orm";
import type { PgTable, TableConfig } from "drizzle-orm/pg-core";

export const takeUniqueOrThrow = <T extends unknown[]>(values: T): T[number] | null => {
	if (values.length === 0) return null;
	if (values.length !== 1) throw new Error("Found non-unique value");
	return values[0];
};

export const jsonAgg = <T extends PgTable<TableConfig>>(table: T) => {
	return sql<InferSelectModel<T>[]>`json_agg(${table})`;
};

export const jsonAggBuildObject = <T extends Record<string, AnyColumn>>(shape: T) => {
	const shapeString = Object.entries(shape).reduce((chunks, [key, value]) => {
		if (chunks.length > 0) {
			chunks.push(sql.raw(`,`));
		}
		chunks.push(sql.raw(`'${key}',`));
		chunks.push(sql`${value}`);
		return chunks;
	}, [] as SQL[]);
	return sql<InferColumnsDataTypes<T>[]>`json_agg(json_build_object(${sql.join(shapeString)}))`;
};
