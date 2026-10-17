import { createRequire as __wkfCreateRequire } from "node:module";
if (typeof require === "undefined") globalThis.require = __wkfCreateRequire(import.meta.url);
import { cs, export_types } from "./neondatabase__serverless.mjs";
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/entity.js
const entityKind = Symbol.for("drizzle:entityKind");
function is(value, type) {
	if (!value || typeof value !== "object") return false;
	if (value instanceof type) return true;
	if (!Object.prototype.hasOwnProperty.call(type, entityKind)) throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
	let cls = Object.getPrototypeOf(value)?.constructor;
	if (cls) while (cls) {
		if (entityKind in cls && cls[entityKind] === type[entityKind]) return true;
		cls = Object.getPrototypeOf(cls);
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
	static [entityKind] = "QueryPromise";
	[Symbol.toStringTag] = "QueryPromise";
	catch(onRejected) {
		return this.then(void 0, onRejected);
	}
	finally(onFinally) {
		return this.then((value) => {
			onFinally?.();
			return value;
		}, (reason) => {
			onFinally?.();
			throw reason;
		});
	}
	then(onFulfilled, onRejected) {
		return this.execute().then(onFulfilled, onRejected);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/column-common.js
const OriginalColumn = Symbol.for("drizzle:OriginalColumn");
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/column.js
const noop = (v) => v;
noop.isNoop = true;
var Column = class {
	static [entityKind] = "Column";
	/** @internal */
	codec;
	name;
	keyAsName;
	primary;
	notNull;
	default;
	defaultFn;
	onUpdateFn;
	hasDefault;
	isUnique;
	uniqueName;
	uniqueType;
	dataType;
	columnType;
	enumValues = void 0;
	generated = void 0;
	generatedIdentity = void 0;
	length;
	isLengthExact;
	isAlias;
	/** @internal */
	config;
	/** @internal */
	table;
	/** @internal */
	onInit() {}
	constructor(table, config) {
		this.config = config;
		this.onInit();
		this.table = table;
		this.name = config.name;
		this.isAlias = false;
		this.keyAsName = config.keyAsName;
		this.notNull = config.notNull;
		this.default = config.default;
		this.defaultFn = config.defaultFn;
		this.onUpdateFn = config.onUpdateFn;
		this.hasDefault = config.hasDefault;
		this.primary = config.primaryKey;
		this.isUnique = config.isUnique;
		this.uniqueName = config.uniqueName;
		this.uniqueType = config.uniqueType;
		this.dataType = config.dataType;
		this.columnType = config.columnType;
		this.generated = config.generated;
		this.generatedIdentity = config.generatedIdentity;
		this.length = config["length"];
		this.isLengthExact = config["isLengthExact"];
	}
	mapFromDriverValue = noop;
	mapToDriverValue = noop;
	/** @internal */
	postBuild() {
		return this;
	}
	/** @internal */
	shouldDisableInsert() {
		return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
	}
	/** @internal */
	[OriginalColumn]() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/table.utils.js
/** @internal */
const TableName = Symbol.for("drizzle:Name");
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/table.js
/** @internal */
const TableSchema = Symbol.for("drizzle:Schema");
/** @internal */
const TableColumns = Symbol.for("drizzle:Columns");
/** @internal */
const ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
/** @internal */
const OriginalName = Symbol.for("drizzle:OriginalName");
/** @internal */
const BaseName = Symbol.for("drizzle:BaseName");
/** @internal */
const IsAlias = Symbol.for("drizzle:IsAlias");
/** @internal */
const ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
const IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
	static [entityKind] = "Table";
	/** @internal */
	static Symbol = {
		Name: TableName,
		Schema: TableSchema,
		OriginalName,
		Columns: TableColumns,
		ExtraConfigColumns,
		BaseName,
		IsAlias,
		ExtraConfigBuilder
	};
	/**
	* @internal
	* Can be changed if the table is aliased.
	*/
	[TableName];
	/**
	* @internal
	* Used to store the original name of the table, before any aliasing.
	*/
	[OriginalName];
	/** @internal */
	[TableSchema];
	/** @internal */
	[TableColumns];
	/** @internal */
	[ExtraConfigColumns];
	/**
	*  @internal
	* Used to store the table name before the transformation via the `tableCreator` functions.
	*/
	[BaseName];
	/** @internal */
	[IsAlias] = false;
	/** @internal */
	[IsDrizzleTable] = true;
	/** @internal */
	[ExtraConfigBuilder] = void 0;
	constructor(name, schema, baseName) {
		this[TableName] = this[OriginalName] = name;
		this[TableSchema] = schema;
		this[BaseName] = baseName;
	}
};
function getTableName(table) {
	return table[TableName];
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/subquery.js
var Subquery = class {
	static [entityKind] = "Subquery";
	constructor(sql, fields, alias, isWith = false, usedTables = []) {
		this._ = {
			brand: "Subquery",
			sql,
			selectedFields: fields,
			alias,
			isWith,
			usedTables
		};
	}
};
var WithSubquery = class extends Subquery {
	static [entityKind] = "WithSubquery";
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
	return fn(...args);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/tracing.js
/** @internal */
const tracer = { startActiveSpan(name, fn) {
	return fn();
} };
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/view-common.js
const ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
	return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
	const result = {
		sql: "",
		params: []
	};
	for (const query of queries) {
		result.sql += query.sql;
		result.params.push(...query.params);
	}
	return result;
}
function _mergeQueries(queries) {
	const result = {
		sql: "",
		params: []
	};
	const sqls = [];
	for (const query of queries) {
		sqls.push(query.sql);
		result.params.push(...query.params);
	}
	result._sql = Object.assign(sqls, { raw: sqls });
	return result;
}
var StringChunk = class {
	static [entityKind] = "StringChunk";
	value;
	constructor(value) {
		this.value = Array.isArray(value) ? value : [value];
	}
	getSQL() {
		return new SQL([this]);
	}
};
var SQL = class SQL {
	static [entityKind] = "SQL";
	/** @internal */
	decoder = noopDecoder;
	/** @internal */
	shouldInlineParams = false;
	/** @internal */
	usedTables = [];
	constructor(queryChunks) {
		this.queryChunks = queryChunks;
		for (const chunk of queryChunks) if (is(chunk, Table)) {
			const schemaName = chunk[Table.Symbol.Schema];
			this.usedTables.push(schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]);
		}
	}
	append(query) {
		this.queryChunks.push(...query.queryChunks);
		return this;
	}
	toQuery(config) {
		return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
			const query = this.buildQueryFromSourceParams(this.queryChunks, config);
			span?.setAttributes({
				"drizzle.query.text": query.sql,
				"drizzle.query.params": JSON.stringify(query.params)
			});
			return query;
		});
	}
	buildQueryFromSourceParams(chunks, _config) {
		const config = Object.assign({}, _config, {
			inlineParams: _config.inlineParams || this.shouldInlineParams,
			paramStartIndex: _config.paramStartIndex || { value: 0 }
		});
		const { escapeName, escapeParam, codecs, inlineParams, paramStartIndex, invokeSource } = config;
		const mappedChunks = chunks.map((chunk) => {
			if (is(chunk, StringChunk)) return {
				sql: chunk.value.join(""),
				params: []
			};
			if (is(chunk, Name)) return {
				sql: escapeName(chunk.value),
				params: []
			};
			if (chunk === void 0) return {
				sql: "",
				params: []
			};
			if (Array.isArray(chunk)) {
				const result = [new StringChunk("(")];
				for (const [i, p] of chunk.entries()) {
					result.push(p);
					if (i < chunk.length - 1) result.push(new StringChunk(", "));
				}
				result.push(new StringChunk(")"));
				return this.buildQueryFromSourceParams(result, config);
			}
			if (is(chunk, SQL)) return this.buildQueryFromSourceParams(chunk.queryChunks, {
				...config,
				inlineParams: inlineParams || chunk.shouldInlineParams
			});
			if (is(chunk, Table)) {
				const schemaName = chunk[Table.Symbol.Schema];
				const tableName = chunk[Table.Symbol.Name];
				if (invokeSource === "mssql-view-with-schemabinding") return {
					sql: (schemaName === void 0 ? escapeName("dbo") : escapeName(schemaName)) + "." + escapeName(tableName),
					params: []
				};
				return {
					sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
					params: []
				};
			}
			if (is(chunk, Column)) {
				const columnName = chunk.name;
				if (_config.invokeSource === "indexes") return {
					sql: escapeName(columnName),
					params: []
				};
				const schemaName = invokeSource === "mssql-check" ? void 0 : chunk.table[Table.Symbol.Schema];
				return {
					sql: chunk.isAlias ? escapeName(chunk.name) : chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
					params: []
				};
			}
			if (is(chunk, View)) {
				const schemaName = chunk[ViewBaseConfig].schema;
				const viewName = chunk[ViewBaseConfig].name;
				return {
					sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
					params: []
				};
			}
			if (is(chunk, Param)) {
				if (is(chunk.value, SQL)) return this.buildQueryFromSourceParams([chunk.value], config);
				const useCodecs = codecs && is(chunk.encoder, Column);
				if (is(chunk.value, Placeholder)) {
					const escaped = escapeParam(paramStartIndex.value++, chunk);
					chunk.codec = useCodecs ? (value) => codecs.apply(chunk.encoder, "normalizeParam", value) : void 0;
					return {
						sql: useCodecs ? codecs.apply(chunk.encoder, "castParam", escaped) : escaped,
						params: [chunk]
					};
				}
				let mappedValue;
				if (chunk.value === null) mappedValue = chunk.value;
				else {
					mappedValue = chunk.encoder.mapToDriverValue.isNoop ? chunk.value : chunk.encoder.mapToDriverValue(chunk.value);
					if (is(mappedValue, SQL)) return this.buildQueryFromSourceParams([mappedValue], config);
					if (useCodecs) mappedValue = codecs.apply(chunk.encoder, "normalizeParam", mappedValue);
				}
				if (inlineParams) return {
					sql: this.mapInlineParam(mappedValue, config),
					params: []
				};
				const escaped = escapeParam(paramStartIndex.value++, mappedValue);
				return {
					sql: useCodecs ? codecs.apply(chunk.encoder, "castParam", escaped) : escaped,
					params: [mappedValue]
				};
			}
			if (is(chunk, Placeholder)) return {
				sql: escapeParam(paramStartIndex.value++, chunk),
				params: [chunk]
			};
			if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== void 0) return {
				sql: (chunk.origin !== void 0 ? escapeName(chunk.origin) + "." : "") + escapeName(chunk.fieldAlias),
				params: []
			};
			if (is(chunk, Subquery)) {
				if (chunk._.isWith) return {
					sql: escapeName(chunk._.alias),
					params: []
				};
				return this.buildQueryFromSourceParams([
					new StringChunk("("),
					chunk._.sql,
					new StringChunk(") "),
					new Name(chunk._.alias)
				], config);
			}
			if (typeof chunk === "function" && "enumName" in chunk) {
				if ("schema" in chunk && chunk.schema) return {
					sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName),
					params: []
				};
				return {
					sql: escapeName(chunk.enumName),
					params: []
				};
			}
			if (isSQLWrapper(chunk)) {
				if (chunk.shouldOmitSQLParens?.()) return this.buildQueryFromSourceParams([chunk.getSQL()], config);
				return this.buildQueryFromSourceParams([
					new StringChunk("("),
					chunk.getSQL(),
					new StringChunk(")")
				], config);
			}
			if (inlineParams) return {
				sql: this.mapInlineParam(chunk, config),
				params: []
			};
			return {
				sql: escapeParam(paramStartIndex.value++, chunk),
				params: [chunk]
			};
		});
		if (_config.tagged) return _mergeQueries(mappedChunks);
		return mergeQueries(mappedChunks);
	}
	mapInlineParam(chunk, { escapeString }) {
		if (chunk === null) return "null";
		if (typeof chunk === "number" || typeof chunk === "boolean" || typeof chunk === "bigint") return chunk.toString();
		if (typeof chunk === "string") return escapeString(chunk);
		if (typeof chunk === "object") {
			const mappedValueAsString = chunk.toString();
			if (mappedValueAsString === "[object Object]") return escapeString(JSON.stringify(chunk));
			return escapeString(mappedValueAsString);
		}
		throw new Error("Unexpected param value: " + chunk);
	}
	getSQL() {
		return this;
	}
	as(alias) {
		if (alias === void 0) return this;
		return new SQL.Aliased(this, alias);
	}
	mapWith(decoder) {
		this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
		return this;
	}
	nullable() {
		return this;
	}
	inlineParams() {
		this.shouldInlineParams = true;
		return this;
	}
	/**
	* This method is used to conditionally include a part of the query.
	*
	* @param condition - Condition to check
	* @returns itself if the condition is `true`, otherwise `undefined`
	*/
	if(condition) {
		return condition ? this : void 0;
	}
};
/**
* Any DB name (table, column, index etc.)
*/
var Name = class {
	static [entityKind] = "Name";
	brand;
	constructor(value) {
		this.value = value;
	}
	getSQL() {
		return new SQL([this]);
	}
};
function isDriverValueEncoder(value) {
	return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
const noopDecoder = { mapFromDriverValue: (value) => value };
noopDecoder.mapFromDriverValue.isNoop = true;
const noopEncoder = { mapToDriverValue: (value) => value };
noopEncoder.mapToDriverValue.isNoop = true;
({
	...noopDecoder,
	...noopEncoder
});
/** Parameter value that is optionally bound to an encoder (for example, a column). */
var Param = class {
	static [entityKind] = "Param";
	brand;
	/**
	* @param value - Parameter value
	* @param encoder - Encoder to convert the value to a driver parameter
	*/
	constructor(value, encoder = noopEncoder, codec) {
		this.value = value;
		this.encoder = encoder;
		this.codec = codec;
	}
	getSQL() {
		return new SQL([this]);
	}
};
function sql(strings, ...params) {
	const queryChunks = [];
	if (params.length > 0 || strings.length > 0 && strings[0] !== "") queryChunks.push(new StringChunk(strings[0]));
	for (const [paramIndex, param] of params.entries()) queryChunks.push(param, new StringChunk(strings[paramIndex + 1]));
	return new SQL(queryChunks);
}
(function(_sql) {
	function empty() {
		return new SQL([]);
	}
	_sql.empty = empty;
	function fromList(list) {
		return new SQL(list);
	}
	_sql.fromList = fromList;
	function raw(str) {
		return new SQL([new StringChunk(str)]);
	}
	_sql.raw = raw;
	function join(chunks, separator) {
		const result = [];
		for (const [i, chunk] of chunks.entries()) {
			if (i > 0 && separator !== void 0) result.push(separator);
			result.push(chunk);
		}
		return new SQL(result);
	}
	_sql.join = join;
	function identifier(value) {
		return new Name(value);
	}
	_sql.identifier = identifier;
	function placeholder(name) {
		return new Placeholder(name);
	}
	_sql.placeholder = placeholder;
	function param(value, encoder) {
		return new Param(value, encoder);
	}
	_sql.param = param;
	function comment(input) {
		const encoded = sqlCommenter(input);
		if (!encoded.length) return void 0;
		return sql.raw(encoded);
	}
	_sql.comment = comment;
})(sql || (sql = {}));
function sqlCommenter(input) {
	const encoded = sqlCommenter.encodeInput(input);
	if (!encoded.length) return "";
	return `/*${encoded}*/`;
}
(function(_sqlCommenter) {
	function merge(input1, input2) {
		let encoded;
		if (typeof input1 === "object" && typeof input2 === "object") encoded = encodeInput({
			...input1,
			...input2
		});
		else if (input1 && input2) encoded = [encodeInput(input1), encodeInput(input2)].filter((i) => i.length).join(",");
		else if (input2) encoded = encodeInput(input2);
		else if (input1) encoded = encodeInput(input1);
		else return "";
		if (!encoded.length) return "";
		return `/*${encoded}*/`;
	}
	_sqlCommenter.merge = merge;
	function encodeInput(input) {
		if (typeof input === "string") {
			if (!input.length) return input;
			return sanitizeStringInput(input);
		}
		const parts = [];
		for (const [key, value] of Object.entries(input)) {
			if (value === null || value === void 0 || value === "") continue;
			const encodedKey = sanitizeObjectElement(key);
			const encodedValue = sanitizeObjectElement(String(value));
			parts.push(`${encodedKey}='${encodedValue}'`);
		}
		if (!parts.length) return "";
		return parts.sort().join(",");
	}
	_sqlCommenter.encodeInput = encodeInput;
	function sanitizeObjectElement(key) {
		return encodeURIComponent(key).replace(/'/g, `\\'`);
	}
	_sqlCommenter.sanitizeObjectElement = sanitizeObjectElement;
	function sanitizeStringInput(input) {
		return input.replace(/\/\*/g, "/ *").replace(/\*\//g, "* /");
	}
	_sqlCommenter.sanitizeStringInput = sanitizeStringInput;
})(sqlCommenter || (sqlCommenter = {}));
(function(_SQL) {
	class Aliased {
		static [entityKind] = "SQL.Aliased";
		/** @internal */
		isSelectionField = false;
		/** @internal */
		origin;
		constructor(sql, fieldAlias) {
			this.sql = sql;
			this.fieldAlias = fieldAlias;
		}
		getSQL() {
			return this.sql;
		}
		/** @internal */
		clone() {
			return new Aliased(this.sql, this.fieldAlias);
		}
	}
	_SQL.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
	static [entityKind] = "Placeholder";
	constructor(name) {
		this.name = name;
	}
	getSQL() {
		return new SQL([this]);
	}
};
function fillPlaceholders(params, values) {
	return params.map((p) => {
		if (is(p, Placeholder)) {
			if (!(p.name in values)) throw new Error(`No value for placeholder "${p.name}" was provided`);
			return values[p.name];
		}
		if (is(p, Param) && is(p.value, Placeholder)) {
			if (!(p.value.name in values)) throw new Error(`No value for placeholder "${p.value.name}" was provided`);
			const value = values[p.value.name];
			if (value === null) return value;
			const mapped = p.encoder.mapToDriverValue.isNoop ? value : p.encoder.mapToDriverValue(value);
			return p.codec ? p.codec(mapped) : mapped;
		}
		return p;
	});
}
const IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
	static [entityKind] = "View";
	/** @internal */
	[ViewBaseConfig];
	/** @internal */
	[IsDrizzleView] = true;
	/** @internal */
	get [TableName]() {
		return this[ViewBaseConfig].name;
	}
	/** @internal */
	get [TableSchema]() {
		return this[ViewBaseConfig].schema;
	}
	/** @internal */
	get [IsAlias]() {
		return this[ViewBaseConfig].isAlias;
	}
	/** @internal */
	get [OriginalName]() {
		return this[ViewBaseConfig].originalName;
	}
	/** @internal */
	get [TableColumns]() {
		return this[ViewBaseConfig].selectedFields;
	}
	constructor({ name, schema, selectedFields, query }) {
		this[ViewBaseConfig] = {
			name,
			originalName: name,
			schema,
			selectedFields,
			query,
			isExisting: !query,
			isAlias: false
		};
	}
};
Column.prototype.getSQL = function() {
	return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
	return new SQL([this]);
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
	static [entityKind] = "DrizzleError";
	constructor({ message, cause }) {
		super(message);
		this.name = "DrizzleError";
		this.cause = cause;
	}
};
var DrizzleQueryError = class DrizzleQueryError extends Error {
	static [entityKind] = "DrizzleQueryError";
	constructor(query, params, cause) {
		super(`Failed query: ${query}\nparams: ${params}`);
		this.query = query;
		this.params = params;
		this.cause = cause;
		this.name = "DrizzleQueryError";
		Error.captureStackTrace(this, DrizzleQueryError);
		if (cause) this.cause = cause;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
	if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) return new Param(value, column);
	return value;
}
/**
* Test that two values are equal.
*
* Remember that the SQL standard dictates that
* two NULL values are not equal, so if you want to test
* whether a value is null, you may want to use
* `isNull` instead.
*
* ## Examples
*
* ```ts
* // Select cars made by Ford
* db.select().from(cars)
*   .where(eq(cars.make, 'Ford'))
* ```
*
* @see isNull for a way to test equality to NULL.
*/
const eq = (left, right) => {
	return sql`${left} = ${bindIfParam(right, left)}`;
};
/**
* Test that two values are not equal.
*
* Remember that the SQL standard dictates that
* two NULL values are not equal, so if you want to test
* whether a value is not null, you may want to use
* `isNotNull` instead.
*
* ## Examples
*
* ```ts
* // Select cars not made by Ford
* db.select().from(cars)
*   .where(ne(cars.make, 'Ford'))
* ```
*
* @see isNotNull for a way to test whether a value is not null.
*/
const ne = (left, right) => {
	return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions.map((c) => sql`(${c})`), new StringChunk(" and ")),
		new StringChunk(")")
	]);
}
function or(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions.map((c) => sql`(${c})`), new StringChunk(" or ")),
		new StringChunk(")")
	]);
}
/**
* Negate the meaning of an expression using the `not` keyword.
*
* ## Examples
*
* ```ts
* // Select cars _not_ made by GM or Ford.
* db.select().from(cars)
*   .where(not(inArray(cars.make, ['GM', 'Ford'])))
* ```
*/
function not(condition) {
	return is(condition, SQL) ? sql`not (${condition})` : sql`not ${condition}`;
}
/**
* Test that the first expression passed is greater than
* the second expression.
*
* ## Examples
*
* ```ts
* // Select cars made after 2000.
* db.select().from(cars)
*   .where(gt(cars.year, 2000))
* ```
*
* @see gte for greater-than-or-equal
*/
const gt = (left, right) => {
	return sql`${left} > ${bindIfParam(right, left)}`;
};
/**
* Test that the first expression passed is greater than
* or equal to the second expression. Use `gt` to
* test whether an expression is strictly greater
* than another.
*
* ## Examples
*
* ```ts
* // Select cars made on or after 2000.
* db.select().from(cars)
*   .where(gte(cars.year, 2000))
* ```
*
* @see gt for a strictly greater-than condition
*/
const gte = (left, right) => {
	return sql`${left} >= ${bindIfParam(right, left)}`;
};
/**
* Test that the first expression passed is less than
* the second expression.
*
* ## Examples
*
* ```ts
* // Select cars made before 2000.
* db.select().from(cars)
*   .where(lt(cars.year, 2000))
* ```
*
* @see lte for less-than-or-equal
*/
const lt = (left, right) => {
	return sql`${left} < ${bindIfParam(right, left)}`;
};
/**
* Test that the first expression passed is less than
* or equal to the second expression.
*
* ## Examples
*
* ```ts
* // Select cars made before 2000.
* db.select().from(cars)
*   .where(lte(cars.year, 2000))
* ```
*
* @see lt for a strictly less-than condition
*/
const lte = (left, right) => {
	return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`false`;
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`true`;
		return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} not in ${bindIfParam(values, column)}`;
}
/**
* Test whether an expression is NULL. By the SQL standard,
* NULL is neither equal nor not equal to itself, so
* it's recommended to use `isNull` and `notIsNull` for
* comparisons to NULL.
*
* ## Examples
*
* ```ts
* // Select cars that have no discontinuedAt date.
* db.select().from(cars)
*   .where(isNull(cars.discontinuedAt))
* ```
*
* @see isNotNull for the inverse of this test
*/
function isNull(value) {
	return sql`(${value} is null)`;
}
/**
* Test whether an expression is not NULL. By the SQL standard,
* NULL is neither equal nor not equal to itself, so
* it's recommended to use `isNull` and `notIsNull` for
* comparisons to NULL.
*
* ## Examples
*
* ```ts
* // Select cars that have been discontinued.
* db.select().from(cars)
*   .where(isNotNull(cars.discontinuedAt))
* ```
*
* @see isNull for the inverse of this test
*/
function isNotNull(value) {
	return sql`(${value} is not null)`;
}
/**
* Test whether a subquery evaluates to have any rows.
*
* ## Examples
*
* ```ts
* // Users whose `homeCity` column has a match in a cities
* // table.
* db
*   .select()
*   .from(users)
*   .where(
*     exists(db.select()
*       .from(cities)
*       .where(eq(users.homeCity, cities.id))),
*   );
* ```
*
* @see notExists for the inverse of this test
*/
function exists(subquery) {
	return sql`exists ${subquery}`;
}
/**
* Test whether a subquery doesn't include any result
* rows.
*
* ## Examples
*
* ```ts
* // Users whose `homeCity` column doesn't match
* // a row in the cities table.
* db
*   .select()
*   .from(users)
*   .where(
*     notExists(db.select()
*       .from(cities)
*       .where(eq(users.homeCity, cities.id))),
*   );
* ```
*
* @see exists for the inverse of this test
*/
function notExists(subquery) {
	return sql`not exists ${subquery}`;
}
function between(column, min, max) {
	return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function notBetween(column, min, max) {
	return sql`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
/**
* Compare a column to a pattern, which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* ## Examples
*
* ```ts
* // Select all cars with 'Turbo' in their names.
* db.select().from(cars)
*   .where(like(cars.name, '%Turbo%'))
* ```
*
* @see ilike for a case-insensitive version of this condition
*/
function like(column, value) {
	return sql`${column} like ${value}`;
}
/**
* The inverse of like - this tests that a given column
* does not match a pattern, which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* ## Examples
*
* ```ts
* // Select all cars that don't have "ROver" in their name.
* db.select().from(cars)
*   .where(notLike(cars.name, '%Rover%'))
* ```
*
* @see like for the inverse condition
* @see notIlike for a case-insensitive version of this condition
*/
function notLike(column, value) {
	return sql`${column} not like ${value}`;
}
/**
* Case-insensitively compare a column to a pattern,
* which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* Unlike like, this performs a case-insensitive comparison.
*
* ## Examples
*
* ```ts
* // Select all cars with 'Turbo' in their names.
* db.select().from(cars)
*   .where(ilike(cars.name, '%Turbo%'))
* ```
*
* @see like for a case-sensitive version of this condition
*/
function ilike(column, value) {
	return sql`${column} ilike ${value}`;
}
/**
* The inverse of ilike - this case-insensitively tests that a given column
* does not match a pattern, which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* ## Examples
*
* ```ts
* // Select all cars that don't have "Rover" in their name.
* db.select().from(cars)
*   .where(notLike(cars.name, '%Rover%'))
* ```
*
* @see ilike for the inverse condition
* @see notLike for a case-sensitive version of this condition
*/
function notIlike(column, value) {
	return sql`${column} not ilike ${value}`;
}
function arrayContains(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("arrayContains requires at least one value");
		const par = bindIfParam(values, column);
		return sql`${column} @> ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
	}
	return sql`${column} @> ${bindIfParam(values, column)}`;
}
function arrayContained(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("arrayContained requires at least one value");
		const par = bindIfParam(values, column);
		return sql`${column} <@ ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
	}
	return sql`${column} <@ ${bindIfParam(values, column)}`;
}
function arrayOverlaps(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("arrayOverlaps requires at least one value");
		const par = bindIfParam(values, column);
		return sql`${column} && ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
	}
	return sql`${column} && ${bindIfParam(values, column)}`;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/sql/expressions/select.js
/**
* Used in sorting, this specifies that the given
* column or expression should be sorted in ascending
* order. By the SQL standard, ascending order is the
* default, so it is not usually necessary to specify
* ascending sort order.
*
* ## Examples
*
* ```ts
* // Return cars, starting with the oldest models
* // and going in ascending order to the newest.
* db.select().from(cars)
*   .orderBy(asc(cars.year));
* ```
*
* @see desc to sort in descending order
*/
function asc(column) {
	return sql`${column} asc`;
}
/**
* Used in sorting, this specifies that the given
* column or expression should be sorted in descending
* order.
*
* ## Examples
*
* ```ts
* // Select users, with the most recently created
* // records coming first.
* db.select().from(users)
*   .orderBy(desc(users.createdAt));
* ```
*
* @see asc to sort in ascending order
*/
function desc(column) {
	return sql`${column} desc`;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/alias.js
var ColumnTableAliasProxyHandler = class {
	static [entityKind] = "ColumnTableAliasProxyHandler";
	constructor(table, ignoreColumnAlias) {
		this.table = table;
		this.ignoreColumnAlias = ignoreColumnAlias;
	}
	get(columnObj, prop) {
		if (prop === "table") return this.table;
		if (prop === "isAlias" && this.ignoreColumnAlias) return false;
		return columnObj[prop];
	}
};
var ViewSelectionAliasProxyHandler = class {
	static [entityKind] = "ViewSelectionAliasProxyHandler";
	constructor(view, selection, ignoreColumnAlias) {
		this.view = view;
		this.selection = selection;
		this.ignoreColumnAlias = ignoreColumnAlias;
	}
	get(selection, prop) {
		const value = selection[prop];
		if (is(value, Column)) return new Proxy(value, new ColumnTableAliasProxyHandler(this.view, this.ignoreColumnAlias));
		if (is(value, Subquery) || is(value, SQL) || is(value, SQL.Aliased) || isSQLWrapper(value) || typeof value !== "object" || value === null) return value;
		return new Proxy(value, this);
	}
};
var TableAliasProxyHandler = class {
	static [entityKind] = "TableAliasProxyHandler";
	constructor(alias, replaceOriginalName, ignoreColumnAlias) {
		this.alias = alias;
		this.replaceOriginalName = replaceOriginalName;
		this.ignoreColumnAlias = ignoreColumnAlias;
	}
	get(target, prop) {
		if (prop === Table.Symbol.IsAlias) return true;
		if (prop === Table.Symbol.Name) return this.alias;
		if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) return this.alias;
		if (prop === ViewBaseConfig) return {
			...target[ViewBaseConfig],
			name: this.alias,
			isAlias: true,
			selectedFields: new Proxy(target[ViewBaseConfig].selectedFields, new ViewSelectionAliasProxyHandler(new Proxy(target, this), target[ViewBaseConfig].selectedFields, this.ignoreColumnAlias))
		};
		if (prop === Table.Symbol.Columns) {
			const columns = target[Table.Symbol.Columns];
			if (!columns) return columns;
			if (is(target, View)) return new Proxy(target[Table.Symbol.Columns], new ViewSelectionAliasProxyHandler(new Proxy(target, this), target[Table.Symbol.Columns], this.ignoreColumnAlias));
			const proxiedColumns = {};
			Object.keys(columns).map((key) => {
				proxiedColumns[key] = new Proxy(columns[key], new ColumnTableAliasProxyHandler(new Proxy(target, this), this.ignoreColumnAlias));
			});
			return proxiedColumns;
		}
		const value = target[prop];
		if (is(value, Column)) return new Proxy(value, new ColumnTableAliasProxyHandler(new Proxy(target, this), this.ignoreColumnAlias));
		return value;
	}
};
var ColumnAliasProxyHandler = class {
	static [entityKind] = "ColumnAliasProxyHandler";
	constructor(alias) {
		this.alias = alias;
	}
	get(target, prop) {
		if (prop === "isAlias") return true;
		if (prop === "name") return this.alias;
		if (prop === "keyAsName") return false;
		if (prop === OriginalColumn) return () => target;
		return target[prop];
	}
};
function aliasedTable(table, tableAlias) {
	return new Proxy(table, new TableAliasProxyHandler(tableAlias, false, false));
}
function aliasedColumn(column, alias) {
	return new Proxy(column, new ColumnAliasProxyHandler(alias));
}
Column.prototype.as = function(alias) {
	return aliasedColumn(this, alias);
};
function getOriginalColumnFromAlias(column) {
	return column[OriginalColumn]();
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/utils.js
/** @internal bypass bundle-time filtering */
const FnConstructor = Object.getPrototypeOf(() => null).constructor;
/** @internal */
function makeJitQueryMapperInner(columns, joinsNotNullableMap = {}) {
	const preFn = [];
	const fn = [];
	fn.push(`const [ ${columns.map((_, i) => `c${i}`).join(", ")} ] = rows[i];`);
	const nullifyMap = {};
	const objectIds = {};
	const decodes = Array.from({ length: columns.length });
	for (let idx = 0; idx < columns.length; ++idx) {
		const { field, path, codec, arrayDimensions } = columns[idx];
		let decoder;
		let decoderStr;
		let decoderFieldDestructure;
		let isColumn = false;
		if (is(field, Column)) {
			isColumn = true;
			decoder = field;
			decoderFieldDestructure = `field: decoder${idx}`;
		} else if (is(field, SQL)) {
			decoder = field.decoder;
			decoderFieldDestructure = `field: { decoder: decoder${idx} }`;
		} else if (is(field, Subquery)) {
			decoder = field._.sql.decoder;
			decoderFieldDestructure = `field: { _: { sql: { decoder: decoder${idx} } } }`;
		} else {
			decoder = field.sql.decoder;
			decoderFieldDestructure = `field: { sql: { decoder: decoder${idx} } }`;
		}
		decoderStr = `decoder${idx}.mapFromDriverValue`;
		if (decoder.mapFromDriverValue.isNoop) decoderStr = "";
		if (decoderStr) preFn.push(`const { ${decoderFieldDestructure}${codec ? `, codec: codec${idx}` : ""} } = columns[${idx}];`);
		else if (codec) preFn.push(`const { codec: codec${idx} } = columns[${idx}];`);
		const colStr = `c${idx}`;
		let decodedValue = colStr;
		if (codec) decodedValue = `codec${idx}(${decodedValue}, ${arrayDimensions})`;
		if (decoderStr) decodedValue = `${decoderStr}(${decodedValue})`;
		decodes[idx] = colStr === decodedValue ? `${colStr}` : `${colStr} === null ? ${colStr} : ${decodedValue}`;
		if (path.length !== 2 || !isColumn) continue;
		if (objectIds[path[0]] === void 0) objectIds[path[0]] = [`c${idx}`];
		else objectIds[path[0]]?.push(`c${idx}`);
		const [objectName] = path;
		const tableName = getTableName(field.table);
		nullifyMap[objectName] = joinsNotNullableMap[tableName] ? false : typeof nullifyMap[objectName] === "string" ? nullifyMap[objectName] === tableName ? tableName : false : tableName;
	}
	fn.push(`mapped[i] = {`);
	let currentObjectPath = [];
	for (let idx = 0; idx < columns.length; ++idx) {
		const { path } = columns[idx];
		const jsonPath = path.map((e) => JSON.stringify(e));
		const decodedValue = decodes[idx];
		const objectPath = path.slice(0, -1);
		let commonLen = 0;
		while (commonLen < currentObjectPath.length && commonLen < objectPath.length && currentObjectPath[commonLen] === objectPath[commonLen]) commonLen++;
		for (let d = currentObjectPath.length - 1; d >= commonLen; --d) fn.push(`${"	".repeat(d + 1)}},`);
		for (let d = commonLen; d < objectPath.length; ++d) fn.push(`${"	".repeat(d + 1)}${jsonPath[d]}: ${d === 0 && objectPath.length === 1 && typeof nullifyMap[path[0]] === "string" ? `${objectIds[path[0]]?.map((c) => `${c} === null`).join(" && ")} ? null : {` : "{"}`);
		currentObjectPath = objectPath;
		fn.push(`${"	".repeat(path.length)}${jsonPath[path.length - 1]}: ${decodedValue},`);
	}
	for (let d = currentObjectPath.length - 1; d >= 0; --d) fn.push(`${"	".repeat(d + 1)}},`);
	fn.push(`};`);
	return `${preFn.length ? `${preFn.join("\n	")}\n\t` : ""}for (let i = 0; i < length; ++i) {
		${fn.join("\n		")}
	}`;
}
function makeJitQueryMapper(columns, joinsNotNullableMap) {
	const internals = `\t"use strict";
	const { columns } = this;
	const { length } = rows;
	const mapped = Array.from({ length });
	${makeJitQueryMapperInner(columns, joinsNotNullableMap)}
	return mapped;
	//# sourceURL=drizzle:jit-query-mapper`;
	return Object.assign(new FnConstructor("rows", internals).bind({ columns }), { body: `function jitQueryMapper (rows) {\n${internals}\n}` });
}
/** @internal */
function jitCompatCheck(isEnabled) {
	if (!isEnabled) return false;
	try {
		const res = new FnConstructor("input", "\"use strict\"; return input;")(true);
		if (res !== true) {
			console.warn("Unable to use jit mappers due to incompatibility: corrupted jit function output.\nFalling back to premade mappers.\nError details:");
			console.error(`Expected to receive \`true\`, got: ${res}`);
		}
		return true;
	} catch (e) {
		console.warn("Unable to use jit mappers due to incompatibility.\nFalling back to premade mappers.\nError details:");
		console.error(e);
		return false;
	}
}
function makeDefaultQueryMapper(columns, joinsNotNullableMap) {
	const interpretedData = columns.map(({ field, codec, arrayDimensions, path }) => {
		let processNullifyMap;
		let decoderSrc;
		if (is(field, Column)) {
			decoderSrc = field;
			if (joinsNotNullableMap && path.length === 2) {
				const objectName = path[0];
				processNullifyMap = (nullifyMap, value) => {
					if (!(objectName in nullifyMap)) nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
					else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) nullifyMap[objectName] = false;
				};
			}
		} else if (is(field, SQL)) decoderSrc = field.decoder;
		else if (is(field, Subquery)) decoderSrc = field._.sql.decoder;
		else decoderSrc = field.sql.decoder;
		let decoder;
		if (decoderSrc.mapFromDriverValue.isNoop) decoder = codec ? (v) => codec(v, arrayDimensions) : void 0;
		else decoder = codec ? (v) => decoderSrc.mapFromDriverValue(codec(v, arrayDimensions)) : (v) => decoderSrc.mapFromDriverValue(v);
		return [decoder, processNullifyMap];
	});
	return ((rows) => rows.map((row) => {
		const nullifyMap = {};
		const result = columns.reduce((result, { path }, columnIndex) => {
			let node = result;
			for (const [pathChunkIndex, pathChunk] of path.entries()) if (pathChunkIndex < path.length - 1) {
				if (!(pathChunk in node)) node[pathChunk] = {};
				node = node[pathChunk];
			} else {
				const [decoder, processNullifyMap] = interpretedData[columnIndex];
				const rawValue = row[columnIndex];
				const value = node[pathChunk] = rawValue === null ? null : decoder ? decoder(rawValue) : rawValue;
				processNullifyMap?.(nullifyMap, value);
			}
			return result;
		}, {});
		if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
			for (const [objectName, tableName] of Object.entries(nullifyMap)) if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) result[objectName] = null;
		}
		return result;
	}));
}
/** @internal */
function orderSelectedFields(fields, pathPrefix, codecs) {
	return Object.entries(fields).reduce((result, [name, field]) => {
		if (typeof name !== "string") return result;
		const newPath = pathPrefix ? [...pathPrefix, name] : [name];
		if (is(field, Column)) result.push({
			path: newPath,
			field,
			codec: codecs?.get(field, "normalize"),
			arrayDimensions: field.dimensions,
			column: field
		});
		else if (is(field, SQL) || is(field, SQL.Aliased)) {
			const col = getColumnFromDecoder(field);
			result.push(col ? {
				path: newPath,
				field,
				codec: codecs?.get(col, "normalize"),
				arrayDimensions: col.dimensions,
				column: col
			} : {
				path: newPath,
				field
			});
		} else if (is(field, Subquery)) {
			let column;
			const entry = Object.values(field._.selectedFields)[0];
			let fieldDecoder;
			if (is(entry, Column)) {
				column = entry;
				fieldDecoder = entry;
			} else if (is(entry, SQL)) {
				column = getColumnFromDecoder(entry);
				fieldDecoder = entry.decoder;
			} else {
				column = getColumnFromDecoder(entry);
				fieldDecoder = entry.sql.decoder;
			}
			if (fieldDecoder) field._.sql.decoder = fieldDecoder;
			result.push(column ? {
				path: newPath,
				field,
				codec: codecs?.get(column, "normalize"),
				arrayDimensions: column.dimensions,
				column
			} : {
				path: newPath,
				field
			});
		} else if (is(field, Table)) result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath, codecs));
		else result.push(...orderSelectedFields(field, newPath, codecs));
		return result;
	}, []);
}
function getColumnFromDecoder(source) {
	const query = source.getSQL();
	if (is(query.decoder, Column)) return query.decoder;
}
function haveSameKeys(left, right) {
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	if (leftKeys.length !== rightKeys.length) return false;
	for (const [index, key] of leftKeys.entries()) if (key !== rightKeys[index]) return false;
	return true;
}
/** @internal */
function mapUpdateSet(table, values) {
	const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
		if (is(value, SQL) || is(value, Column)) return [key, value];
		else return [key, new Param(value, table[Table.Symbol.Columns][key])];
	});
	if (entries.length === 0) throw new Error("No values to set");
	return Object.fromEntries(entries);
}
/** @internal */
function applyMixins(baseClass, extendedClasses) {
	for (const extendedClass of extendedClasses) for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
		if (name === "constructor") continue;
		Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null));
	}
}
/**
* @deprecated
* Use `getColumns` instead
*/
function getTableColumns(table) {
	return table[Table.Symbol.Columns];
}
/** @internal */
function getTableLikeName(table) {
	return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
/** @internal */
function getColumnNameAndConfig(a, b) {
	return {
		name: typeof a === "string" && a.length > 0 ? a : "",
		config: typeof a === "object" ? a : b
	};
}
typeof TextDecoder === "undefined" || new TextDecoder();
function assertUnreachable(_x) {
	throw new Error("Didn't expect to get here");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/relations.js
var Relation = class {
	static [entityKind] = "RelationV2";
	fieldName;
	sourceColumns;
	targetColumns;
	alias;
	where;
	sourceTable;
	targetTable;
	through;
	throughTable;
	isReversed;
	/** @internal */
	sourceColumnTableNames = [];
	/** @internal */
	targetColumnTableNames = [];
	constructor(targetTable, targetTableName) {
		this.targetTableName = targetTableName;
		this.targetTable = targetTable;
	}
};
var One = class extends Relation {
	static [entityKind] = "OneV2";
	relationType = "one";
	optional;
	constructor(tables, targetTable, targetTableName, config) {
		super(targetTable, targetTableName);
		this.alias = config?.alias;
		this.where = config?.where;
		if (config?.from) this.sourceColumns = (Array.isArray(config.from) ? config.from : [config.from]).map((it) => {
			this.throughTable ??= it._.through ? tables[it._.through._.tableName] : void 0;
			this.sourceColumnTableNames.push(it._.tableName);
			return it._.column;
		});
		if (config?.to) this.targetColumns = (Array.isArray(config.to) ? config.to : [config.to]).map((it) => {
			this.throughTable ??= it._.through ? tables[it._.through._.tableName] : void 0;
			this.targetColumnTableNames.push(it._.tableName);
			return it._.column;
		});
		if (this.throughTable) this.through = {
			source: (Array.isArray(config?.from) ? config.from : config?.from ? [config.from] : []).map((c) => c._.through),
			target: (Array.isArray(config?.to) ? config.to : config?.to ? [config.to] : []).map((c) => c._.through)
		};
		this.optional = config?.optional ?? true;
	}
};
const operators = {
	and,
	between,
	eq,
	exists,
	gt,
	gte,
	ilike,
	inArray,
	arrayContains,
	arrayContained,
	arrayOverlaps,
	isNull,
	isNotNull,
	like,
	lt,
	lte,
	ne,
	not,
	notBetween,
	notExists,
	notLike,
	notIlike,
	notInArray,
	or,
	sql
};
const orderByOperators = {
	sql,
	asc,
	desc
};
function mapRelationalRow(rows, isOne, buildQueryResultSelection, parseJson = false, parseJsonIfString = false, useJsonMappers = true) {
	const maxIdx = isOne ? 1 : rows.length;
	const decoders = buildQueryResultSelection.map(({ field, codec, arrayDimensions }) => {
		let decoder;
		if (is(field, Column)) decoder = field;
		else if (is(field, SQL)) decoder = field.decoder;
		else if (is(field, SQL.Aliased)) decoder = field.sql.decoder;
		else if (is(field, Table) || is(field, View)) decoder = noopDecoder;
		else decoder = field.getSQL().decoder;
		if (useJsonMappers && field.mapFromJsonValue) return (v) => field.mapFromJsonValue(v);
		return decoder.mapFromDriverValue.isNoop ? codec ? (value) => codec(value, arrayDimensions) : void 0 : codec ? (value) => decoder.mapFromDriverValue(codec(value, arrayDimensions)) : (value) => decoder.mapFromDriverValue(value);
	});
	for (let i = 0; i < maxIdx; ++i) {
		const row = isOne ? rows : rows[i];
		for (let selectionItemIdx = 0; selectionItemIdx < buildQueryResultSelection.length; ++selectionItemIdx) {
			const selectionItem = buildQueryResultSelection[selectionItemIdx];
			if (selectionItem.selection) {
				if (row[selectionItem.key] === null) continue;
				if (parseJson) {
					row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
					if (row[selectionItem.key] === null) continue;
				} else if (parseJsonIfString && typeof row[selectionItem.key] === "string") row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
				if (selectionItem.isArray) {
					mapRelationalRow(row[selectionItem.key], false, selectionItem.selection, false, parseJsonIfString);
					continue;
				}
				mapRelationalRow(row[selectionItem.key], true, selectionItem.selection, false, parseJsonIfString);
				continue;
			}
			if (row[selectionItem.key] === null) continue;
			const decoder = decoders[selectionItemIdx];
			if (!decoder) continue;
			row[selectionItem.key] = decoder(row[selectionItem.key]);
		}
	}
	return rows;
}
function mapRelationalRowFromArrays(rows, isOne, buildQueryResultSelection, parseJson = false, parseJsonIfString = false) {
	const maxIdx = isOne ? 1 : rows.length;
	const decoders = buildQueryResultSelection.map(({ field, codec, arrayDimensions }) => {
		let decoder;
		if (is(field, Column)) decoder = field;
		else if (is(field, SQL)) decoder = field.decoder;
		else if (is(field, SQL.Aliased)) decoder = field.sql.decoder;
		else if (is(field, Table) || is(field, View)) decoder = noopDecoder;
		else decoder = field.getSQL().decoder;
		return decoder.mapFromDriverValue.isNoop ? codec ? (value) => codec(value, arrayDimensions) : void 0 : codec ? (value) => decoder.mapFromDriverValue(codec(value, arrayDimensions)) : (value) => decoder.mapFromDriverValue(value);
	});
	const results = Array.from({ length: maxIdx });
	for (let i = 0; i < maxIdx; ++i) {
		const row = isOne ? rows : rows[i];
		const result = {};
		for (let selectionItemIdx = 0; selectionItemIdx < buildQueryResultSelection.length; ++selectionItemIdx) {
			const selectionItem = buildQueryResultSelection[selectionItemIdx];
			let value = row[selectionItemIdx];
			if (selectionItem.selection) {
				if (value === null) {
					result[selectionItem.key] = null;
					continue;
				}
				if (parseJson) {
					value = JSON.parse(value);
					if (value === null) {
						result[selectionItem.key] = null;
						continue;
					}
				} else if (parseJsonIfString && typeof value === "string") value = JSON.parse(value);
				if (selectionItem.isArray) mapRelationalRow(value, false, selectionItem.selection, false, parseJsonIfString);
				else mapRelationalRow(value, true, selectionItem.selection, false, parseJsonIfString);
				result[selectionItem.key] = value;
				continue;
			}
			if (value === null) {
				result[selectionItem.key] = null;
				continue;
			}
			const decoder = decoders[selectionItemIdx];
			result[selectionItem.key] = decoder ? decoder(value) : value;
		}
		results[i] = result;
	}
	return isOne ? results[0] : results;
}
function makeDefaultRqbMapper({ selection, isFirst, parseJson, parseJsonIfString, rootJsonMappers, arrayModeRoot }) {
	return ((rows) => {
		if (isFirst && !rows[0]) return rows[0];
		return arrayModeRoot ? mapRelationalRowFromArrays(isFirst ? rows[0] : rows, isFirst, selection, parseJson, parseJsonIfString) : mapRelationalRow(isFirst ? rows[0] : rows, isFirst, selection, parseJson, parseJsonIfString, rootJsonMappers);
	});
}
function makeJitRqbMapperInner(selection, rowExpr, selectionVar, parseJson, parseJsonIfString, useJsonMappers, preFn, counter, accessByIdx) {
	const bodyStmts = [];
	const literalEntries = [];
	let hasWork = false;
	const fieldVars = selection.map(() => `c${counter.n++}`);
	const destructurePieces = selection.map((item, idx) => accessByIdx ? fieldVars[idx] : `${JSON.stringify(item.key)}: ${fieldVars[idx]}`);
	bodyStmts.push(accessByIdx ? `let [ ${destructurePieces.join(", ")} ] = ${rowExpr};` : `let { ${destructurePieces.join(", ")} } = ${rowExpr};`);
	for (const [idx, { field, key, codec, isArray, selection: innerSelection, arrayDimensions }] of selection.entries()) {
		const sel = `${selectionVar}[${idx}]`;
		const keyStr = JSON.stringify(key);
		const slot = fieldVars[idx];
		if (innerSelection) {
			if (parseJson) {
				bodyStmts.push(`if (${slot} !== null) ${slot} = JSON.parse(${slot});`);
				hasWork = true;
			} else if (parseJsonIfString) {
				bodyStmts.push(`if (typeof ${slot} === 'string') ${slot} = JSON.parse(${slot});`);
				hasWork = true;
			}
			const nestedSelVar = `s${counter.n++}`;
			const savedPreFnLen = preFn.length;
			preFn.push(`const { selection: ${nestedSelVar} } = ${sel};`);
			if (isArray) {
				const j = `j${counter.n++}`;
				const inner = makeJitRqbMapperInner(innerSelection, `${slot}[${j}]`, nestedSelVar, false, parseJsonIfString, true, preFn, counter, false);
				if (inner.hasWork) {
					hasWork = true;
					bodyStmts.push(`if (${slot} !== null) {`);
					bodyStmts.push(`\tfor (let ${j} = 0; ${j} < ${slot}.length; ++${j}) {`);
					for (const s of inner.bodyStmts) bodyStmts.push(`\t\t${s}`);
					bodyStmts.push(`\t\t${slot}[${j}] = ${inner.literal};`);
					bodyStmts.push(`\t}`);
					bodyStmts.push(`}`);
				} else preFn.splice(savedPreFnLen, 1);
			} else {
				const inner = makeJitRqbMapperInner(innerSelection, slot, nestedSelVar, false, parseJsonIfString, true, preFn, counter, false);
				if (inner.hasWork) {
					hasWork = true;
					bodyStmts.push(`if (${slot} !== null) {`);
					for (const s of inner.bodyStmts) bodyStmts.push(`\t${s}`);
					bodyStmts.push(`\t${slot} = ${inner.literal};`);
					bodyStmts.push(`}`);
				} else preFn.splice(savedPreFnLen, 1);
			}
			literalEntries.push(`${keyStr}: ${slot}`);
			continue;
		}
		let decoderExpr = "";
		let destructure = "";
		let bypassCodecs = false;
		if (is(field, Column)) {
			if (useJsonMappers && field.mapFromJsonValue) {
				bypassCodecs = true;
				const id = counter.n++;
				destructure = `field: dec${id}`;
				decoderExpr = `dec${id}.mapFromJsonValue`;
			} else if (!field.mapFromDriverValue.isNoop) {
				const id = counter.n++;
				destructure = `field: dec${id}`;
				decoderExpr = `dec${id}.mapFromDriverValue`;
			}
		} else if (is(field, SQL)) {
			if (useJsonMappers && field.decoder.mapFromJsonValue) {
				bypassCodecs = true;
				const id = counter.n++;
				destructure = `field: { decoder: dec${id} }`;
				decoderExpr = `dec${id}.mapFromJsonValue`;
			} else if (!field.decoder.mapFromDriverValue.isNoop) {
				const id = counter.n++;
				destructure = `field: { decoder: dec${id} }`;
				decoderExpr = `dec${id}.mapFromDriverValue`;
			}
		} else if (is(field, SQL.Aliased)) {
			if (useJsonMappers && field.sql.decoder.mapFromJsonValue) {
				bypassCodecs = true;
				const id = counter.n++;
				destructure = `field: { sql: { decoder: dec${id} } }`;
				decoderExpr = `dec${id}.mapFromJsonValue`;
			} else if (!field.sql.decoder.mapFromDriverValue.isNoop) {
				const id = counter.n++;
				destructure = `field: { sql: { decoder: dec${id} } }`;
				decoderExpr = `dec${id}.mapFromDriverValue`;
			}
		} else if (is(field, Table) || is(field, View)) {} else {
			const sqlExpr = field.getSQL();
			if (useJsonMappers && sqlExpr.decoder.mapFromJsonValue) {
				bypassCodecs = true;
				const id = counter.n++;
				preFn.push(`const dec${id} = ${sel}.field.getSQL().decoder;`);
				decoderExpr = `dec${id}.mapFromJsonValue`;
			} else if (!sqlExpr.decoder.mapFromDriverValue.isNoop) {
				const id = counter.n++;
				preFn.push(`const dec${id} = ${sel}.field.getSQL().decoder;`);
				decoderExpr = `dec${id}.mapFromDriverValue`;
			}
		}
		let codecVar = "";
		if (!bypassCodecs && codec) codecVar = `codec${counter.n++}`;
		if (destructure || codecVar) {
			const parts = [];
			if (destructure) parts.push(destructure);
			if (codecVar) parts.push(`codec: ${codecVar}`);
			preFn.push(`const { ${parts.join(", ")} } = ${sel};`);
		}
		if (decoderExpr || codecVar) {
			hasWork = true;
			let decoded = slot;
			if (codecVar) decoded = `${codecVar}(${decoded}, ${arrayDimensions})`;
			if (decoderExpr) decoded = `${decoderExpr}(${decoded})`;
			literalEntries.push(`${keyStr}: ${slot} === null ? null : ${decoded}`);
		} else literalEntries.push(`${keyStr}: ${slot}`);
	}
	return {
		bodyStmts,
		literal: `{ ${literalEntries.join(", ")} }`,
		hasWork
	};
}
function makeJitRqbMapper({ selection, isFirst, parseJson, parseJsonIfString, rootJsonMappers, arrayModeRoot }) {
	const preFn = [];
	const inner = makeJitRqbMapperInner(selection, "row", "selection", parseJson, parseJsonIfString, arrayModeRoot ? false : rootJsonMappers, preFn, { n: 0 }, !!arrayModeRoot);
	const lines = [];
	lines.push(`\t"use strict";
	const { selection } = this;`);
	for (const p of preFn) lines.push(`\t${p}`);
	if (arrayModeRoot) if (isFirst) {
		lines.push(`\tconst row = rows[0];`);
		lines.push(`\tif (!row) return undefined;`);
		for (const s of inner.bodyStmts) lines.push(`\t${s}`);
		lines.push(`\treturn ${inner.literal};`);
	} else {
		lines.push(`\tconst { length } = rows;`);
		lines.push(`\tconst mapped = Array.from({ length });`);
		lines.push(`\tfor (let i = 0; i < length; ++i) {`);
		lines.push(`\t\tconst row = rows[i];`);
		for (const s of inner.bodyStmts) lines.push(`\t\t${s}`);
		lines.push(`\t\tmapped[i] = ${inner.literal};`);
		lines.push(`\t}`);
		lines.push(`\treturn mapped;`);
	}
	else if (!inner.hasWork) lines.push(isFirst ? `\treturn rows[0];` : `\treturn rows;`);
	else if (isFirst) {
		lines.push(`\tconst row = rows[0];`);
		lines.push(`\tif (!row) return undefined;`);
		for (const s of inner.bodyStmts) lines.push(`\t${s}`);
		lines.push(`\trows[0] = ${inner.literal};`);
		lines.push(`\treturn rows[0];`);
	} else {
		lines.push(`\tfor (let i = 0; i < rows.length; ++i) {`);
		lines.push(`\t\tconst row = rows[i];`);
		for (const s of inner.bodyStmts) lines.push(`\t\t${s}`);
		lines.push(`\t\trows[i] = ${inner.literal};`);
		lines.push(`\t}`);
		lines.push(`\treturn rows;`);
	}
	lines.push("	//# sourceURL=drizzle:jit-relational-query-mapper");
	const compiled = lines.join("\n");
	return Object.assign(new FnConstructor("rows", compiled).bind({ selection }), { body: `function jitRqbMapper (rows) {\n${compiled}\n}` });
}
/** @internal */
function fieldSelectionToSQL(table, target) {
	const field = table[TableColumns][target];
	return field ? is(field, Column) ? field : is(field, SQL.Aliased) ? sql`${table}.${sql.identifier(field.fieldAlias)}` : sql`${table}.${sql.identifier(target)}` : sql`${table}.${sql.identifier(target)}`;
}
function relationsFieldFilterToSQL(column, filter) {
	if (typeof filter !== "object" || is(filter, Placeholder)) return eq(column, filter);
	const entries = Object.entries(filter);
	if (!entries.length) return void 0;
	const parts = [];
	for (const [target, value] of entries) {
		if (value === void 0) continue;
		switch (target) {
			case "NOT": {
				const res = relationsFieldFilterToSQL(column, value);
				if (!res) continue;
				parts.push(not(res));
				continue;
			}
			case "OR":
				if (!value.length) continue;
				parts.push(or(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
				continue;
			case "AND":
				if (!value.length) continue;
				parts.push(and(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
				continue;
			case "isNotNull":
			case "isNull":
				if (!value) continue;
				parts.push(operators[target](column));
				continue;
			case "in":
				parts.push(operators.inArray(column, value));
				continue;
			case "notIn":
				parts.push(operators.notInArray(column, value));
				continue;
			default:
				parts.push(operators[target](column, value));
				continue;
		}
	}
	if (!parts.length) return void 0;
	return and(...parts);
}
function relationsFilterToSQL(table, filter, tableRelations = {}, tablesRelations = {}, depth = 0) {
	const entries = Object.entries(filter);
	if (!entries.length) return void 0;
	const parts = [];
	for (const [target, value] of entries) {
		if (value === void 0) continue;
		switch (target) {
			case "RAW": {
				const processed = typeof value === "function" ? value(table, operators) : value.getSQL();
				parts.push(processed);
				continue;
			}
			case "OR":
				if (!value?.length) continue;
				parts.push(or(...value.map((subFilter) => relationsFilterToSQL(table, subFilter, tableRelations, tablesRelations, depth))));
				continue;
			case "AND":
				if (!value?.length) continue;
				parts.push(and(...value.map((subFilter) => relationsFilterToSQL(table, subFilter, tableRelations, tablesRelations, depth))));
				continue;
			case "NOT": {
				if (value === void 0) continue;
				const built = relationsFilterToSQL(table, value, tableRelations, tablesRelations, depth);
				if (!built) continue;
				parts.push(not(built));
				continue;
			}
			default: {
				if (table[TableColumns][target]) {
					const colFilter = relationsFieldFilterToSQL(fieldSelectionToSQL(table, target), value);
					if (colFilter) parts.push(colFilter);
					continue;
				}
				const relation = tableRelations[target];
				if (!relation) throw new DrizzleError({ message: `Unknown relational filter field: "${target}"` });
				const targetTable = aliasedTable(relation.targetTable, `f${depth}`);
				const throughTable = relation.throughTable ? aliasedTable(relation.throughTable, `ft${depth}`) : void 0;
				const targetConfig = tablesRelations[relation.targetTableName];
				const { filter: relationFilter, joinCondition } = relationToSQL(relation, table, targetTable, throughTable);
				const filter = and(relationFilter, typeof value === "boolean" ? void 0 : relationsFilterToSQL(targetTable, value, targetConfig.relations, tablesRelations, depth + 1));
				const subquery = throughTable ? sql`(select * from ${getTableAsAliasSQL(targetTable)} inner join ${getTableAsAliasSQL(throughTable)} on ${joinCondition}${sql` where ${filter}`.if(filter)} limit 1)` : sql`(select * from ${getTableAsAliasSQL(targetTable)}${sql` where ${filter}`.if(filter)} limit 1)`;
				if (filter) parts.push((value ? exists : notExists)(subquery));
			}
		}
	}
	return and(...parts);
}
function relationsOrderToSQL(table, orders) {
	if (typeof orders === "function") {
		const data = orders(table, orderByOperators);
		return is(data, SQL) ? data : Array.isArray(data) ? data.length ? sql.join(data.map((o) => is(o, SQL) ? o : asc(o)), sql`, `) : void 0 : is(data, Column) ? asc(data) : void 0;
	}
	const entries = Object.entries(orders).filter(([_, value]) => value);
	if (!entries.length) return void 0;
	return sql.join(entries.map(([target, value]) => (value === "asc" ? asc : desc)(fieldSelectionToSQL(table, target))), sql`, `);
}
function relationExtrasToSQL(table, extras, codecs, inJson) {
	const subqueries = [];
	const selection = [];
	for (const [key, field] of Object.entries(extras)) {
		if (!field) continue;
		const subq = (typeof field === "function" ? field(table, { sql: operators.sql }) : field).getSQL();
		const column = codecs ? getColumnFromDecoder(subq) : void 0;
		const query = column && (!inJson || !column.jsonSelectIdentifier) ? sql`${codecs.apply(column, inJson ? "castInJson" : "cast", sql`(${subq})`)} as ${sql.identifier(key)}` : sql`(${subq}) as ${sql.identifier(key)}`;
		query.decoder = subq.decoder;
		subqueries.push(query);
		selection.push(column && (!inJson || !column.mapFromJsonValue) ? {
			key,
			field: query,
			codec: codecs.get(column, inJson ? "normalizeInJson" : "normalize"),
			arrayDimensions: column.dimensions
		} : {
			key,
			field: query
		});
	}
	return {
		sql: subqueries.length ? sql.join(subqueries, sql`, `) : void 0,
		selection
	};
}
function relationToSQL(relation, sourceTable, targetTable, throughTable) {
	if (relation.through) {
		const outerColumnWhere = relation.sourceColumns.map((s, i) => {
			const t = relation.through.source[i];
			return eq(sql`${sourceTable}.${sql.identifier(s.name)}`, sql`${throughTable}.${sql.identifier(is(t._.column, Column) ? t._.column.name : t._.key)}`);
		});
		const innerColumnWhere = relation.targetColumns.map((s, i) => {
			const t = relation.through.target[i];
			return eq(sql`${throughTable}.${sql.identifier(is(t._.column, Column) ? t._.column.name : t._.key)}`, sql`${targetTable}.${sql.identifier(s.name)}`);
		});
		return {
			filter: and(relation.where ? relationsFilterToSQL(relation.isReversed ? sourceTable : targetTable, relation.where) : void 0, ...outerColumnWhere),
			joinCondition: and(...innerColumnWhere)
		};
	}
	return { filter: and(...relation.sourceColumns.map((s, i) => {
		const t = relation.targetColumns[i];
		return eq(sql`${sourceTable}.${sql.identifier(s.name)}`, sql`${targetTable}.${sql.identifier(t.name)}`);
	}), relation.where ? relationsFilterToSQL(relation.isReversed ? sourceTable : targetTable, relation.where) : void 0) };
}
function getTableAsAliasSQL(table) {
	return sql`${table[IsAlias] ? sql`${sql`${sql.identifier(table[TableSchema] ?? "")}.`.if(table[TableSchema])}${sql.identifier(table[OriginalName])} as ${table}` : table}`;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
	static [entityKind] = "ConsoleLogWriter";
	write(message) {
		console.log(message);
	}
};
var DefaultLogger = class {
	static [entityKind] = "DefaultLogger";
	writer;
	constructor(config) {
		this.writer = config?.writer ?? new ConsoleLogWriter();
	}
	logQuery(query, params) {
		const stringifiedParams = params.map((p) => {
			try {
				return JSON.stringify(p);
			} catch {
				return String(p);
			}
		});
		const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
		this.writer.write(`Query: ${query}${paramsStr}`);
	}
};
var NoopLogger = class {
	static [entityKind] = "NoopLogger";
	logQuery() {}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
	static [entityKind] = "PgForeignKeyBuilder";
	/** @internal */
	reference;
	/** @internal */
	_onUpdate = "no action";
	/** @internal */
	_onDelete = "no action";
	constructor(config, actions) {
		this.reference = () => {
			const { name, columns, foreignColumns } = config();
			return {
				name,
				columns,
				foreignTable: foreignColumns[0].table,
				foreignColumns
			};
		};
		if (actions) {
			this._onUpdate = actions.onUpdate;
			this._onDelete = actions.onDelete;
		}
	}
	onUpdate(action) {
		this._onUpdate = action === void 0 ? "no action" : action;
		return this;
	}
	onDelete(action) {
		this._onDelete = action === void 0 ? "no action" : action;
		return this;
	}
	/** @internal */
	build(table) {
		return new ForeignKey(table, this);
	}
};
var ForeignKey = class {
	static [entityKind] = "PgForeignKey";
	reference;
	onUpdate;
	onDelete;
	name;
	constructor(table, builder) {
		this.table = table;
		this.reference = builder.reference;
		this.onUpdate = builder._onUpdate;
		this.onDelete = builder._onDelete;
	}
	getName() {
		const { name, columns, foreignColumns } = this.reference();
		const columnNames = columns.map((column) => column.name);
		const foreignColumnNames = foreignColumns.map((column) => column.name);
		const chunks = [
			this.table[TableName],
			...columnNames,
			foreignColumns[0].table[TableName],
			...foreignColumnNames
		];
		return name ?? `${chunks.join("_")}_fk`;
	}
	isNameExplicit() {
		return !!this.reference().name;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class {
	static [entityKind] = "PgColumnBuilder";
	foreignKeyConfigs = [];
	config;
	constructor(name, dataType, columnType) {
		this.config = {
			name,
			keyAsName: name === "",
			notNull: false,
			default: void 0,
			hasDefault: false,
			primaryKey: false,
			isUnique: false,
			uniqueName: void 0,
			uniqueType: void 0,
			dataType,
			columnType,
			generated: void 0,
			defaultFn: void 0,
			onUpdateFn: void 0,
			generatedIdentity: void 0
		};
	}
	/**
	* Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
	*
	* @example
	* ```ts
	* const users = pgTable('users', {
	* 	id: integer('id').$type<UserId>().primaryKey(),
	* 	details: json('details').$type<UserDetails>().notNull(),
	* });
	* ```
	*/
	$type() {
		return this;
	}
	/**
	* Adds a `not null` clause to the column definition.
	*
	* Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
	*/
	notNull() {
		this.config.notNull = true;
		return this;
	}
	/**
	* Adds a `default <value>` clause to the column definition.
	*
	* Affects the `insert` model of the table - columns *with* `default` are optional on insert.
	*
	* If you need to set a dynamic default value, use {@link $defaultFn} instead.
	*/
	default(value) {
		this.config.default = value;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Adds a dynamic default value to the column.
	* The function will be called when the row is inserted, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$defaultFn(fn) {
		this.config.defaultFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $defaultFn}.
	*/
	$default = this.$defaultFn;
	/**
	* Adds a dynamic update value to the column.
	* The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
	* If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$onUpdateFn(fn) {
		this.config.onUpdateFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $onUpdateFn}.
	*/
	$onUpdate = this.$onUpdateFn;
	/**
	* Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
	*
	* In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
	*/
	primaryKey() {
		this.config.primaryKey = true;
		this.config.notNull = true;
		return this;
	}
	/** @internal Sets the name of the column to the key within the table definition if a name was not given. */
	setName(name, casingFn) {
		if (this.config.name !== "") return;
		this.config.name = casingFn(name);
	}
	array(dimensions) {
		const dim = dimensions ?? "[]";
		this.config.dimensions = dim.length / 2;
		return this;
	}
	references(ref, config = {}) {
		this.foreignKeyConfigs.push({
			ref,
			config
		});
		return this;
	}
	unique(name, config) {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		this.config.uniqueType = config?.nulls;
		return this;
	}
	generatedAlwaysAs(as) {
		this.config.generated = {
			as,
			type: "always",
			mode: "stored"
		};
		return this;
	}
	/** @internal */
	buildForeignKeys(column, table) {
		return this.foreignKeyConfigs.map(({ ref, config }) => {
			return iife((ref, config) => {
				const builder = new ForeignKeyBuilder(() => {
					const foreignColumn = ref();
					return {
						name: config.name,
						columns: [column],
						foreignColumns: [foreignColumn]
					};
				});
				if (config.onUpdate) builder.onUpdate(config.onUpdate);
				if (config.onDelete) builder.onDelete(config.onDelete);
				return builder.build(table);
			}, ref, config);
		});
	}
	/** @internal */
	buildExtraConfigColumn(table) {
		return new ExtraConfigColumn(table, {
			...this.config,
			dimensions: this.config.dimensions ?? 0
		});
	}
};
var PgColumn = class extends Column {
	static [entityKind] = "PgColumn";
	/** @internal */
	table;
	dimensions;
	constructor(table, config) {
		super(table, config);
		this.table = table;
		this.dimensions = config.dimensions ?? 0;
	}
	/** @internal */
	postBuild() {
		if (this.dimensions) {
			const originalFromDriver = this.mapFromDriverValue.bind(this);
			const originalToDriver = this.mapToDriverValue.bind(this);
			this.mapFromDriverValue = this.mapFromDriverValue.isNoop ? this.mapFromDriverValue : (value) => {
				return this.mapArrayElements(value, originalFromDriver, this.dimensions);
			};
			this.mapToDriverValue = this.mapToDriverValue.isNoop ? this.mapToDriverValue : (value) => {
				return this.mapArrayElements(value, originalToDriver, this.dimensions);
			};
		}
		return this;
	}
	/** @internal */
	shouldDisableInsert() {
		return this.config.generatedIdentity !== void 0 && this.config.generatedIdentity.type !== "byDefault" || this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
	}
	/** @internal */
	mapArrayElements(value, mapper, depth) {
		if (depth > 0 && Array.isArray(value)) return value.map((v) => v === null ? null : this.mapArrayElements(v, mapper, depth - 1));
		return mapper(value);
	}
};
var ExtraConfigColumn = class extends PgColumn {
	static [entityKind] = "ExtraConfigColumn";
	/** @itnernal */
	codec = void 0;
	getSQLType() {
		return this.getSQLType();
	}
	indexConfig = {
		order: this.config.order ?? "asc",
		nulls: this.config.nulls ?? "last",
		opClass: this.config.opClass
	};
	defaultConfig = {
		order: "asc",
		nulls: "last",
		opClass: void 0
	};
	asc() {
		this.indexConfig.order = "asc";
		return this;
	}
	desc() {
		this.indexConfig.order = "desc";
		return this;
	}
	nullsFirst() {
		this.indexConfig.nulls = "first";
		return this;
	}
	nullsLast() {
		this.indexConfig.nulls = "last";
		return this;
	}
	/**
	* ### PostgreSQL documentation quote
	*
	* > An operator class with optional parameters can be specified for each column of an index.
	* The operator class identifies the operators to be used by the index for that column.
	* For example, a B-tree index on four-byte integers would use the int4_ops class;
	* this operator class includes comparison functions for four-byte integers.
	* In practice the default operator class for the column's data type is usually sufficient.
	* The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
	* For example, we might want to sort a complex-number data type either by absolute value or by real part.
	* We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
	* More information about operator classes check:
	*
	* ### Useful links
	* https://www.postgresql.org/docs/current/sql-createindex.html
	*
	* https://www.postgresql.org/docs/current/indexes-opclass.html
	*
	* https://www.postgresql.org/docs/current/xindex.html
	*
	* ### Additional types
	* If you have the `pg_vector` extension installed in your database, you can use the
	* `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
	*
	* **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
	*
	* @param opClass
	* @returns
	*/
	op(opClass) {
		this.indexConfig.opClass = opClass;
		return this;
	}
};
var IndexedColumn = class {
	static [entityKind] = "IndexedColumn";
	constructor(name, keyAsName, type, indexConfig) {
		this.name = name;
		this.keyAsName = keyAsName;
		this.type = type;
		this.indexConfig = indexConfig;
	}
	name;
	keyAsName;
	type;
	indexConfig;
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/int.common.js
var PgIntColumnBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgIntColumnBaseBuilder";
	/**
	* Adds an `ALWAYS AS IDENTITY` clause to the column definition.
	* Available for integer column types.
	*/
	generatedAlwaysAsIdentity(sequence) {
		if (sequence) {
			const { name, ...options } = sequence;
			this.config.generatedIdentity = {
				type: "always",
				sequenceName: name,
				sequenceOptions: options
			};
		} else this.config.generatedIdentity = { type: "always" };
		this.config.hasDefault = true;
		this.config.notNull = true;
		return this;
	}
	/**
	* Adds a `BY DEFAULT AS IDENTITY` clause to the column definition.
	* Available for integer column types.
	*/
	generatedByDefaultAsIdentity(sequence) {
		if (sequence) {
			const { name, ...options } = sequence;
			this.config.generatedIdentity = {
				type: "byDefault",
				sequenceName: name,
				sequenceOptions: options
			};
		} else this.config.generatedIdentity = { type: "byDefault" };
		this.config.hasDefault = true;
		this.config.notNull = true;
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/bigint.js
var PgBigInt53Builder = class extends PgIntColumnBuilder {
	static [entityKind] = "PgBigInt53Builder";
	constructor(name) {
		super(name, "number int53", "PgBigInt53");
	}
	/** @internal */
	build(table) {
		return new PgBigInt53(table, this.config);
	}
};
var PgBigInt53 = class extends PgColumn {
	static [entityKind] = "PgBigInt53";
	/** @internal */
	codec = "bigint:number";
	getSQLType() {
		return "bigint";
	}
};
var PgBigInt64Builder = class extends PgIntColumnBuilder {
	static [entityKind] = "PgBigInt64Builder";
	constructor(name) {
		super(name, "bigint int64", "PgBigInt64");
	}
	/** @internal */
	build(table) {
		return new PgBigInt64(table, this.config);
	}
};
var PgBigInt64 = class extends PgColumn {
	static [entityKind] = "PgBigInt64";
	/** @internal */
	codec = "bigint";
	getSQLType() {
		return "bigint";
	}
};
var PgBigIntStringBuilder = class extends PgIntColumnBuilder {
	static [entityKind] = "PgBigIntStringBuilder";
	constructor(name) {
		super(name, "string int64", "PgBigIntString");
	}
	/** @internal */
	build(table) {
		return new PgBigIntString(table, this.config);
	}
};
var PgBigIntString = class extends PgColumn {
	static [entityKind] = "PgBigIntString";
	/** @internal */
	codec = "bigint:string";
	getSQLType() {
		return "bigint";
	}
};
function bigint(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config.mode === "number") return new PgBigInt53Builder(name);
	if (config.mode === "string") return new PgBigIntStringBuilder(name);
	return new PgBigInt64Builder(name);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/bigserial.js
var PgBigSerial53Builder = class extends PgColumnBuilder {
	static [entityKind] = "PgBigSerial53Builder";
	constructor(name) {
		super(name, "number int53", "PgBigSerial53");
		this.config.hasDefault = true;
		this.config.notNull = true;
	}
	/** @internal */
	build(table) {
		return new PgBigSerial53(table, this.config);
	}
};
var PgBigSerial53 = class extends PgColumn {
	static [entityKind] = "PgBigSerial53";
	/** @internal */
	codec = "bigserial:number";
	getSQLType() {
		return "bigserial";
	}
};
var PgBigSerial64Builder = class extends PgColumnBuilder {
	static [entityKind] = "PgBigSerial64Builder";
	constructor(name) {
		super(name, "bigint int64", "PgBigSerial64");
		this.config.hasDefault = true;
		this.config.notNull = true;
	}
	/** @internal */
	build(table) {
		return new PgBigSerial64(table, this.config);
	}
};
var PgBigSerial64 = class extends PgColumn {
	static [entityKind] = "PgBigSerial64";
	/** @internal */
	codec = "bigserial";
	getSQLType() {
		return "bigserial";
	}
};
function bigserial(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config.mode === "number") return new PgBigSerial53Builder(name);
	return new PgBigSerial64Builder(name);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/boolean.js
var PgBooleanBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgBooleanBuilder";
	constructor(name) {
		super(name, "boolean", "PgBoolean");
	}
	/** @internal */
	build(table) {
		return new PgBoolean(table, this.config);
	}
};
var PgBoolean = class extends PgColumn {
	static [entityKind] = "PgBoolean";
	/** @internal */
	codec = "bool";
	getSQLType() {
		return "boolean";
	}
};
function boolean(name) {
	return new PgBooleanBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/char.js
var PgCharBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgCharBuilder";
	constructor(name, config) {
		super(name, config.enum?.length ? "string enum" : "string", "PgChar");
		this.config.length = config.length ?? 1;
		this.config.setLength = config.length !== void 0;
		this.config.enumValues = config.enum;
	}
	/** @internal */
	build(table) {
		return new PgChar(table, this.config);
	}
};
var PgChar = class extends PgColumn {
	static [entityKind] = "PgChar";
	/** @internal */
	codec = "char";
	enumValues;
	setLength;
	constructor(table, config) {
		super(table, config);
		this.enumValues = config.enumValues;
		this.setLength = config.setLength;
	}
	getSQLType() {
		return this.setLength ? `char(${this.length})` : `char`;
	}
};
function char(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgCharBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/cidr.js
var PgCidrBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgCidrBuilder";
	constructor(name) {
		super(name, "string cidr", "PgCidr");
	}
	/** @internal */
	build(table) {
		return new PgCidr(table, this.config);
	}
};
var PgCidr = class extends PgColumn {
	static [entityKind] = "PgCidr";
	/** @internal */
	codec = "cidr";
	getSQLType() {
		return "cidr";
	}
};
function cidr(name) {
	return new PgCidrBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
	for (let i = startFrom; i < arrayString.length; i++) {
		const char = arrayString[i];
		if (char === "\\") {
			i++;
			continue;
		}
		if (char === "\"") return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
		if (inQuotes) continue;
		if (char === "," || char === "}") return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
	}
	return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
	const result = [];
	let i = startFrom;
	let lastCharIsComma = false;
	while (i < arrayString.length) {
		const char = arrayString[i];
		if (char === ",") {
			if (lastCharIsComma || i === startFrom) result.push("");
			lastCharIsComma = true;
			i++;
			continue;
		}
		lastCharIsComma = false;
		if (char === "\\") {
			i += 2;
			continue;
		}
		if (char === "\"") {
			const [value, startFrom] = parsePgArrayValue(arrayString, i + 1, true);
			result.push(value);
			i = startFrom;
			continue;
		}
		if (char === "}") return [result, i + 1];
		if (char === "{") {
			const [value, startFrom] = parsePgNestedArray(arrayString, i + 1);
			result.push(value);
			i = startFrom;
			continue;
		}
		const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
		result.push(value);
		i = newStartFrom;
	}
	return [result, i];
}
function parsePgArray(arrayString) {
	const [result] = parsePgNestedArray(arrayString, 1);
	return result;
}
function makePgArray(array) {
	return `{${array.map((item) => {
		if (Array.isArray(item)) return makePgArray(item);
		if (typeof item === "string") return `"${item.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
		return `${item}`;
	}).join(",")}}`;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.js
function hexToBytes(hex) {
	const bytes = [];
	for (let c = 0; c < hex.length; c += 2) bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
	return new Uint8Array(bytes);
}
function bytesToFloat64(bytes, offset) {
	const view = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
	for (let i = 0; i < 8; i++) view.setUint8(i, bytes[offset + i]);
	return view.getFloat64(0, true);
}
function parseEWKB(hex) {
	const bytes = hexToBytes(hex);
	let offset = 0;
	const byteOrder = bytes[offset];
	offset += 1;
	const view = new DataView(bytes.buffer);
	const geomType = view.getUint32(offset, byteOrder === 1);
	offset += 4;
	let srid;
	if (geomType & 536870912) {
		srid = view.getUint32(offset, byteOrder === 1);
		offset += 4;
	}
	if ((geomType & 65535) === 1) {
		const x = bytesToFloat64(bytes, offset);
		offset += 8;
		const y = bytesToFloat64(bytes, offset);
		offset += 8;
		return {
			srid,
			point: [x, y]
		};
	}
	throw new Error("Unsupported geometry type");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/codecs.js
const noopCodecs = {};
const arrayToItemTypeCodecNameMap = {
	cast: "cast",
	castArray: "cast",
	castInJson: "castInJson",
	castArrayInJson: "castInJson",
	castParam: "castParam",
	castArrayParam: "castParam",
	normalize: "normalize",
	normalizeArray: "normalize",
	normalizeInJson: "normalizeInJson",
	normalizeArrayInJson: "normalizeInJson",
	normalizeParam: "normalizeParam",
	normalizeParamArray: "normalizeParam"
};
const itemToArrayTypeCodecNameMap = {
	cast: "castArray",
	castArray: "castArray",
	castInJson: "castArrayInJson",
	castArrayInJson: "castArrayInJson",
	castParam: "castArrayParam",
	castArrayParam: "castArrayParam",
	normalize: "normalizeArray",
	normalizeArray: "normalizeArray",
	normalizeInJson: "normalizeArrayInJson",
	normalizeArrayInJson: "normalizeArrayInJson",
	normalizeParam: "normalizeParamArray",
	normalizeParamArray: "normalizeParamArray"
};
var CodecsCollection = class {
	static [entityKind] = "CodecsCollection";
	constructor(resolveTypes, codecs = noopCodecs) {
		this.resolveTypes = resolveTypes;
		this.codecs = codecs;
	}
	get(column, type, override) {
		const sqlType = override ?? column.codec;
		if (!sqlType) return void 0;
		const codecType = column.dimensions ? itemToArrayTypeCodecNameMap[type] : arrayToItemTypeCodecNameMap[type];
		return this.codecs[sqlType]?.[codecType];
	}
	apply(column, type, value, override) {
		const sqlType = override ?? column.codec;
		if (!sqlType) return value;
		const codecType = column.dimensions ? itemToArrayTypeCodecNameMap[type] : arrayToItemTypeCodecNameMap[type];
		const codec = this.codecs[sqlType]?.[codecType];
		if (!codec) return value;
		if (codecType === "castParam" || codecType === "castArrayParam") return codec(value, column, column.dimensions);
		return codec(value, column.dimensions);
	}
};
function refineCodecs(source, extension = {}) {
	const keys = (/* @__PURE__ */ new Set([...Object.keys(source), ...Object.keys(extension)])).values();
	const result = {};
	for (const k of keys) {
		if (!(k in extension)) {
			result[k] = source[k] ? { ...source[k] } : void 0;
			continue;
		}
		if (!(k in source) || extension[k] === void 0) {
			result[k] = extension[k] ? { ...extension[k] } : void 0;
			continue;
		}
		const innerKeys = (/* @__PURE__ */ new Set([...Object.keys(extension[k]), ...Object.keys(source[k] ?? {})])).values();
		result[k] = {};
		for (const ik of innerKeys) result[k][ik] = ik in extension[k] ? extension[k][ik] : source[k]?.[ik];
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/codecs.js
const PG_ALIAS_TO_TYPE_MAP = {
	int2: "smallint",
	integer: "int",
	int4: "int",
	int8: "bigint",
	decimal: "numeric",
	real: "float4",
	double: "float8",
	"double precision": "float8",
	serial2: "smallserial",
	serial4: "serial",
	serial8: "bigserial",
	character: "char",
	"character varying": "varchar",
	"time with time zone": "timetz",
	"time without time zone": "time",
	"timestamp with time zone": "timestamptz",
	"timestamp without time zone": "timestamp",
	boolean: "bool",
	"bit varying": "varbit"
};
function resolvePgTypeAlias(type) {
	return PG_ALIAS_TO_TYPE_MAP[type] ?? type;
}
const unionsTypeTable = {
	smallint: {
		smallint: "smallint",
		int: "int",
		bigint: "bigint:number",
		"bigint:number": "bigint:number",
		"bigint:string": "bigint:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "smallint",
		serial: "int",
		bigserial: "bigint:number",
		"bigserial:number": "bigint:number",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	int: {
		smallint: "int",
		int: "int",
		bigint: "bigint:number",
		"bigint:number": "bigint:number",
		"bigint:string": "bigint:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "int",
		serial: "int",
		bigserial: "bigint:number",
		"bigserial:number": "bigint:number",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	bigint: {
		smallint: "bigint",
		int: "bigint",
		bigint: "bigint",
		"bigint:number": "bigint",
		"bigint:string": "bigint",
		numeric: "numeric:bigint",
		"numeric:number": "numeric:bigint",
		"numeric:bigint": "numeric:bigint",
		float4: "float4",
		float8: "float8",
		smallserial: "bigint",
		serial: "bigint",
		bigserial: "bigint",
		"bigserial:number": "bigint",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	"bigint:number": {
		smallint: "bigint:number",
		int: "bigint:number",
		bigint: "bigint:number",
		"bigint:number": "bigint:number",
		"bigint:string": "bigint:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "bigint:number",
		serial: "bigint:number",
		bigserial: "bigint:number",
		"bigserial:number": "bigint:number",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	"bigint:string": {
		smallint: "bigint:string",
		int: "bigint:string",
		bigint: "bigint:string",
		"bigint:number": "bigint:string",
		"bigint:string": "bigint:string",
		numeric: "numeric",
		"numeric:number": "numeric",
		"numeric:bigint": "numeric",
		float4: "float4",
		float8: "float8",
		smallserial: "bigint:string",
		serial: "bigint:string",
		bigserial: "bigint:string",
		"bigserial:number": "bigint:string",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	numeric: {
		smallint: "numeric",
		int: "numeric",
		bigint: "numeric",
		"bigint:number": "numeric",
		"bigint:string": "numeric",
		numeric: "numeric",
		"numeric:number": "numeric",
		"numeric:bigint": "numeric",
		float4: "float4",
		float8: "float8",
		smallserial: "numeric",
		serial: "numeric",
		bigserial: "numeric",
		"bigserial:number": "numeric"
	},
	"numeric:number": {
		smallint: "numeric:number",
		int: "numeric:number",
		bigint: "numeric:number",
		"bigint:number": "numeric:number",
		"bigint:string": "numeric:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "numeric:number",
		serial: "numeric:number",
		bigserial: "numeric:number",
		"bigserial:number": "numeric:number"
	},
	"numeric:bigint": {
		smallint: "numeric:bigint",
		int: "numeric:bigint",
		bigint: "numeric:bigint",
		"bigint:number": "numeric:bigint",
		"bigint:string": "numeric:bigint",
		numeric: "numeric:bigint",
		"numeric:number": "numeric:bigint",
		"numeric:bigint": "numeric:bigint",
		float4: "float4",
		float8: "float8",
		smallserial: "numeric:bigint",
		serial: "numeric:bigint",
		bigserial: "numeric:bigint",
		"bigserial:number": "numeric:bigint"
	},
	float4: {
		smallint: "float4",
		int: "float4",
		bigint: "float4",
		"bigint:number": "float4",
		"bigint:string": "float4",
		numeric: "float4",
		"numeric:number": "float4",
		"numeric:bigint": "float4",
		float4: "float4",
		float8: "float8",
		smallserial: "float4",
		serial: "float4",
		bigserial: "float4",
		"bigserial:number": "float4"
	},
	float8: {
		smallint: "float8",
		int: "float8",
		bigint: "float8",
		"bigint:number": "float8",
		"bigint:string": "float8",
		numeric: "float8",
		"numeric:number": "float8",
		"numeric:bigint": "float8",
		float4: "float8",
		float8: "float8",
		smallserial: "float8",
		serial: "float8",
		bigserial: "float8",
		"bigserial:number": "float8"
	},
	money: { money: "money" },
	smallserial: {
		smallint: "smallint",
		int: "int",
		bigint: "bigint:number",
		"bigint:number": "bigint:number",
		"bigint:string": "bigint:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "smallint",
		serial: "int",
		bigserial: "bigint:number",
		"bigserial:number": "bigint:number",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	serial: {
		smallint: "int",
		int: "int",
		bigint: "bigint:number",
		"bigint:number": "bigint:number",
		"bigint:string": "bigint:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "int",
		serial: "int",
		bigserial: "bigint:number",
		"bigserial:number": "bigint:number",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	bigserial: {
		smallint: "bigint",
		int: "bigint",
		bigint: "bigint",
		"bigint:number": "bigint",
		"bigint:string": "bigint",
		numeric: "numeric:bigint",
		"numeric:number": "numeric:bigint",
		"numeric:bigint": "numeric:bigint",
		float4: "float4",
		float8: "float8",
		smallserial: "bigint",
		serial: "bigint",
		bigserial: "bigint",
		"bigserial:number": "bigint",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	"bigserial:number": {
		smallint: "bigint:number",
		int: "bigint:number",
		bigint: "bigint:number",
		"bigint:number": "bigint:number",
		"bigint:string": "bigint:number",
		numeric: "numeric:number",
		"numeric:number": "numeric:number",
		"numeric:bigint": "numeric:number",
		float4: "float4",
		float8: "float8",
		smallserial: "bigint:number",
		serial: "bigint:number",
		bigserial: "bigint:number",
		"bigserial:number": "bigint:number",
		oid: "oid",
		regproc: "regproc",
		regprocedure: "regprocedure",
		regoper: "regoper",
		regoperator: "regoperator",
		regclass: "regclass",
		regtype: "regtype",
		regrole: "regrole",
		regnamespace: "regnamespace",
		regconfig: "regconfig",
		regdictionary: "regdictionary"
	},
	char: {
		char: "char",
		varchar: "char",
		text: "char"
	},
	varchar: {
		char: "varchar",
		varchar: "varchar",
		text: "varchar"
	},
	text: {
		char: "text",
		varchar: "text",
		text: "text"
	},
	bytea: { bytea: "bytea" },
	date: {
		date: "date",
		"date:string": "date",
		timestamp: "timestamp",
		"timestamp:string": "timestamp",
		timestamptz: "timestamptz",
		"timestamptz:string": "timestamptz"
	},
	"date:string": {
		date: "date:string",
		"date:string": "date:string",
		timestamp: "timestamp:string",
		"timestamp:string": "timestamp:string",
		timestamptz: "timestamptz:string",
		"timestamptz:string": "timestamptz:string"
	},
	time: {
		time: "time",
		timetz: "timetz"
	},
	timetz: {
		time: "timetz",
		timetz: "timetz"
	},
	timestamp: {
		date: "timestamp",
		"date:string": "timestamp",
		timestamp: "timestamp",
		"timestamp:string": "timestamp",
		timestamptz: "timestamptz",
		"timestamptz:string": "timestamptz"
	},
	"timestamp:string": {
		date: "timestamp:string",
		"date:string": "timestamp:string",
		timestamp: "timestamp:string",
		"timestamp:string": "timestamp:string",
		timestamptz: "timestamptz:string",
		"timestamptz:string": "timestamptz:string"
	},
	timestamptz: {
		date: "timestamptz",
		"date:string": "timestamptz",
		timestamp: "timestamptz",
		"timestamp:string": "timestamptz",
		timestamptz: "timestamptz",
		"timestamptz:string": "timestamptz"
	},
	"timestamptz:string": {
		date: "timestamptz:string",
		"date:string": "timestamptz:string",
		timestamp: "timestamptz:string",
		"timestamp:string": "timestamptz:string",
		timestamptz: "timestamptz:string",
		"timestamptz:string": "timestamptz:string"
	},
	interval: {
		interval: "interval",
		"interval:tuple": "interval"
	},
	"interval:tuple": {
		interval: "interval:tuple",
		"interval:tuple": "interval:tuple"
	},
	bool: { bool: "bool" },
	enum: { enum: "enum" },
	point: {
		point: "point",
		"point:tuple": "point"
	},
	"point:tuple": {
		point: "point:tuple",
		"point:tuple": "point:tuple"
	},
	line: {
		line: "line",
		"line:tuple": "line"
	},
	"line:tuple": {
		line: "line:tuple",
		"line:tuple": "line:tuple"
	},
	lseg: { lseg: "lseg" },
	box: { box: "box" },
	path: { path: "path" },
	polygon: { polygon: "polygon" },
	circle: { circle: "circle" },
	cidr: {
		cidr: "cidr",
		inet: "inet"
	},
	inet: {
		cidr: "inet",
		inet: "inet"
	},
	macaddr: {
		macaddr: "macaddr",
		macaddr8: "macaddr"
	},
	macaddr8: {
		macaddr: "macaddr8",
		macaddr8: "macaddr8"
	},
	bit: {
		bit: "bit",
		varbit: "bit"
	},
	varbit: {
		bit: "varbit",
		varbit: "varbit"
	},
	tsvector: { tsvector: "tsvector" },
	tsquery: { tsquery: "tsquery" },
	uuid: { uuid: "uuid" },
	xml: { xml: "xml" },
	json: { json: "json" },
	jsonb: { jsonb: "jsonb" },
	int4range: { int4range: "int4range" },
	int8range: { int8range: "int8range" },
	numrange: { numrange: "numrange" },
	tsrange: { tsrange: "tsrange" },
	tstzrange: { tstzrange: "tstzrange" },
	daterange: { daterange: "daterange" },
	int4multirange: { int4multirange: "int4multirange" },
	int8multirange: { int8multirange: "int8multirange" },
	nummultirange: { nummultirange: "nummultirange" },
	tsmultirange: { tsmultirange: "tsmultirange" },
	tstzmultirange: { tstzmultirange: "tstzmultirange" },
	datemultirange: { datemultirange: "datemultirange" },
	oid: {
		smallint: "oid",
		int: "oid",
		bigint: "oid",
		"bigint:number": "oid",
		"bigint:string": "oid",
		smallserial: "oid",
		serial: "oid",
		bigserial: "oid",
		"bigserial:number": "oid",
		oid: "oid",
		regproc: "oid",
		regprocedure: "oid",
		regoper: "oid",
		regoperator: "oid",
		regclass: "oid",
		regtype: "oid",
		regrole: "oid",
		regnamespace: "oid",
		regconfig: "oid",
		regdictionary: "oid"
	},
	regproc: {
		smallint: "regproc",
		int: "regproc",
		bigint: "regproc",
		"bigint:number": "regproc",
		"bigint:string": "regproc",
		smallserial: "regproc",
		serial: "regproc",
		bigserial: "regproc",
		"bigserial:number": "regproc",
		oid: "regproc",
		regproc: "regproc",
		regprocedure: "regproc"
	},
	regprocedure: {
		smallint: "regprocedure",
		int: "regprocedure",
		bigint: "regprocedure",
		"bigint:number": "regprocedure",
		"bigint:string": "regprocedure",
		smallserial: "regprocedure",
		serial: "regprocedure",
		bigserial: "regprocedure",
		"bigserial:number": "regprocedure",
		oid: "regprocedure",
		regproc: "regprocedure",
		regprocedure: "regprocedure"
	},
	regoper: {
		smallint: "regoper",
		int: "regoper",
		bigint: "regoper",
		"bigint:number": "regoper",
		"bigint:string": "regoper",
		smallserial: "regoper",
		serial: "regoper",
		bigserial: "regoper",
		"bigserial:number": "regoper",
		oid: "regoper",
		regoper: "regoper",
		regoperator: "regoper"
	},
	regoperator: {
		smallint: "regoperator",
		int: "regoperator",
		bigint: "regoperator",
		"bigint:number": "regoperator",
		"bigint:string": "regoperator",
		smallserial: "regoperator",
		serial: "regoperator",
		bigserial: "regoperator",
		"bigserial:number": "regoperator",
		oid: "regoperator",
		regoper: "regoperator",
		regoperator: "regoperator"
	},
	regclass: {
		smallint: "regclass",
		int: "regclass",
		bigint: "regclass",
		"bigint:number": "regclass",
		"bigint:string": "regclass",
		smallserial: "regclass",
		serial: "regclass",
		bigserial: "regclass",
		"bigserial:number": "regclass",
		oid: "regclass",
		regclass: "regclass"
	},
	regtype: {
		smallint: "regtype",
		int: "regtype",
		bigint: "regtype",
		"bigint:number": "regtype",
		"bigint:string": "regtype",
		smallserial: "regtype",
		serial: "regtype",
		bigserial: "regtype",
		"bigserial:number": "regtype",
		oid: "regtype",
		regtype: "regtype"
	},
	regrole: {
		smallint: "regrole",
		int: "regrole",
		bigint: "regrole",
		"bigint:number": "regrole",
		"bigint:string": "regrole",
		smallserial: "regrole",
		serial: "regrole",
		bigserial: "regrole",
		"bigserial:number": "regrole",
		oid: "regrole",
		regrole: "regrole"
	},
	regnamespace: {
		smallint: "regnamespace",
		int: "regnamespace",
		bigint: "regnamespace",
		"bigint:number": "regnamespace",
		"bigint:string": "regnamespace",
		smallserial: "regnamespace",
		serial: "regnamespace",
		bigserial: "regnamespace",
		"bigserial:number": "regnamespace",
		oid: "regnamespace",
		regnamespace: "regnamespace"
	},
	regconfig: {
		smallint: "regconfig",
		int: "regconfig",
		bigint: "regconfig",
		"bigint:number": "regconfig",
		"bigint:string": "regconfig",
		smallserial: "regconfig",
		serial: "regconfig",
		bigserial: "regconfig",
		"bigserial:number": "regconfig",
		oid: "regconfig",
		regconfig: "regconfig"
	},
	regdictionary: {
		smallint: "regdictionary",
		int: "regdictionary",
		bigint: "regdictionary",
		"bigint:number": "regdictionary",
		"bigint:string": "regdictionary",
		smallserial: "regdictionary",
		serial: "regdictionary",
		bigserial: "regdictionary",
		"bigserial:number": "regdictionary",
		oid: "regdictionary",
		regdictionary: "regdictionary"
	}
};
const castToText = (name) => sql`${name}::text`;
const castToTextArr = (name, arrayDimensions) => sql`${name}::text${sql.raw("[]".repeat(arrayDimensions))}`;
/** Used for cases when casting requires to unwrap and rebuild arrays
*
* @example
* string_mtx::text[][] // can be casted to array directly
*
* encode(bytea_mtx, 'base64')[][] // invalid syntax, cast requires unwrapping and rebuilding array
*/
const arrayCompatCast = (cast) => (name, arrayDimensions) => {
	if (!arrayDimensions) return cast(name);
	const aliases = [];
	for (let i = 0; i < arrayDimensions; i++) aliases.push(sql.identifier(`s${i}`));
	let indexed = name;
	for (const alias of aliases) indexed = sql`${indexed}[${alias}]`;
	let expression = sql`array(\
select ${cast(indexed)} \
from generate_subscripts(${name}, ${sql.raw(arrayDimensions.toString())}) ${aliases[arrayDimensions - 1]} \
order by ${aliases[arrayDimensions - 1]})`;
	for (let dim = arrayDimensions - 1; dim > 0; dim--) expression = sql`array(\
select ${expression} \
from generate_subscripts(${name}, ${sql.raw(dim.toString())}) ${aliases[dim - 1]} \
order by ${aliases[dim - 1]})`;
	return sql`case when ${name} is null then null else ${expression} end`;
};
/** Used to recursively apply value normalizer to array of unknown dimensions */
const arrayCompatNormalize = (normalize) => {
	const loop = (value, arrayDimensions) => {
		const innerDimensions = arrayDimensions - 1;
		if (arrayDimensions > 1) for (let i = 0; i < value.length; ++i) loop(value[i], innerDimensions);
		else for (let i = 0; i < value.length; ++i) value[i] = normalize(value[i]);
		return value;
	};
	return loop;
};
/** Doesn't mutate original data - used for insertions */
const arrayCompatNormalizeInput = (normalize, transformToPgArray = false) => {
	const loop = (value, arrayDimensions) => {
		const innerDimensions = arrayDimensions - 1;
		const out = Array.from({ length: value.length });
		if (arrayDimensions > 1) for (let i = 0; i < value.length; ++i) out[i] = loop(value[i], innerDimensions);
		else for (let i = 0; i < value.length; ++i) out[i] = normalize(value[i]);
		return out;
	};
	return transformToPgArray ? (v, d) => makePgArray(loop(v, d)) : loop;
};
/** Parses a raw PG array text representation, then applies a per-item normalizer */
const parsePgArrayAndNormalize = (normalize) => {
	const codec = arrayCompatNormalize(normalize);
	return (value, arrayDimensions) => codec(parsePgArray(value), arrayDimensions);
};
const parseLineTuple = (v) => {
	const [a, b, c] = v.slice(1, -1).split(",");
	return [
		Number.parseFloat(a),
		Number.parseFloat(b),
		Number.parseFloat(c)
	];
};
const parseLineABC = (v) => {
	const [a, b, c] = v.slice(1, -1).split(",");
	return {
		a: Number.parseFloat(a),
		b: Number.parseFloat(b),
		c: Number.parseFloat(c)
	};
};
const parsePointTuple = (v) => {
	const [x, y] = v.slice(1, -1).split(",");
	return [Number.parseFloat(x), Number.parseFloat(y)];
};
const parsePointXY = (v) => {
	const [x, y] = v.slice(1, -1).split(",");
	return {
		x: Number.parseFloat(x),
		y: Number.parseFloat(y)
	};
};
const parseGeometryTuple = (v) => parseEWKB(v).point;
const parseGeometryXY = (v) => {
	const parsed = parseEWKB(v);
	return {
		x: parsed.point[0],
		y: parsed.point[1]
	};
};
const textToDate = (v) => new Date(v);
const textToDateWithTz = (v) => /* @__PURE__ */ new Date(v + "+0000");
const parsePgVector = (v) => {
	const body = v.slice(1, -1);
	if (body.length === 0) return [];
	return body.split(",").map(Number.parseFloat);
};
const genericPgCodecs = {
	bytea: {
		castInJson: (name) => sql`encode(${name}, 'base64')`,
		castArrayInJson: arrayCompatCast((name) => sql`encode(${name}, 'base64')`),
		normalizeInJson: (v) => Buffer.from(v, "base64"),
		normalizeArrayInJson: arrayCompatNormalize((v) => Buffer.from(v, "base64"))
	},
	bigint: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalizeInJson: BigInt,
		normalizeArrayInJson: arrayCompatNormalize(BigInt)
	},
	"bigint:number": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: Number,
		normalizeArray: arrayCompatNormalize(Number),
		normalizeInJson: Number,
		normalizeArrayInJson: arrayCompatNormalize(Number)
	},
	"bigint:string": {
		castInJson: castToText,
		castArrayInJson: castToTextArr
	},
	bigserial: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalizeInJson: BigInt,
		normalizeArrayInJson: arrayCompatNormalize(BigInt),
		normalize: BigInt,
		normalizeArray: arrayCompatNormalize(BigInt)
	},
	"bigserial:number": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: Number,
		normalizeArray: arrayCompatNormalize(Number),
		normalizeInJson: Number,
		normalizeArrayInJson: arrayCompatNormalize(Number)
	},
	date: {
		normalizeInJson: textToDate,
		normalizeArrayInJson: arrayCompatNormalize(textToDate)
	},
	"date:string": {},
	enum: {
		castArray: castToTextArr,
		normalizeParamArray: makePgArray
	},
	"geometry(point)": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: parseGeometryXY,
		normalizeArray: arrayCompatNormalize(parseGeometryXY),
		normalizeInJson: parseGeometryXY,
		normalizeArrayInJson: arrayCompatNormalize(parseGeometryXY)
	},
	"geometry(point):tuple": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: parseGeometryTuple,
		normalizeArray: arrayCompatNormalize(parseGeometryTuple),
		normalizeInJson: parseGeometryTuple,
		normalizeArrayInJson: arrayCompatNormalize(parseGeometryTuple)
	},
	interval: { castArrayInJson: castToTextArr },
	json: { normalizeParamArray: arrayCompatNormalizeInput((v) => JSON.stringify(v), true) },
	jsonb: { normalizeParamArray: arrayCompatNormalizeInput((v) => JSON.stringify(v), true) },
	line: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: parseLineABC,
		normalizeArray: arrayCompatNormalize(parseLineABC),
		normalizeInJson: parseLineABC,
		normalizeArrayInJson: arrayCompatNormalize(parseLineABC)
	},
	"line:tuple": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: parseLineTuple,
		normalizeArray: arrayCompatNormalize(parseLineTuple),
		normalizeInJson: parseLineTuple,
		normalizeArrayInJson: arrayCompatNormalize(parseLineTuple)
	},
	numeric: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		castArray: castToTextArr
	},
	"numeric:number": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		castArray: castToTextArr,
		normalize: Number,
		normalizeArray: arrayCompatNormalize(Number),
		normalizeInJson: Number,
		normalizeArrayInJson: arrayCompatNormalize(Number)
	},
	"numeric:bigint": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		castArray: castToTextArr,
		normalize: BigInt,
		normalizeArray: arrayCompatNormalize(BigInt),
		normalizeInJson: BigInt,
		normalizeArrayInJson: arrayCompatNormalize(BigInt)
	},
	point: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: parsePointXY,
		normalizeArray: arrayCompatNormalize(parsePointXY),
		normalizeInJson: parsePointXY,
		normalizeArrayInJson: arrayCompatNormalize(parsePointXY)
	},
	"point:tuple": {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalize: parsePointTuple,
		normalizeArray: arrayCompatNormalize(parsePointTuple),
		normalizeInJson: parsePointTuple,
		normalizeArrayInJson: arrayCompatNormalize(parsePointTuple)
	},
	timestamp: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalizeInJson: textToDateWithTz,
		normalizeArrayInJson: arrayCompatNormalize(textToDateWithTz)
	},
	timestamptz: {
		castInJson: castToText,
		castArrayInJson: castToTextArr,
		normalizeInJson: textToDate,
		normalizeArrayInJson: arrayCompatNormalize(textToDate)
	},
	"timestamp:string": {
		castInJson: castToText,
		castArrayInJson: castToTextArr
	},
	"timestamptz:string": {
		castInJson: castToText,
		castArrayInJson: castToTextArr
	},
	halfvec: {
		normalize: parsePgVector,
		normalizeArray: parsePgArrayAndNormalize(parsePgVector),
		normalizeInJson: parsePgVector,
		normalizeArrayInJson: arrayCompatNormalize(parsePgVector)
	},
	vector: {
		normalize: parsePgVector,
		normalizeArray: parsePgArrayAndNormalize(parsePgVector),
		normalizeInJson: parsePgVector,
		normalizeArrayInJson: arrayCompatNormalize(parsePgVector)
	}
};
const refineGenericPgCodecs = (extension) => refineCodecs(genericPgCodecs, extension);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/custom.js
var PgCustomColumnBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgCustomColumnBuilder";
	constructor(name, fieldConfig, customTypeParams) {
		super(name, "custom", "PgCustomColumn");
		this.config.fieldConfig = fieldConfig;
		this.config.customTypeParams = customTypeParams;
	}
	/** @internal */
	build(table) {
		return new PgCustomColumn(table, this.config);
	}
};
var PgCustomColumn = class extends PgColumn {
	static [entityKind] = "PgCustomColumn";
	/** @internal */
	codec;
	sqlName;
	mapFromJsonValue;
	jsonSelectIdentifier;
	constructor(table, config) {
		super(table, config);
		this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
		this.mapToDriverValue = config.customTypeParams.toDriver ?? this.mapToDriverValue;
		this.mapFromDriverValue = config.customTypeParams.fromDriver ?? this.mapFromDriverValue;
		this.mapFromJsonValue = config.customTypeParams.fromJson;
		this.jsonSelectIdentifier = config.customTypeParams.forJsonSelect;
		const cfgCodec = typeof config.customTypeParams.codec === "string" || typeof config.customTypeParams.codec === "undefined" ? config.customTypeParams.codec : config.customTypeParams.codec(config.fieldConfig);
		this.codec = typeof cfgCodec === "string" ? resolvePgTypeAlias(cfgCodec) : void 0;
		if (this.dimensions && config.customTypeParams.fromJson) this.mapFromJsonValue = (value) => {
			if (value === null) return value;
			const arr = typeof value === "string" ? parsePgArray(value) : value;
			return this.mapJsonArrayElements(arr, config.customTypeParams.fromJson, this.dimensions);
		};
	}
	/** @internal */
	mapJsonArrayElements(value, mapper, depth) {
		if (depth > 0 && Array.isArray(value)) return value.map((v) => v === null ? null : this.mapJsonArrayElements(v, mapper, depth - 1));
		return mapper(value);
	}
	getSQLType() {
		return this.sqlName;
	}
};
/**
* Custom pg database data type generator
*/
function customType(customTypeParams) {
	return (a, b) => {
		const { name, config } = getColumnNameAndConfig(a, b);
		return new PgCustomColumnBuilder(name, config, customTypeParams);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/date.common.js
var PgDateColumnBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgDateColumnBaseBuilder";
	/**
	* Adds a `default now()` clause to the column definition.
	* Available for date/time column types.
	*/
	defaultNow() {
		return this.default(sql`now()`);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/date.js
var PgDateBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgDateBuilder";
	constructor(name) {
		super(name, "object date", "PgDate");
	}
	/** @internal */
	build(table) {
		return new PgDate(table, this.config);
	}
};
var PgDate = class extends PgColumn {
	static [entityKind] = "PgDate";
	/** @internal */
	codec = "date";
	getSQLType() {
		return "date";
	}
	mapToDriverValue = function(value) {
		if (typeof value === "string") return value;
		return value.toISOString();
	};
};
var PgDateStringBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgDateStringBuilder";
	constructor(name) {
		super(name, "string date", "PgDateString");
	}
	/** @internal */
	build(table) {
		return new PgDateString(table, this.config);
	}
};
var PgDateString = class extends PgColumn {
	static [entityKind] = "PgDateString";
	/** @internal */
	codec = "date:string";
	getSQLType() {
		return "date";
	}
	mapToDriverValue = (value) => {
		if (typeof value === "string") return value;
		return value.toISOString();
	};
};
function date(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "date") return new PgDateBuilder(name);
	return new PgDateStringBuilder(name);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/double-precision.js
var PgDoublePrecisionBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgDoublePrecisionBuilder";
	constructor(name) {
		super(name, "number double", "PgDoublePrecision");
	}
	/** @internal */
	build(table) {
		return new PgDoublePrecision(table, this.config);
	}
};
var PgDoublePrecision = class extends PgColumn {
	static [entityKind] = "PgDoublePrecision";
	/** @internal */
	codec = "float8";
	getSQLType() {
		return "double precision";
	}
};
function doublePrecision(name) {
	return new PgDoublePrecisionBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/inet.js
var PgInetBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgInetBuilder";
	constructor(name) {
		super(name, "string inet", "PgInet");
	}
	/** @internal */
	build(table) {
		return new PgInet(table, this.config);
	}
};
var PgInet = class extends PgColumn {
	static [entityKind] = "PgInet";
	/** @internal */
	codec = "inet";
	getSQLType() {
		return "inet";
	}
};
function inet(name) {
	return new PgInetBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/integer.js
var PgIntegerBuilder = class extends PgIntColumnBuilder {
	static [entityKind] = "PgIntegerBuilder";
	constructor(name) {
		super(name, "number int32", "PgInteger");
	}
	/** @internal */
	build(table) {
		return new PgInteger(table, this.config);
	}
};
var PgInteger = class extends PgColumn {
	static [entityKind] = "PgInteger";
	/** @internal */
	codec = "int";
	getSQLType() {
		return "integer";
	}
};
function integer(name) {
	return new PgIntegerBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/interval.js
var PgIntervalBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgIntervalBuilder";
	constructor(name, intervalConfig) {
		super(name, "string interval", "PgInterval");
		this.config.intervalConfig = intervalConfig;
	}
	/** @internal */
	build(table) {
		return new PgInterval(table, this.config);
	}
};
var PgInterval = class extends PgColumn {
	static [entityKind] = "PgInterval";
	/** @internal */
	codec = "interval";
	fields;
	precision;
	constructor(table, config) {
		super(table, config);
		this.fields = config.intervalConfig.fields;
		this.precision = config.intervalConfig.precision;
	}
	getSQLType() {
		return `interval${this.fields ? ` ${this.fields}` : ""}${this.precision ? `(${this.precision})` : ""}`;
	}
};
function interval(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgIntervalBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/json.js
var PgJsonBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgJsonBuilder";
	constructor(name) {
		super(name, "object json", "PgJson");
	}
	/** @internal */
	build(table) {
		return new PgJson(table, this.config);
	}
};
var PgJson = class extends PgColumn {
	static [entityKind] = "PgJson";
	/** @internal */
	codec = "json";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "json";
	}
};
function json(name) {
	return new PgJsonBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/jsonb.js
var PgJsonbBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgJsonbBuilder";
	constructor(name) {
		super(name, "object json", "PgJsonb");
	}
	/** @internal */
	build(table) {
		return new PgJsonb(table, this.config);
	}
};
var PgJsonb = class extends PgColumn {
	static [entityKind] = "PgJsonb";
	/** @internal */
	codec = "jsonb";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "jsonb";
	}
};
function jsonb(name) {
	return new PgJsonbBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/line.js
var PgLineBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgLineBuilder";
	constructor(name) {
		super(name, "array line", "PgLine");
	}
	/** @internal */
	build(table) {
		return new PgLineTuple(table, this.config);
	}
};
var PgLineTuple = class extends PgColumn {
	static [entityKind] = "PgLine";
	/** @internal */
	codec = "line:tuple";
	mode = "tuple";
	getSQLType() {
		return "line";
	}
	mapToDriverValue = (value) => {
		return `{${value[0]},${value[1]},${value[2]}}`;
	};
};
var PgLineABCBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgLineABCBuilder";
	constructor(name) {
		super(name, "object line", "PgLineABC");
	}
	/** @internal */
	build(table) {
		return new PgLineABC(table, this.config);
	}
};
var PgLineABC = class extends PgColumn {
	static [entityKind] = "PgLineABC";
	/** @internal */
	codec = "line";
	mode = "abc";
	getSQLType() {
		return "line";
	}
	mapToDriverValue = (value) => {
		return `{${value.a},${value.b},${value.c}}`;
	};
};
function line(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (!config?.mode || config.mode === "tuple") return new PgLineBuilder(name);
	return new PgLineABCBuilder(name);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/macaddr.js
var PgMacaddrBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgMacaddrBuilder";
	constructor(name) {
		super(name, "string macaddr", "PgMacaddr");
	}
	/** @internal */
	build(table) {
		return new PgMacaddr(table, this.config);
	}
};
var PgMacaddr = class extends PgColumn {
	static [entityKind] = "PgMacaddr";
	/** @internal */
	codec = "macaddr";
	getSQLType() {
		return "macaddr";
	}
};
function macaddr(name) {
	return new PgMacaddrBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/macaddr8.js
var PgMacaddr8Builder = class extends PgColumnBuilder {
	static [entityKind] = "PgMacaddr8Builder";
	constructor(name) {
		super(name, "string macaddr8", "PgMacaddr8");
	}
	/** @internal */
	build(table) {
		return new PgMacaddr8(table, this.config);
	}
};
var PgMacaddr8 = class extends PgColumn {
	static [entityKind] = "PgMacaddr8";
	/** @internal */
	codec = "macaddr8";
	getSQLType() {
		return "macaddr8";
	}
};
function macaddr8(name) {
	return new PgMacaddr8Builder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/numeric.js
var PgNumericBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgNumericBuilder";
	constructor(name, precision, scale) {
		super(name, "string numeric", "PgNumeric");
		this.config.precision = precision;
		this.config.scale = scale;
	}
	/** @internal */
	build(table) {
		return new PgNumeric(table, this.config);
	}
};
var PgNumeric = class extends PgColumn {
	static [entityKind] = "PgNumeric";
	/** @internal */
	codec = "numeric";
	precision;
	scale;
	constructor(table, config) {
		super(table, config);
		this.precision = config.precision;
		this.scale = config.scale;
	}
	getSQLType() {
		if (this.precision !== void 0 && this.scale !== void 0) return `numeric(${this.precision}, ${this.scale})`;
		else if (this.precision === void 0) return "numeric";
		else return `numeric(${this.precision})`;
	}
};
var PgNumericNumberBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgNumericNumberBuilder";
	constructor(name, precision, scale) {
		super(name, "number", "PgNumericNumber");
		this.config.precision = precision;
		this.config.scale = scale;
	}
	/** @internal */
	build(table) {
		return new PgNumericNumber(table, this.config);
	}
};
var PgNumericNumber = class extends PgColumn {
	static [entityKind] = "PgNumericNumber";
	/** @internal */
	codec = "numeric:number";
	precision;
	scale;
	constructor(table, config) {
		super(table, config);
		this.precision = config.precision;
		this.scale = config.scale;
	}
	mapToDriverValue = String;
	getSQLType() {
		if (this.precision !== void 0 && this.scale !== void 0) return `numeric(${this.precision}, ${this.scale})`;
		else if (this.precision === void 0) return "numeric";
		else return `numeric(${this.precision})`;
	}
};
var PgNumericBigIntBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgNumericBigIntBuilder";
	constructor(name, precision, scale) {
		super(name, "bigint int64", "PgNumericBigInt");
		this.config.precision = precision;
		this.config.scale = scale;
	}
	/** @internal */
	build(table) {
		return new PgNumericBigInt(table, this.config);
	}
};
var PgNumericBigInt = class extends PgColumn {
	static [entityKind] = "PgNumericBigInt";
	/** @internal */
	codec = "numeric:bigint";
	precision;
	scale;
	constructor(table, config) {
		super(table, config);
		this.precision = config.precision;
		this.scale = config.scale;
	}
	mapToDriverValue = String;
	getSQLType() {
		if (this.precision !== void 0 && this.scale !== void 0) return `numeric(${this.precision}, ${this.scale})`;
		else if (this.precision === void 0) return "numeric";
		else return `numeric(${this.precision})`;
	}
};
function numeric(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	const mode = config?.mode;
	return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/point.js
var PgPointTupleBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgPointTupleBuilder";
	constructor(name) {
		super(name, "array point", "PgPointTuple");
	}
	/** @internal */
	build(table) {
		return new PgPointTuple(table, this.config);
	}
};
var PgPointTuple = class extends PgColumn {
	static [entityKind] = "PgPointTuple";
	/** @internal */
	codec = "point:tuple";
	mode = "tuple";
	getSQLType() {
		return "point";
	}
	mapToDriverValue = (value) => {
		return `(${value[0]},${value[1]})`;
	};
};
var PgPointObjectBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgPointObjectBuilder";
	constructor(name) {
		super(name, "object point", "PgPointObject");
	}
	/** @internal */
	build(table) {
		return new PgPointObject(table, this.config);
	}
};
var PgPointObject = class extends PgColumn {
	static [entityKind] = "PgPointObject";
	/** @internal */
	codec = "point";
	mode = "xy";
	getSQLType() {
		return "point";
	}
	mapToDriverValue = (value) => {
		return `(${value.x},${value.y})`;
	};
};
function point(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (!config?.mode || config.mode === "tuple") return new PgPointTupleBuilder(name);
	return new PgPointObjectBuilder(name);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.js
var PgGeometryBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgGeometryBuilder";
	constructor(name, srid) {
		super(name, "array geometry", "PgGeometry");
		this.config.srid = srid;
	}
	/** @internal */
	build(table) {
		return new PgGeometry(table, this.config);
	}
};
var PgGeometry = class extends PgColumn {
	static [entityKind] = "PgGeometry";
	/** @internal */
	codec = "geometry(point):tuple";
	srid = this.config.srid;
	mode = "tuple";
	getSQLType() {
		return `geometry(point${this.srid === void 0 ? "" : `,${this.srid}`})`;
	}
	mapToDriverValue = (value) => {
		return `point(${value[0]} ${value[1]})`;
	};
};
var PgGeometryObjectBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgGeometryObjectBuilder";
	constructor(name, srid) {
		super(name, "object geometry", "PgGeometryObject");
		this.config.srid = srid;
	}
	/** @internal */
	build(table) {
		return new PgGeometryObject(table, this.config);
	}
};
var PgGeometryObject = class extends PgColumn {
	static [entityKind] = "PgGeometryObject";
	/** @internal */
	codec = "geometry(point)";
	srid = this.config.srid;
	mode = "object";
	getSQLType() {
		return `geometry(point${this.srid === void 0 ? "" : `,${this.srid}`})`;
	}
	mapToDriverValue = (value) => {
		return `point(${value.x} ${value.y})`;
	};
};
function geometry(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (!config?.mode || config.mode === "tuple") return new PgGeometryBuilder(name, config?.srid);
	return new PgGeometryObjectBuilder(name, config?.srid);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/real.js
var PgRealBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgRealBuilder";
	constructor(name, length) {
		super(name, "number float", "PgReal");
		this.config.length = length;
	}
	/** @internal */
	build(table) {
		return new PgReal(table, this.config);
	}
};
var PgReal = class extends PgColumn {
	static [entityKind] = "PgReal";
	/** @internal */
	codec = "float4";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "real";
	}
};
function real(name) {
	return new PgRealBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/serial.js
var PgSerialBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgSerialBuilder";
	constructor(name) {
		super(name, "number int32", "PgSerial");
		this.config.hasDefault = true;
		this.config.notNull = true;
	}
	/** @internal */
	build(table) {
		return new PgSerial(table, this.config);
	}
};
var PgSerial = class extends PgColumn {
	static [entityKind] = "PgSerial";
	/** @internal */
	codec = "serial";
	getSQLType() {
		return "serial";
	}
};
function serial(name) {
	return new PgSerialBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/smallint.js
var PgSmallIntBuilder = class extends PgIntColumnBuilder {
	static [entityKind] = "PgSmallIntBuilder";
	constructor(name) {
		super(name, "number int16", "PgSmallInt");
	}
	/** @internal */
	build(table) {
		return new PgSmallInt(table, this.config);
	}
};
var PgSmallInt = class extends PgColumn {
	static [entityKind] = "PgSmallInt";
	/** @internal */
	codec = "smallint";
	getSQLType() {
		return "smallint";
	}
};
function smallint(name) {
	return new PgSmallIntBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/smallserial.js
var PgSmallSerialBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgSmallSerialBuilder";
	constructor(name) {
		super(name, "number int16", "PgSmallSerial");
		this.config.hasDefault = true;
		this.config.notNull = true;
	}
	/** @internal */
	build(table) {
		return new PgSmallSerial(table, this.config);
	}
};
var PgSmallSerial = class extends PgColumn {
	static [entityKind] = "PgSmallSerial";
	/** @internal */
	codec = "smallserial";
	getSQLType() {
		return "smallserial";
	}
};
function smallserial(name) {
	return new PgSmallSerialBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/text.js
var PgTextBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgTextBuilder";
	constructor(name, config) {
		super(name, config.enum?.length ? "string enum" : "string", "PgText");
		this.config.enumValues = config.enum;
	}
	/** @internal */
	build(table) {
		return new PgText(table, this.config, this.config.enumValues);
	}
};
var PgText = class extends PgColumn {
	static [entityKind] = "PgText";
	enumValues;
	/** @internal */
	codec = "text";
	constructor(table, config, enumValues) {
		super(table, config);
		this.enumValues = enumValues;
	}
	getSQLType() {
		return "text";
	}
};
function text(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgTextBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/time.js
var PgTimeBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgTimeBuilder";
	constructor(name, withTimezone, precision) {
		super(name, "string time", "PgTime");
		this.withTimezone = withTimezone;
		this.precision = precision;
		this.config.withTimezone = withTimezone;
		this.config.precision = precision;
	}
	/** @internal */
	build(table) {
		return new PgTime(table, this.config);
	}
};
var PgTime = class extends PgColumn {
	static [entityKind] = "PgTime";
	/** @internal */
	codec = "time";
	withTimezone;
	precision;
	constructor(table, config) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}
	getSQLType() {
		return `time${this.precision === void 0 ? "" : `(${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
	}
};
function time(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/timestamp.js
var PgTimestampBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgTimestampBuilder";
	constructor(name, withTimezone, precision) {
		super(name, "object date", "PgTimestamp");
		this.config.withTimezone = withTimezone;
		this.config.precision = precision;
	}
	/** @internal */
	build(table) {
		return new PgTimestamp(table, this.config);
	}
};
var PgTimestamp = class extends PgColumn {
	static [entityKind] = "PgTimestamp";
	/** @internal */
	codec;
	withTimezone;
	precision;
	constructor(table, config) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
		this.codec = this.withTimezone ? "timestamptz" : "timestamp";
	}
	getSQLType() {
		return `timestamp${this.precision === void 0 ? "" : ` (${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
	}
	mapToDriverValue = (value) => {
		if (typeof value === "string") return value;
		return value.toISOString();
	};
};
var PgTimestampStringBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgTimestampStringBuilder";
	constructor(name, withTimezone, precision) {
		super(name, "string timestamp", "PgTimestampString");
		this.config.withTimezone = withTimezone;
		this.config.precision = precision;
	}
	/** @internal */
	build(table) {
		return new PgTimestampString(table, this.config);
	}
};
var PgTimestampString = class extends PgColumn {
	static [entityKind] = "PgTimestampString";
	/** @internal */
	codec;
	withTimezone;
	precision;
	constructor(table, config) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
		this.codec = this.withTimezone ? "timestamptz:string" : "timestamp:string";
	}
	getSQLType() {
		return `timestamp${this.precision === void 0 ? "" : `(${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
	}
	mapToDriverValue = (value) => {
		if (typeof value === "string") return value;
		return value.toISOString();
	};
};
function timestamp(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "string") return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
	return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/uuid.js
var PgUUIDBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgUUIDBuilder";
	constructor(name) {
		super(name, "string uuid", "PgUUID");
	}
	/**
	* Adds `default gen_random_uuid()` to the column definition.
	*/
	defaultRandom() {
		return this.default(sql`gen_random_uuid()`);
	}
	/** @internal */
	build(table) {
		return new PgUUID(table, this.config);
	}
};
var PgUUID = class extends PgColumn {
	static [entityKind] = "PgUUID";
	/** @internal */
	codec = "uuid";
	getSQLType() {
		return "uuid";
	}
};
function uuid(name) {
	return new PgUUIDBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/varchar.js
var PgVarcharBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgVarcharBuilder";
	constructor(name, config) {
		super(name, config.enum?.length ? "string enum" : "string", "PgVarchar");
		this.config.length = config.length;
		this.config.enumValues = config.enum;
	}
	/** @internal */
	build(table) {
		return new PgVarchar(table, this.config);
	}
};
var PgVarchar = class extends PgColumn {
	static [entityKind] = "PgVarchar";
	/** @internal */
	codec = "varchar";
	enumValues;
	constructor(table, config) {
		super(table, config);
		this.enumValues = config.enumValues;
	}
	getSQLType() {
		return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
	}
};
function varchar(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgVarcharBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.js
var PgBinaryVectorBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgBinaryVectorBuilder";
	constructor(name, config) {
		super(name, "string binary", "PgBinaryVector");
		this.config.length = config.dimensions;
		this.config.isLengthExact = true;
	}
	/** @internal */
	build(table) {
		return new PgBinaryVector(table, this.config);
	}
};
var PgBinaryVector = class extends PgColumn {
	static [entityKind] = "PgBinaryVector";
	/** @internal */
	codec = "bit";
	getSQLType() {
		return `bit(${this.length})`;
	}
};
function bit(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgBinaryVectorBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.js
var PgHalfVectorBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgHalfVectorBuilder";
	constructor(name, config) {
		super(name, "array halfvector", "PgHalfVector");
		this.config.length = config.dimensions;
		this.config.isLengthExact = true;
	}
	/** @internal */
	build(table) {
		return new PgHalfVector(table, this.config);
	}
};
var PgHalfVector = class extends PgColumn {
	static [entityKind] = "PgHalfVector";
	/** @internal */
	codec = "halfvec";
	getSQLType() {
		return `halfvec(${this.length})`;
	}
	mapToDriverValue = (value) => {
		return JSON.stringify(value);
	};
};
function halfvec(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgHalfVectorBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.js
var PgSparseVectorBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgSparseVectorBuilder";
	constructor(name, config) {
		super(name, "string sparsevec", "PgSparseVector");
		this.config.vectorDimensions = config.dimensions;
	}
	/** @internal */
	build(table) {
		return new PgSparseVector(table, this.config);
	}
};
var PgSparseVector = class extends PgColumn {
	static [entityKind] = "PgSparseVector";
	/** @internal */
	codec = "sparsevec";
	vectorDimensions = this.config.vectorDimensions;
	getSQLType() {
		return `sparsevec(${this.vectorDimensions})`;
	}
};
function sparsevec(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgSparseVectorBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js
var PgVectorBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgVectorBuilder";
	constructor(name, config) {
		super(name, "array vector", "PgVector");
		this.config.length = config.dimensions;
		this.config.isLengthExact = true;
	}
	/** @internal */
	build(table) {
		return new PgVector(table, this.config);
	}
};
var PgVector = class extends PgColumn {
	static [entityKind] = "PgVector";
	/** @internal */
	codec = "vector";
	getSQLType() {
		return `vector(${this.length})`;
	}
	mapToDriverValue = (value) => {
		return JSON.stringify(value);
	};
};
function vector(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgVectorBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/columns/all.js
function getPgColumnBuilders() {
	return {
		bigint,
		bigserial,
		boolean,
		char,
		cidr,
		customType,
		date,
		doublePrecision,
		inet,
		integer,
		interval,
		json,
		jsonb,
		line,
		macaddr,
		macaddr8,
		numeric,
		point,
		geometry,
		real,
		serial,
		smallint,
		smallserial,
		text,
		time,
		timestamp,
		uuid,
		varchar,
		bit,
		halfvec,
		sparsevec,
		vector
	};
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((acc, word, i) => {
		return acc + (i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`);
	}, "");
}
function getCasingFn(casing) {
	if (casing === "snake_case") return toSnakeCase;
	if (casing === "camelCase") return toCamelCase;
	return (name) => name;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/table.js
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
	static [entityKind] = "PgTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, {
		InlineForeignKeys,
		EnableRLS
	});
	/**@internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[EnableRLS] = false;
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
	/** @internal */
	[Table.Symbol.ExtraConfigColumns] = {};
};
/** @internal */
function pgTableWithSchema(name, columns, extraConfig, schema, casing, baseName = name) {
	const casingFn = getCasingFn(casing);
	const rawTable = new PgTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name, casingFn);
		const column = colBuilder.build(rawTable).postBuild();
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name, column];
	}));
	const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name, casingFn);
		return [name, colBuilder.buildExtraConfigColumn(rawTable)];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
	if (extraConfig) table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[PgTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
/** @internal */
function pgTableWithCasing(casing) {
	const pgTableInternal = (name, columns, extraConfig) => {
		return pgTableWithSchema(name, columns, extraConfig, void 0, casing);
	};
	const pgTableWithRLS = (name, columns, extraConfig) => {
		const table = pgTableWithSchema(name, columns, extraConfig, void 0, casing);
		table[EnableRLS] = true;
		return table;
	};
	return Object.assign(pgTableInternal, { withRLS: pgTableWithRLS });
}
const pgTable = pgTableWithCasing(void 0);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/indexes.js
var IndexBuilderOn = class {
	static [entityKind] = "PgIndexBuilderOn";
	constructor(unique, name) {
		this.unique = unique;
		this.name = name;
	}
	on(...columns) {
		return new IndexBuilder(columns.map((it) => {
			if (is(it, SQL)) return it;
			if (is(it, ExtraConfigColumn)) {
				const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
				it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
				return clonedIndexedColumn;
			}
			it = it;
			return new IndexedColumn(it.name, !!it.keyAsName, it.columnType, {});
		}), this.unique, false, this.name);
	}
	onOnly(...columns) {
		return new IndexBuilder(columns.map((it) => {
			if (is(it, SQL)) return it;
			if (is(it, ExtraConfigColumn)) {
				const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
				it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
				return clonedIndexedColumn;
			}
			it = it;
			return new IndexedColumn(it.name, !!it.keyAsName, it.columnType, {});
		}), this.unique, true, this.name);
	}
	/**
	* Specify what index method to use. Choices are `btree`, `hash`, `gist`, `spgist`, `gin`, `brin`, or user-installed access methods like `bloom`. The default method is `btree.
	*
	* If you have the `pg_vector` extension installed in your database, you can use the `hnsw` and `ivfflat` options, which are predefined types.
	*
	* **You can always specify any string you want in the method, in case Drizzle doesn't have it natively in its types**
	*
	* @param method The name of the index method to be used
	* @param columns
	* @returns
	*/
	using(method, ...columns) {
		return new IndexBuilder(columns.map((it) => {
			if (is(it, SQL)) return it;
			if (is(it, ExtraConfigColumn)) {
				const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
				it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
				return clonedIndexedColumn;
			}
			it = it;
			return new IndexedColumn(it.name, !!it.keyAsName, it.columnType, {});
		}), this.unique, true, this.name, method);
	}
};
var IndexBuilder = class {
	static [entityKind] = "PgIndexBuilder";
	/** @internal */
	config;
	constructor(columns, unique, only, name, method = "btree") {
		this.config = {
			name,
			columns,
			unique,
			only,
			method
		};
	}
	concurrently() {
		this.config.concurrently = true;
		return this;
	}
	with(obj) {
		this.config.with = obj;
		return this;
	}
	where(condition) {
		this.config.where = condition;
		return this;
	}
	/** @internal */
	build(table) {
		return new Index(this.config, table);
	}
};
var Index = class {
	static [entityKind] = "PgIndex";
	config;
	isNameExplicit;
	constructor(config, table) {
		this.config = {
			...config,
			table
		};
		this.isNameExplicit = !!config.name;
	}
};
function index(name) {
	return new IndexBuilderOn(false, name);
}
function uniqueIndex(name) {
	return new IndexBuilderOn(true, name);
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/utils.js
function extractUsedTable(table) {
	if (is(table, PgTable)) return [table[TableSchema] ? `${table[TableSchema]}.${table[Table.Symbol.BaseName]}` : table[Table.Symbol.BaseName]];
	if (is(table, Subquery)) return table._.usedTables ?? [];
	if (is(table, SQL)) return table.usedTables ?? [];
	return [];
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class SelectionProxyHandler {
	static [entityKind] = "SelectionProxyHandler";
	config;
	constructor(config) {
		this.config = { ...config };
	}
	get(subquery, prop) {
		if (prop === "_") return {
			...subquery["_"],
			selectedFields: new Proxy(subquery._.selectedFields, this)
		};
		if (prop === ViewBaseConfig) return {
			...subquery[ViewBaseConfig],
			selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this)
		};
		if (typeof prop === "symbol") return subquery[prop];
		const value = (is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery)[prop];
		if (is(value, SQL.Aliased)) {
			if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) return value.sql;
			const newValue = value.clone();
			newValue.isSelectionField = true;
			newValue.origin = this.config.alias;
			return newValue;
		}
		if (is(value, SQL)) {
			if (this.config.sqlBehavior === "sql") return value;
			throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
		}
		if (is(value, Column)) {
			if (this.config.alias) return new Proxy(value, new ColumnTableAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false, true)), true));
			return value;
		}
		if (typeof value !== "object" || value === null) return value;
		return new Proxy(value, new SelectionProxyHandler(this.config));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
	static [entityKind] = "TypedQueryBuilder";
	/** @internal */
	getSelectedFields() {
		return this._.selectedFields;
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/view-base.js
var PgViewBase = class extends View {
	static [entityKind] = "PgViewBase";
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/select.js
var PgSelectBuilder = class {
	static [entityKind] = "PgSelectBuilder";
	fields;
	session;
	dialect;
	withList = [];
	distinct;
	tagged;
	constructor(config, builder = PgSelectBase) {
		this.builder = builder;
		this.fields = config.fields;
		this.session = config.session;
		this.dialect = config.dialect;
		if (config.withList) this.withList = config.withList;
		this.distinct = config.distinct;
	}
	/**
	* Specify the table, subquery, or other target that you're
	* building a select query against.
	*
	* {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM | Postgres from documentation}
	*/
	from(source) {
		const isPartialSelect = !!this.fields;
		const src = source;
		let fields;
		if (this.fields) fields = this.fields;
		else if (is(src, Subquery)) fields = Object.fromEntries(Object.keys(src._.selectedFields).map((key) => [key, src[key]]));
		else if (is(src, PgViewBase)) fields = src[ViewBaseConfig].selectedFields;
		else if (is(src, SQL)) fields = {};
		else fields = getTableColumns(src);
		return new this.builder({
			table: src,
			fields,
			isPartialSelect,
			session: this.session,
			dialect: this.dialect,
			withList: this.withList,
			distinct: this.distinct
		});
	}
};
var PgSelectBase = class extends TypedQueryBuilder {
	static [entityKind] = "PgSelectQueryBuilder";
	_;
	config;
	joinsNotNullableMap;
	tableName;
	isPartialSelect;
	session;
	dialect;
	cacheConfig;
	usedTables = /* @__PURE__ */ new Set();
	constructor(config) {
		super();
		this.session = config.session;
		this.dialect = config.dialect;
		this.config = {
			withList: config.withList,
			table: config.table,
			fields: { ...config.fields },
			distinct: config.distinct,
			setOperators: []
		};
		this.isPartialSelect = config.isPartialSelect;
		this._ = {
			selectedFields: this.config.fields,
			config: this.config
		};
		this.tableName = getTableLikeName(config.table);
		this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
		for (const item of extractUsedTable(config.table)) this.usedTables.add(item);
		this.config.withList?.forEach((it) => {
			const extracted = extractUsedTable(it);
			for (const el of extracted) this.usedTables.add(el);
		});
	}
	/** @internal */
	getUsedTables() {
		return [...this.usedTables];
	}
	createJoin(joinType, lateral) {
		return ((table, on) => {
			const baseTableName = this.tableName;
			const tableName = getTableLikeName(table);
			for (const item of extractUsedTable(table)) this.usedTables.add(item);
			if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) throw new Error(`Alias "${tableName}" is already used in this query`);
			if (!this.isPartialSelect) {
				if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") this.config.fields = { [baseTableName]: this.config.fields };
				if (typeof tableName === "string" && !is(table, SQL)) {
					const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
					this.config.fields[tableName] = selection;
				}
			}
			if (typeof on === "function") on = on(new Proxy(this.config.fields, new SelectionProxyHandler({
				sqlAliasedBehavior: "sql",
				sqlBehavior: "sql"
			})));
			if (!this.config.joins) this.config.joins = [];
			this.config.joins.push({
				on,
				table,
				joinType,
				alias: tableName,
				lateral
			});
			if (typeof tableName === "string") switch (joinType) {
				case "left":
					this.joinsNotNullableMap[tableName] = false;
					break;
				case "right":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "cross":
				case "inner":
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "full":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = false;
			}
			return this;
		});
	}
	/**
	* Executes a `left join` operation by adding another table to the current query.
	*
	* Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
	*   .from(users)
	*   .leftJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .leftJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	leftJoin = this.createJoin("left", false);
	/**
	* Executes a `left join lateral` operation by adding subquery to the current query.
	*
	* A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
	*
	* Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#left-join-lateral}
	*
	* @param table the subquery to join.
	* @param on the `on` clause.
	*/
	leftJoinLateral = this.createJoin("left", true);
	/**
	* Executes a `right join` operation by adding another table to the current query.
	*
	* Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
	*   .from(users)
	*   .rightJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .rightJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	rightJoin = this.createJoin("right", false);
	/**
	* Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
	*
	* Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
	*   .from(users)
	*   .innerJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .innerJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	innerJoin = this.createJoin("inner", false);
	/**
	* Executes an `inner join lateral` operation, creating a new table by combining rows from two queries that have matching values.
	*
	* A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
	*
	* Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#inner-join-lateral}
	*
	* @param table the subquery to join.
	* @param on the `on` clause.
	*/
	innerJoinLateral = this.createJoin("inner", true);
	/**
	* Executes a `full join` operation by combining rows from two tables into a new table.
	*
	* Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
	*   .from(users)
	*   .fullJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .fullJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	fullJoin = this.createJoin("full", false);
	/**
	* Executes a `cross join` operation by combining rows from two tables into a new table.
	*
	* Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
	*
	* @param table the table to join.
	*
	* @example
	*
	* ```ts
	* // Select all users, each user with every pet
	* const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
	*   .from(users)
	*   .crossJoin(pets)
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .crossJoin(pets)
	* ```
	*/
	crossJoin = this.createJoin("cross", false);
	/**
	* Executes a `cross join lateral` operation by combining rows from two queries into a new table.
	*
	* A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
	*
	* Calling this method retrieves all rows from both main and joined queries, merging all rows from each query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#cross-join-lateral}
	*
	* @param table the query to join.
	*/
	crossJoinLateral = this.createJoin("cross", true);
	createSetOperator(type, isAll) {
		return (rightSelection) => {
			const rightSelect = typeof rightSelection === "function" ? rightSelection(getPgSetOperators()) : rightSelection;
			if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
			this.config.setOperators.push({
				type,
				isAll,
				rightSelect
			});
			return this;
		};
	}
	/**
	* Adds `union` set operator to the query.
	*
	* Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
	*
	* @example
	*
	* ```ts
	* // Select all unique names from customers and users tables
	* await db.select({ name: users.name })
	*   .from(users)
	*   .union(
	*     db.select({ name: customers.name }).from(customers)
	*   );
	* // or
	* import { union } from 'drizzle-orm/pg-core'
	*
	* await union(
	*   db.select({ name: users.name }).from(users),
	*   db.select({ name: customers.name }).from(customers)
	* );
	* ```
	*/
	union = this.createSetOperator("union", false);
	/**
	* Adds `union all` set operator to the query.
	*
	* Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
	*
	* @example
	*
	* ```ts
	* // Select all transaction ids from both online and in-store sales
	* await db.select({ transaction: onlineSales.transactionId })
	*   .from(onlineSales)
	*   .unionAll(
	*     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
	*   );
	* // or
	* import { unionAll } from 'drizzle-orm/pg-core'
	*
	* await unionAll(
	*   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
	*   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
	* );
	* ```
	*/
	unionAll = this.createSetOperator("union", true);
	/**
	* Adds `intersect` set operator to the query.
	*
	* Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
	*
	* @example
	*
	* ```ts
	* // Select course names that are offered in both departments A and B
	* await db.select({ courseName: depA.courseName })
	*   .from(depA)
	*   .intersect(
	*     db.select({ courseName: depB.courseName }).from(depB)
	*   );
	* // or
	* import { intersect } from 'drizzle-orm/pg-core'
	*
	* await intersect(
	*   db.select({ courseName: depA.courseName }).from(depA),
	*   db.select({ courseName: depB.courseName }).from(depB)
	* );
	* ```
	*/
	intersect = this.createSetOperator("intersect", false);
	/**
	* Adds `intersect all` set operator to the query.
	*
	* Calling this method will retain only the rows that are present in both result sets including all duplicates.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
	*
	* @example
	*
	* ```ts
	* // Select all products and quantities that are ordered by both regular and VIP customers
	* await db.select({
	*   productId: regularCustomerOrders.productId,
	*   quantityOrdered: regularCustomerOrders.quantityOrdered
	* })
	* .from(regularCustomerOrders)
	* .intersectAll(
	*   db.select({
	*     productId: vipCustomerOrders.productId,
	*     quantityOrdered: vipCustomerOrders.quantityOrdered
	*   })
	*   .from(vipCustomerOrders)
	* );
	* // or
	* import { intersectAll } from 'drizzle-orm/pg-core'
	*
	* await intersectAll(
	*   db.select({
	*     productId: regularCustomerOrders.productId,
	*     quantityOrdered: regularCustomerOrders.quantityOrdered
	*   })
	*   .from(regularCustomerOrders),
	*   db.select({
	*     productId: vipCustomerOrders.productId,
	*     quantityOrdered: vipCustomerOrders.quantityOrdered
	*   })
	*   .from(vipCustomerOrders)
	* );
	* ```
	*/
	intersectAll = this.createSetOperator("intersect", true);
	/**
	* Adds `except` set operator to the query.
	*
	* Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
	*
	* @example
	*
	* ```ts
	* // Select all courses offered in department A but not in department B
	* await db.select({ courseName: depA.courseName })
	*   .from(depA)
	*   .except(
	*     db.select({ courseName: depB.courseName }).from(depB)
	*   );
	* // or
	* import { except } from 'drizzle-orm/pg-core'
	*
	* await except(
	*   db.select({ courseName: depA.courseName }).from(depA),
	*   db.select({ courseName: depB.courseName }).from(depB)
	* );
	* ```
	*/
	except = this.createSetOperator("except", false);
	/**
	* Adds `except all` set operator to the query.
	*
	* Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
	*
	* @example
	*
	* ```ts
	* // Select all products that are ordered by regular customers but not by VIP customers
	* await db.select({
	*   productId: regularCustomerOrders.productId,
	*   quantityOrdered: regularCustomerOrders.quantityOrdered,
	* })
	* .from(regularCustomerOrders)
	* .exceptAll(
	*   db.select({
	*     productId: vipCustomerOrders.productId,
	*     quantityOrdered: vipCustomerOrders.quantityOrdered,
	*   })
	*   .from(vipCustomerOrders)
	* );
	* // or
	* import { exceptAll } from 'drizzle-orm/pg-core'
	*
	* await exceptAll(
	*   db.select({
	*     productId: regularCustomerOrders.productId,
	*     quantityOrdered: regularCustomerOrders.quantityOrdered
	*   })
	*   .from(regularCustomerOrders),
	*   db.select({
	*     productId: vipCustomerOrders.productId,
	*     quantityOrdered: vipCustomerOrders.quantityOrdered
	*   })
	*   .from(vipCustomerOrders)
	* );
	* ```
	*/
	exceptAll = this.createSetOperator("except", true);
	/** @internal */
	addSetOperators(setOperators) {
		this.config.setOperators.push(...setOperators);
		return this;
	}
	/**
	* Adds a `where` clause to the query.
	*
	* Calling this method will select only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#filtering}
	*
	* @param where the `where` clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be selected.
	*
	* ```ts
	* // Select all cars with green color
	* await db.select().from(cars).where(eq(cars.color, 'green'));
	* // or
	* await db.select().from(cars).where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Select all BMW cars with a green color
	* await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Select all cars with the green or blue color
	* await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		if (typeof where === "function") where = where(new Proxy(this.config.fields, new SelectionProxyHandler({
			sqlAliasedBehavior: "sql",
			sqlBehavior: "sql"
		})));
		this.config.where = where;
		return this;
	}
	/**
	* Adds a `having` clause to the query.
	*
	* Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
	*
	* @param having the `having` clause.
	*
	* @example
	*
	* ```ts
	* // Select all brands with more than one car
	* await db.select({
	* 	brand: cars.brand,
	* 	count: sql<number>`cast(count(${cars.id}) as int)`,
	* })
	*   .from(cars)
	*   .groupBy(cars.brand)
	*   .having(({ count }) => gt(count, 1));
	* ```
	*/
	having(having) {
		if (typeof having === "function") having = having(new Proxy(this.config.fields, new SelectionProxyHandler({
			sqlAliasedBehavior: "sql",
			sqlBehavior: "sql"
		})));
		this.config.having = having;
		return this;
	}
	groupBy(...columns) {
		if (typeof columns[0] === "function") {
			const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
		} else this.config.groupBy = columns;
		return this;
	}
	orderBy(...columns) {
		if (typeof columns[0] === "function") {
			const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
			if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).orderBy = orderByArray;
			else this.config.orderBy = orderByArray;
		} else {
			const orderByArray = columns;
			if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).orderBy = orderByArray;
			else this.config.orderBy = orderByArray;
		}
		return this;
	}
	/**
	* Adds a `limit` clause to the query.
	*
	* Calling this method will set the maximum number of rows that will be returned by this query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
	*
	* @param limit the `limit` clause.
	*
	* @example
	*
	* ```ts
	* // Get the first 10 people from this query.
	* await db.select().from(people).limit(10);
	* ```
	*/
	limit(limit) {
		if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).limit = limit;
		else this.config.limit = limit;
		return this;
	}
	/**
	* Adds an `offset` clause to the query.
	*
	* Calling this method will skip a number of rows when returning results from this query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
	*
	* @param offset the `offset` clause.
	*
	* @example
	*
	* ```ts
	* // Get the 10th-20th people from this query.
	* await db.select().from(people).offset(10).limit(10);
	* ```
	*/
	offset(offset) {
		if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).offset = offset;
		else this.config.offset = offset;
		return this;
	}
	/**
	* Adds a `for` clause to the query.
	*
	* Calling this method will specify a lock strength for this query that controls how strictly it acquires exclusive access to the rows being queried.
	*
	* See docs: {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE}
	*
	* @param strength the lock strength.
	* @param config the lock configuration.
	*/
	for(strength, config = {}) {
		this.config.lockingClause = {
			strength,
			config
		};
		return this;
	}
	/**
	* Attach [sqlcommenter](https://google.github.io/sqlcommenter) comment to a query
	*/
	comment(comment) {
		this.config.comment = sql.comment(comment);
		return this;
	}
	getSQL() {
		this.config.fieldsFlat = orderSelectedFields(this.config.fields, void 0, this.dialect.codecs);
		return this.dialect.buildSelectQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	as(alias) {
		const usedTables = [];
		usedTables.push(...extractUsedTable(this.config.table));
		if (this.config.joins) for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
		return new Proxy(new Subquery(this.withoutSelectionCastCodecs().getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]), new SelectionProxyHandler({
			alias,
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		}));
	}
	/** @internal */
	getSelectedFields() {
		return new Proxy(this.config.fields, new SelectionProxyHandler({
			alias: this.tableName,
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		}));
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		this.config.ignoreSelectionCastCodecs = true;
		return this;
	}
	$dynamic() {
		return this;
	}
	$withCache(config) {
		this.cacheConfig = config === void 0 ? {
			config: {},
			enabled: true,
			autoInvalidate: true
		} : config === false ? { enabled: false } : {
			enabled: true,
			autoInvalidate: true,
			...config
		};
		return this;
	}
};
function createSetOperator(type, isAll) {
	return (leftSelect, rightSelect, ...restSelects) => {
		const setOperators = [rightSelect, ...restSelects].map((select) => ({
			type,
			isAll,
			rightSelect: select
		}));
		for (const setOperator of setOperators) if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
		return leftSelect.addSetOperators(setOperators);
	};
}
const getPgSetOperators = () => ({
	union,
	unionAll,
	intersect,
	intersectAll,
	except,
	exceptAll
});
/**
* Adds `union` set operator to the query.
*
* Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
*
* @example
*
* ```ts
* // Select all unique names from customers and users tables
* import { union } from 'drizzle-orm/pg-core'
*
* await union(
*   db.select({ name: users.name }).from(users),
*   db.select({ name: customers.name }).from(customers)
* );
* // or
* await db.select({ name: users.name })
*   .from(users)
*   .union(
*     db.select({ name: customers.name }).from(customers)
*   );
* ```
*/
const union = createSetOperator("union", false);
/**
* Adds `union all` set operator to the query.
*
* Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
*
* @example
*
* ```ts
* // Select all transaction ids from both online and in-store sales
* import { unionAll } from 'drizzle-orm/pg-core'
*
* await unionAll(
*   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
*   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
* );
* // or
* await db.select({ transaction: onlineSales.transactionId })
*   .from(onlineSales)
*   .unionAll(
*     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
*   );
* ```
*/
const unionAll = createSetOperator("union", true);
/**
* Adds `intersect` set operator to the query.
*
* Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
*
* @example
*
* ```ts
* // Select course names that are offered in both departments A and B
* import { intersect } from 'drizzle-orm/pg-core'
*
* await intersect(
*   db.select({ courseName: depA.courseName }).from(depA),
*   db.select({ courseName: depB.courseName }).from(depB)
* );
* // or
* await db.select({ courseName: depA.courseName })
*   .from(depA)
*   .intersect(
*     db.select({ courseName: depB.courseName }).from(depB)
*   );
* ```
*/
const intersect = createSetOperator("intersect", false);
/**
* Adds `intersect all` set operator to the query.
*
* Calling this method will retain only the rows that are present in both result sets including all duplicates.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
*
* @example
*
* ```ts
* // Select all products and quantities that are ordered by both regular and VIP customers
* import { intersectAll } from 'drizzle-orm/pg-core'
*
* await intersectAll(
*   db.select({
*     productId: regularCustomerOrders.productId,
*     quantityOrdered: regularCustomerOrders.quantityOrdered
*   })
*   .from(regularCustomerOrders),
*   db.select({
*     productId: vipCustomerOrders.productId,
*     quantityOrdered: vipCustomerOrders.quantityOrdered
*   })
*   .from(vipCustomerOrders)
* );
* // or
* await db.select({
*   productId: regularCustomerOrders.productId,
*   quantityOrdered: regularCustomerOrders.quantityOrdered
* })
* .from(regularCustomerOrders)
* .intersectAll(
*   db.select({
*     productId: vipCustomerOrders.productId,
*     quantityOrdered: vipCustomerOrders.quantityOrdered
*   })
*   .from(vipCustomerOrders)
* );
* ```
*/
const intersectAll = createSetOperator("intersect", true);
/**
* Adds `except` set operator to the query.
*
* Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
*
* @example
*
* ```ts
* // Select all courses offered in department A but not in department B
* import { except } from 'drizzle-orm/pg-core'
*
* await except(
*   db.select({ courseName: depA.courseName }).from(depA),
*   db.select({ courseName: depB.courseName }).from(depB)
* );
* // or
* await db.select({ courseName: depA.courseName })
*   .from(depA)
*   .except(
*     db.select({ courseName: depB.courseName }).from(depB)
*   );
* ```
*/
const except = createSetOperator("except", false);
/**
* Adds `except all` set operator to the query.
*
* Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
*
* @example
*
* ```ts
* // Select all products that are ordered by regular customers but not by VIP customers
* import { exceptAll } from 'drizzle-orm/pg-core'
*
* await exceptAll(
*   db.select({
*     productId: regularCustomerOrders.productId,
*     quantityOrdered: regularCustomerOrders.quantityOrdered
*   })
*   .from(regularCustomerOrders),
*   db.select({
*     productId: vipCustomerOrders.productId,
*     quantityOrdered: vipCustomerOrders.quantityOrdered
*   })
*   .from(vipCustomerOrders)
* );
* // or
* await db.select({
*   productId: regularCustomerOrders.productId,
*   quantityOrdered: regularCustomerOrders.quantityOrdered,
* })
* .from(regularCustomerOrders)
* .exceptAll(
*   db.select({
*     productId: vipCustomerOrders.productId,
*     quantityOrdered: vipCustomerOrders.quantityOrdered,
*   })
*   .from(vipCustomerOrders)
* );
* ```
*/
const exceptAll = createSetOperator("except", true);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/dialect.js
var PgDialect = class {
	static [entityKind] = "PgDialect";
	codecs;
	mapperGenerators;
	constructor(config) {
		this.codecs = new CodecsCollection(resolvePgTypeAlias, config?.codecs);
		this.mapperGenerators = config?.useJitMappers ? {
			rows: makeJitQueryMapper,
			relationalRows: makeJitRqbMapper
		} : {
			rows: makeDefaultQueryMapper,
			relationalRows: makeDefaultRqbMapper
		};
	}
	escapeName(name) {
		return `"${name.replace(/"/g, "\"\"")}"`;
	}
	escapeParam(num) {
		return `$${num + 1}`;
	}
	escapeString(str) {
		return `'${str.replace(/'/g, "''")}'`;
	}
	buildWithCTE(queries) {
		if (!queries?.length) return void 0;
		const withSqlChunks = [sql`with `];
		for (const [i, w] of queries.entries()) {
			withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
			if (i < queries.length - 1) withSqlChunks.push(sql`, `);
		}
		withSqlChunks.push(sql` `);
		return sql.join(withSqlChunks);
	}
	buildDeleteQuery({ table, where, returning, withList, comment, ignoreSelectionCastCodecs }) {
		const withSql = this.buildWithCTE(withList);
		const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
			isSingleTable: true,
			ignoreCastCodecs: ignoreSelectionCastCodecs
		})}` : void 0;
		return sql`${withSql}delete from ${table}${where ? sql` where ${where}` : void 0}${returningSql}${comment !== void 0 ? sql` ${comment}` : void 0}`;
	}
	buildUpdateSet(table, set) {
		const tableColumns = table[Table.Symbol.Columns];
		const columnNames = Object.keys(tableColumns).filter((colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0);
		const setLength = columnNames.length;
		return sql.join(columnNames.flatMap((colName, i) => {
			const col = tableColumns[colName];
			const onUpdateFnResult = col.onUpdateFn?.();
			const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
			const res = sql`${sql.identifier(col.name)} = ${value}`;
			if (i < setLength - 1) return [res, sql.raw(", ")];
			return [res];
		}));
	}
	buildUpdateQuery({ table, set, where, returning, withList, from, joins, comment, ignoreSelectionCastCodecs }) {
		const withSql = this.buildWithCTE(withList);
		const tableName = table[PgTable.Symbol.Name];
		const tableSchema = table[PgTable.Symbol.Schema];
		const origTableName = table[PgTable.Symbol.OriginalName];
		const alias = tableName === origTableName ? void 0 : tableName;
		const tableSql = sql`${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}`;
		const setSql = this.buildUpdateSet(table, set);
		const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
		const joinsSql = this.buildJoins(joins);
		const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
			isSingleTable: !from,
			ignoreCastCodecs: ignoreSelectionCastCodecs
		})}` : void 0;
		return sql`${withSql}update ${tableSql} set ${setSql}${fromSql}${joinsSql}${where ? sql` where ${where}` : void 0}${returningSql}${comment !== void 0 ? sql` ${comment}` : void 0}`;
	}
	/**
	* Builds selection SQL with provided fields/expressions
	*
	* Examples:
	*
	* `select <selection> from`
	*
	* `insert ... returning <selection>`
	*
	* If `isSingleTable` is true, then columns won't be prefixed with table name
	*/
	buildSelection(fields, { isSingleTable = false, ignoreCastCodecs = false } = {}) {
		const columnsLen = fields.length;
		const chunks = fields.flatMap(({ field, codecOverride, column }, i) => {
			const chunk = [];
			const override = codecOverride;
			if (is(field, SQL.Aliased)) if (field.isSelectionField) {
				const query = !isSingleTable && field.origin !== void 0 ? sql`${sql.identifier(field.origin)}.${sql.identifier(field.fieldAlias)}` : sql.identifier(field.fieldAlias);
				if (column && !ignoreCastCodecs) chunk.push(this.codecs.apply(column, "cast", query, override));
				else chunk.push(query);
			} else {
				const query = field.sql;
				if (isSingleTable) {
					const newSql = new SQL(query.queryChunks.map((c) => {
						if (is(c, PgColumn)) return sql.identifier(c.name);
						return c;
					}));
					if (query.shouldInlineParams) newSql.inlineParams();
					chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", newSql, override) : newSql);
				} else chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", query, override) : query);
				chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
			}
			else if (is(field, SQL)) {
				const query = field;
				if (isSingleTable) {
					const newSql = new SQL(query.queryChunks.map((c) => {
						if (is(c, PgColumn)) return sql.identifier(c.name);
						return c;
					}));
					if (query.shouldInlineParams) newSql.inlineParams();
					chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", newSql, override) : newSql);
				} else chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", query, override) : query);
			} else if (is(field, Column)) {
				let name;
				if (isSingleTable) name = field.isAlias ? sql.identifier(getOriginalColumnFromAlias(field).name) : sql.identifier(field.name);
				else name = field.isAlias ? getOriginalColumnFromAlias(field) : field;
				const casted = ignoreCastCodecs ? name : this.codecs.apply(field, "cast", name, override);
				chunk.push(field.isAlias ? sql`${casted} as ${field}` : casted);
			} else if (is(field, Subquery)) if (column && !ignoreCastCodecs && !field._.isWith) {
				const innerCasted = this.codecs.apply(column, "cast", sql`(${field._.sql})`, override);
				chunk.push(sql`${innerCasted} ${sql.identifier(field._.alias)}`);
			} else chunk.push(column ? this.codecs.apply(column, "cast", field) : field, override);
			if (i < columnsLen - 1) chunk.push(sql`, `);
			return chunk;
		});
		return sql.join(chunks);
	}
	buildJoins(joins) {
		if (!joins || joins.length === 0) return;
		const joinsArray = [];
		for (const [index, joinMeta] of joins.entries()) {
			if (index === 0) joinsArray.push(sql` `);
			const table = joinMeta.table;
			const lateralSql = joinMeta.lateral ? sql` lateral` : void 0;
			const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
			if (is(table, PgTable)) {
				const tableName = table[PgTable.Symbol.Name];
				const tableSchema = table[PgTable.Symbol.Schema];
				const origTableName = table[PgTable.Symbol.OriginalName];
				const alias = tableName === origTableName ? void 0 : joinMeta.alias;
				joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`);
			} else if (is(table, View)) {
				const viewName = table[ViewBaseConfig].name;
				const viewSchema = table[ViewBaseConfig].schema;
				const origViewName = table[ViewBaseConfig].originalName;
				const alias = viewName === origViewName ? void 0 : joinMeta.alias;
				joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : void 0}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`);
			} else joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table}${onSql}`);
			if (index < joins.length - 1) joinsArray.push(sql` `);
		}
		return sql.join(joinsArray);
	}
	buildFromTable(table) {
		if (is(table, Table) && table[Table.Symbol.IsAlias]) {
			let fullName = sql`${sql.identifier(table[Table.Symbol.OriginalName])}`;
			if (table[Table.Symbol.Schema]) fullName = sql`${sql.identifier(table[Table.Symbol.Schema])}.${fullName}`;
			return sql`${fullName} ${sql.identifier(table[Table.Symbol.Name])}`;
		}
		if (is(table, View) && table[ViewBaseConfig].isAlias) {
			let fullName = sql`${sql.identifier(table[ViewBaseConfig].originalName)}`;
			if (table[ViewBaseConfig].schema) fullName = sql`${sql.identifier(table[ViewBaseConfig].schema)}.${fullName}`;
			return sql`${fullName} ${sql.identifier(table[ViewBaseConfig].name)}`;
		}
		return table;
	}
	buildSelectQuery({ withList, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct, setOperators, comment, ignoreSelectionCastCodecs }) {
		if (!fieldsFlat) throw new Error("Select query builder must be provided with `fieldsFlat` on `buildSelectQuery` invocation");
		const fieldsList = fieldsFlat;
		for (const f of fieldsList) if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, PgViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table) => joins?.some(({ alias }) => alias === (table[Table.Symbol.IsAlias] ? getTableName(table) : table[Table.Symbol.BaseName])))(f.field.table)) {
			const tableName = getTableName(f.field.table);
			throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
		}
		const isSingleTable = !joins || joins.length === 0;
		const withSql = this.buildWithCTE(withList);
		let distinctSql;
		if (distinct) distinctSql = distinct === true ? sql` distinct` : sql` distinct on (${sql.join(distinct.on, sql`, `)})`;
		const selection = this.buildSelection(fieldsList, {
			isSingleTable,
			ignoreCastCodecs: ignoreSelectionCastCodecs || setOperators.length > 0
		});
		const tableSql = this.buildFromTable(table);
		const joinsSql = this.buildJoins(joins);
		const whereSql = where ? sql` where ${where}` : void 0;
		const havingSql = having ? sql` having ${having}` : void 0;
		let orderBySql;
		if (orderBy && orderBy.length > 0) orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
		let groupBySql;
		if (groupBy && groupBy.length > 0) groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
		const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
		const offsetSql = offset ? sql` offset ${offset}` : void 0;
		const lockingClauseSql = sql.empty();
		if (lockingClause) {
			const clauseSql = sql` for ${sql.raw(lockingClause.strength)}`;
			if (lockingClause.config.of) clauseSql.append(sql` of ${sql.join(Array.isArray(lockingClause.config.of) ? lockingClause.config.of.map((it) => sql.identifier(it[PgTable.Symbol.Name])) : [sql.identifier(lockingClause.config.of[PgTable.Symbol.Name])], sql`, `)}`);
			if (lockingClause.config.noWait) clauseSql.append(sql` nowait`);
			else if (lockingClause.config.skipLocked) clauseSql.append(sql` skip locked`);
			lockingClauseSql.append(clauseSql);
		}
		const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}${comment !== void 0 ? sql` ${comment}` : void 0}`;
		if (setOperators.length > 0) return this.buildSetOperations(finalQuery, fieldsList, ignoreSelectionCastCodecs, setOperators);
		return finalQuery;
	}
	buildSetOperations(leftSelect, leftSelection, ignoreSelectionCastCodecs, setOperators) {
		const outputSelection = leftSelection;
		for (let i = 0; i < setOperators.length; ++i) {
			const setOperator = setOperators[i];
			if (!setOperator) throw new Error("Cannot pass undefined values to any set operator");
			leftSelect = this.buildSetOperationQuery({
				leftSelect,
				setOperator
			});
			const rightSelection = orderSelectedFields(setOperator.rightSelect.getSelectedFields());
			for (let j = 0; j < outputSelection.length; ++j) {
				const l = outputSelection[j];
				const lPath = l.path.join(".");
				const r = rightSelection.find((e) => e.path.join(".") === lPath);
				const lc = l.codecOverride ?? l.column?.codec;
				const rc = r.codecOverride ?? r.column?.codec;
				outputSelection[j].codecOverride = lc && rc ? unionsTypeTable[lc]?.[rc] : lc;
			}
		}
		for (let i = 0; i < outputSelection.length; ++i) {
			const out = outputSelection[i];
			out.codec = out.codecOverride ? this.codecs.get(out.column, "normalize", out.codecOverride) : out.codec;
		}
		return ignoreSelectionCastCodecs ? leftSelect : sql`select ${this.buildSelection(outputSelection.map((field) => {
			if (is(field.field, SQL.Aliased)) {
				const ref = field.field.clone();
				ref.isSelectionField = true;
				return {
					...field,
					field: ref
				};
			}
			if (is(field.field, Column) && field.field.isAlias) {
				const ref = new SQL.Aliased(sql`${sql.identifier(field.field.name)}`, field.field.name);
				ref.isSelectionField = true;
				return {
					...field,
					field: ref
				};
			}
			if (is(field.field, Subquery)) {
				const ref = new SQL.Aliased(sql`${field.field.getSQL()}`, field.field._.alias);
				ref.isSelectionField = true;
				return {
					...field,
					field: ref
				};
			}
			return field;
		}), {
			isSingleTable: true,
			ignoreCastCodecs: ignoreSelectionCastCodecs
		})} from (${leftSelect}) ${sql.identifier("drizzle_union")}`;
	}
	buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset } }) {
		const leftChunk = sql`(${leftSelect.getSQL()}) `;
		const rightChunk = sql`(${rightSelect.withoutSelectionCastCodecs().getSQL()})`;
		let orderBySql;
		if (orderBy && orderBy.length > 0) {
			const orderByValues = [];
			for (const singleOrderBy of orderBy) if (is(singleOrderBy, PgColumn)) orderByValues.push(sql.identifier(singleOrderBy.name));
			else if (is(singleOrderBy, SQL)) {
				for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
					const chunk = singleOrderBy.queryChunks[i];
					if (is(chunk, PgColumn)) singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
				}
				orderByValues.push(sql`${singleOrderBy}`);
			} else orderByValues.push(sql`${singleOrderBy}`);
			orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)} `;
		}
		const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
		const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
		const offsetSql = offset ? sql` offset ${offset}` : void 0;
		return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
	}
	buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_, comment, ignoreSelectionCastCodecs }) {
		const valuesSqlList = [];
		const columns = table[Table.Symbol.Columns];
		const colEntries = Object.entries(columns);
		const colFilteredEntries = select && !is(valuesOrSelect, SQL) ? Object.keys(valuesOrSelect.getSelectedFields()).map((key) => [key, columns[key]]) : overridingSystemValue_ ? colEntries : colEntries.filter(([_, col]) => !col.shouldDisableInsert());
		const insertOrder = colFilteredEntries.map(([, column]) => sql.identifier(column.name));
		if (select) {
			const select = valuesOrSelect;
			if (is(select, SQL)) valuesSqlList.push(select);
			else valuesSqlList.push(select.getSQL());
		} else {
			const values = valuesOrSelect;
			valuesSqlList.push(sql.raw("values "));
			for (const [valueIndex, value] of values.entries()) {
				const valueList = [];
				for (const [fieldName, col] of colFilteredEntries) {
					const colValue = value[fieldName];
					if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) if (col.defaultFn !== void 0) {
						const defaultFnResult = col.defaultFn();
						const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
						valueList.push(defaultValue);
					} else if (!col.default && col.onUpdateFn !== void 0) {
						const onUpdateFnResult = col.onUpdateFn();
						const newValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
						valueList.push(newValue);
					} else valueList.push(sql`default`);
					else valueList.push(colValue);
				}
				valuesSqlList.push(valueList);
				if (valueIndex < values.length - 1) valuesSqlList.push(sql`, `);
			}
		}
		const withSql = this.buildWithCTE(withList);
		const valuesSql = sql.join(valuesSqlList);
		const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
			isSingleTable: true,
			ignoreCastCodecs: ignoreSelectionCastCodecs
		})}` : void 0;
		const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
		return sql`${withSql}insert into ${table} ${insertOrder} ${overridingSystemValue_ === true ? sql`overriding system value ` : void 0}${valuesSql}${onConflictSql}${returningSql}${comment !== void 0 ? sql` ${comment}` : void 0}`;
	}
	buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
		return sql`refresh materialized view${concurrently ? sql` concurrently` : void 0} ${view}${withNoData ? sql` with no data` : void 0}`;
	}
	sqlToQuery(sql, invokeSource) {
		return sql.toQuery({
			escapeName: this.escapeName,
			escapeParam: this.escapeParam,
			escapeString: this.escapeString,
			codecs: this.codecs,
			invokeSource
		});
	}
	_sqlToQuery(sql) {
		return sql.toQuery({
			escapeName: this.escapeName,
			escapeParam: this.escapeParam,
			escapeString: this.escapeString,
			codecs: this.codecs,
			tagged: true
		});
	}
	buildRqbColumn(table, field, key, inJson) {
		if (is(field, Column)) {
			const name = sql`${table}.${sql.identifier(field.name)}`;
			return sql`${inJson && field.jsonSelectIdentifier ? field.jsonSelectIdentifier(name, sql, field.dimensions) : this.codecs.apply(field, inJson ? "castInJson" : "cast", name)} as ${sql.identifier(key)}`;
		}
		if (is(field, SQL.Aliased)) {
			const column = getColumnFromDecoder(field);
			const q = sql`${table}.${sql.identifier(field.fieldAlias)}`;
			return sql`${column ? this.codecs.apply(column, inJson ? "castInJson" : "cast", q) : q} as ${sql.identifier(key)}`;
		}
		if (isSQLWrapper(field)) {
			const column = getColumnFromDecoder(field);
			const q = sql`${table}.${sql.identifier(key)}`;
			return sql`${column ? this.codecs.apply(column, inJson ? "castInJson" : "cast", q) : q} as ${sql.identifier(key)}`;
		}
		throw new DrizzleError({ message: `Views with nested selections are not supported by the relational query builder` });
	}
	resolveSelection(field, key, inJson) {
		if (is(field, Column)) return {
			key,
			field,
			codec: this.codecs.get(field, inJson ? "normalizeInJson" : "normalize"),
			arrayDimensions: field.dimensions
		};
		const decoderColumn = getColumnFromDecoder(field);
		return decoderColumn ? {
			key,
			field,
			codec: decoderColumn && (!inJson || !decoderColumn.mapFromJsonValue) ? this.codecs.get(decoderColumn, inJson ? "normalizeInJson" : "normalize") : void 0,
			arrayDimensions: decoderColumn.dimensions
		} : {
			key,
			field
		};
	}
	buildColumns = (table, selection, inJson, config) => {
		if (!config?.columns) return sql.join(Object.entries(table[TableColumns]).map(([k, v]) => {
			selection.push(this.resolveSelection(v, k, inJson));
			return this.buildRqbColumn(table, v, k, inJson);
		}), sql`, `);
		const entries = Object.entries(config.columns);
		const columnContainer = table[TableColumns];
		const columnIdentifiers = [];
		let colSelectionMode;
		for (const [k, v] of entries) {
			if (v === void 0) continue;
			colSelectionMode = colSelectionMode || v;
			if (v) {
				const column = columnContainer[k];
				columnIdentifiers.push(this.buildRqbColumn(table, column, k, inJson));
				selection.push(this.resolveSelection(column, k, inJson));
			}
		}
		if (colSelectionMode === false) for (const [k, v] of Object.entries(columnContainer)) {
			if (config.columns[k] === false) continue;
			columnIdentifiers.push(this.buildRqbColumn(table, v, k, inJson));
			selection.push(this.resolveSelection(v, k, inJson));
		}
		return columnIdentifiers.length ? sql.join(columnIdentifiers, sql`, `) : void 0;
	};
	buildRelationalQuery({ schema, table, tableConfig, queryConfig: config, relationWhere, mode, errorPath, depth, throughJoin, nested }) {
		const selection = [];
		const isSingle = mode === "first";
		const params = config === true ? void 0 : config;
		const currentPath = errorPath ?? "";
		const currentDepth = depth ?? 0;
		if (!currentDepth) table = aliasedTable(table, `d${currentDepth}`);
		const limit = isSingle ? 1 : params?.limit;
		const offset = params?.offset;
		const where = params?.where && relationWhere ? and(relationsFilterToSQL(table, params.where, tableConfig.relations, schema), relationWhere) : params?.where ? relationsFilterToSQL(table, params.where, tableConfig.relations, schema) : relationWhere;
		const order = params?.orderBy ? relationsOrderToSQL(table, params.orderBy) : void 0;
		const columns = this.buildColumns(table, selection, !!nested, params);
		const extras = params?.extras ? relationExtrasToSQL(table, params.extras, this.codecs, nested) : void 0;
		if (extras) selection.push(...extras.selection);
		const selectionArr = columns ? [columns] : [];
		if (extras?.sql) selectionArr.push(extras.sql);
		const joins = params ? (() => {
			const { with: joins } = params;
			if (!joins) return;
			const withEntries = Object.entries(joins).filter(([_, v]) => v);
			if (!withEntries.length) return;
			return sql.join(withEntries.map(([k, join]) => {
				const relation = tableConfig.relations[k];
				const isSingle = is(relation, One);
				const targetTable = aliasedTable(relation.targetTable, `d${currentDepth + 1}`);
				const throughTable = relation.throughTable ? aliasedTable(relation.throughTable, `tr${currentDepth}`) : void 0;
				const { filter, joinCondition } = relationToSQL(relation, table, targetTable, throughTable);
				selectionArr.push(sql`${sql.identifier(k)}.${sql.identifier("r")} as ${sql.identifier(k)}`);
				const throughJoin = throughTable ? sql` inner join ${getTableAsAliasSQL(throughTable)} on ${joinCondition}` : void 0;
				const innerQuery = this.buildRelationalQuery({
					table: targetTable,
					mode: isSingle ? "first" : "many",
					schema,
					queryConfig: join,
					tableConfig: schema[relation.targetTableName],
					relationWhere: filter,
					errorPath: `${currentPath.length ? `${currentPath}.` : ""}${k}`,
					depth: currentDepth + 1,
					throughJoin,
					nested: true
				});
				selection.push({
					field: targetTable,
					key: k,
					selection: innerQuery.selection,
					isArray: !isSingle,
					isOptional: (relation.optional ?? false) || join !== true && !!join.where
				});
				return sql`left join lateral(select ${isSingle ? sql`row_to_json(${sql.identifier("t")}.*) ${sql.identifier("r")}` : sql`coalesce(json_agg(row_to_json(${sql.identifier("t")}.*)), '[]') as ${sql.identifier("r")}`} from (${innerQuery.sql}) as ${sql.identifier("t")}) as ${sql.identifier(k)} on true`;
			}), sql` `);
		})() : void 0;
		if (!selectionArr.length) throw new DrizzleError({ message: `No fields selected for table "${tableConfig.name}"${currentPath ? ` ("${currentPath}")` : ""}` });
		const selectionSet = sql.join(selectionArr.filter((e) => e !== void 0), sql`, `);
		const comment = config !== true && config?.comment ? sql.comment(config.comment) : void 0;
		return {
			sql: sql`select ${selectionSet} from ${getTableAsAliasSQL(table)}${throughJoin}${joins ? sql` ${joins}` : void 0}${where ? sql` where ${where}` : void 0}${order ? sql` order by ${order}` : void 0}${limit !== void 0 ? sql` limit ${limit}` : void 0}${offset !== void 0 ? sql` offset ${offset}` : void 0}${comment ? sql` ${comment}` : void 0}`,
			selection
		};
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/query-builder.js
var QueryBuilder = class {
	static [entityKind] = "PgQueryBuilder";
	dialect;
	dialectConfig;
	constructor(dialect) {
		this.dialect = is(dialect, PgDialect) ? dialect : void 0;
		this.dialectConfig = is(dialect, PgDialect) ? void 0 : dialect;
	}
	$with = (alias, selection) => {
		const queryBuilder = this;
		const as = (qb) => {
			if (typeof qb === "function") qb = qb(queryBuilder);
			const sql = ("withoutSelectionCastCodecs" in qb ? qb.withoutSelectionCastCodecs() : qb).getSQL();
			return new Proxy(new WithSubquery(sql, selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true, sql.usedTables ?? []), new SelectionProxyHandler({
				alias,
				sqlAliasedBehavior: "alias",
				sqlBehavior: "error"
			}));
		};
		return { as };
	};
	with(...queries) {
		const self = this;
		function select(fields) {
			return new PgSelectBuilder({
				fields: fields ?? void 0,
				session: void 0,
				dialect: self.getDialect(),
				withList: queries
			});
		}
		function selectDistinct(fields) {
			return new PgSelectBuilder({
				fields: fields ?? void 0,
				session: void 0,
				dialect: self.getDialect(),
				distinct: true
			});
		}
		function selectDistinctOn(on, fields) {
			return new PgSelectBuilder({
				fields: fields ?? void 0,
				session: void 0,
				dialect: self.getDialect(),
				distinct: { on }
			});
		}
		return {
			select,
			selectDistinct,
			selectDistinctOn
		};
	}
	select(fields) {
		return new PgSelectBuilder({
			fields: fields ?? void 0,
			session: void 0,
			dialect: this.getDialect()
		});
	}
	selectDistinct(fields) {
		return new PgSelectBuilder({
			fields: fields ?? void 0,
			session: void 0,
			dialect: this.getDialect(),
			distinct: true
		});
	}
	selectDistinctOn(on, fields) {
		return new PgSelectBuilder({
			fields: fields ?? void 0,
			session: void 0,
			dialect: this.getDialect(),
			distinct: { on }
		});
	}
	getDialect() {
		if (!this.dialect) this.dialect = new PgDialect(this.dialectConfig);
		return this.dialect;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/count.js
var PgCountBuilder = class PgCountBuilder extends SQL {
	static [entityKind] = "PgCountBuilder";
	dialect;
	static buildCount(source, filters, parens) {
		const query = sql`select count(*) from ${source}${sql` where ${filters}`.if(filters)}`;
		return parens ? sql`(${query})` : query;
	}
	constructor(countConfig) {
		super(PgCountBuilder.buildCount(countConfig.source, countConfig.filters, true).queryChunks);
		this.countConfig = countConfig;
		this.dialect = countConfig.dialect;
		this.mapWith((e) => {
			if (typeof e === "number") return e;
			return Number(e ?? 0);
		});
	}
	executableSql;
	build() {
		if (!this.executableSql) {
			const { source, filters } = this.countConfig;
			this.executableSql = PgCountBuilder.buildCount(source, filters);
		}
		return this.dialect.sqlToQuery(this.executableSql);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/count.js
var PgAsyncCountBuilder = class extends PgCountBuilder {
	static [entityKind] = "PgAsyncCountBuilder";
	session;
	constructor({ source, dialect, filters, session }) {
		super({
			source,
			dialect,
			filters
		});
		this.session = session;
	}
	execute(placeholderValues) {
		return this.session.prepareQuery(this.build(), "arrays", false, (rows) => {
			const v = rows[0]?.[0];
			if (typeof v === "number") return v;
			return v ? Number(v) : 0;
		}).execute(placeholderValues);
	}
};
applyMixins(PgAsyncCountBuilder, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/delete.js
var PgDeleteBase = class {
	static [entityKind] = "PgDelete";
	config;
	constructor(table, session, dialect, withList) {
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			withList
		};
	}
	/**
	* Adds a `where` clause to the query.
	*
	* Calling this method will delete only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/delete}
	*
	* @param where the `where` clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be deleted.
	*
	* ```ts
	* // Delete all cars with green color
	* await db.delete(cars).where(eq(cars.color, 'green'));
	* // or
	* await db.delete(cars).where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Delete all BMW cars with a green color
	* await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Delete all cars with the green or blue color
	* await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	returning(fields = this.config.table[Table.Symbol.Columns]) {
		this.config.returningFields = fields;
		this.config.returning = orderSelectedFields(fields, void 0, this.dialect.codecs);
		return this;
	}
	/**
	* Attach [sqlcommenter](https://google.github.io/sqlcommenter) comment to a query
	*/
	comment(comment) {
		this.config.comment = sql.comment(comment);
		return this;
	}
	getSQL() {
		return this.dialect.buildDeleteQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	/** @internal */
	getSelectedFields() {
		return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
			alias: getTableName(this.config.table),
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		})) : void 0;
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		this.config.ignoreSelectionCastCodecs = true;
		return this;
	}
	$dynamic() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/delete.js
var PgAsyncDeleteBase = class extends PgDeleteBase {
	static [entityKind] = "PgAsyncDelete";
	/** @internal */
	_prepare(name, generateName = false) {
		const { session, config, dialect } = this;
		const { returning: fields } = config;
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const query = dialect.sqlToQuery(this.getSQL());
			const mapper = fields ? this.dialect.mapperGenerators.rows(fields, void 0) : void 0;
			return session.prepareQuery(query, fields ? "arrays" : "raw", name ?? generateName, mapper, {
				type: "delete",
				tables: [...extractUsedTable(this.config.table)]
			});
		});
	}
	prepare(name) {
		return this._prepare(name, true);
	}
	execute = (placeholderValues) => {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
applyMixins(PgAsyncDeleteBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/insert.js
var PgInsertBuilder = class {
	static [entityKind] = "PgInsertBuilder";
	constructor(table, session, dialect, withList, overridingSystemValue_, builder = PgInsertBase) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
		this.overridingSystemValue_ = overridingSystemValue_;
		this.builder = builder;
	}
	overridingSystemValue() {
		this.overridingSystemValue_ = true;
		return this;
	}
	values(values) {
		values = Array.isArray(values) ? values : [values];
		if (values.length === 0) throw new Error("values() must be called with at least one value");
		const mappedValues = values.map((entry) => {
			const result = {};
			const cols = this.table[Table.Symbol.Columns];
			for (const colKey of Object.keys(entry)) {
				const colValue = entry[colKey];
				result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
			}
			return result;
		});
		return new this.builder(this.table, mappedValues, this.session, this.dialect, this.withList, false, this.overridingSystemValue_);
	}
	select(selectQuery) {
		const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
		if ("withoutSelectionCastCodecs" in select) select.withoutSelectionCastCodecs();
		if (!is(select, SQL)) {
			const insertCols = Object.keys(this.table[Table.Symbol.Columns]);
			const selected = Object.keys(select._.selectedFields);
			for (const col of selected) if (!insertCols.includes(col)) throw new Error(`Insert select error: column "${col}" does not exist in table "${this.table[Table.Symbol.Name]}"`);
		}
		return new this.builder(this.table, select, this.session, this.dialect, this.withList, true, this.overridingSystemValue_);
	}
};
var PgInsertBase = class {
	static [entityKind] = "PgInsert";
	config;
	constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			values,
			withList,
			select,
			overridingSystemValue_
		};
	}
	returning(fields = this.config.table[Table.Symbol.Columns]) {
		this.config.returningFields = fields;
		this.config.returning = orderSelectedFields(this.config.returningFields, void 0, this.dialect.codecs);
		return this;
	}
	/**
	* Adds an `on conflict do nothing` clause to the query.
	*
	* Calling this method simply avoids inserting a row as its alternative action.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
	*
	* @param config The `target` and `where` clauses.
	*
	* @example
	* ```ts
	* // Insert one row and cancel the insert if there's a conflict
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoNothing();
	*
	* // Explicitly specify conflict target
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoNothing({ target: cars.id });
	* ```
	*/
	onConflictDoNothing(config = {}) {
		if (config.target === void 0) this.config.onConflict = sql`do nothing`;
		else {
			let targetColumn = "";
			targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(it.name)).join(",") : this.dialect.escapeName(config.target.name);
			const whereSql = config.where ? sql` where ${config.where}` : void 0;
			this.config.onConflict = sql`(${sql.raw(targetColumn)})${whereSql} do nothing`;
		}
		return this;
	}
	/**
	* Adds an `on conflict do update` clause to the query.
	*
	* Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
	*
	* @param config The `target`, `set` and `where` clauses.
	*
	* @example
	* ```ts
	* // Update the row if there's a conflict
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoUpdate({
	*     target: cars.id,
	*     set: { brand: 'Porsche' }
	*   });
	*
	* // Upsert with 'where' clause
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoUpdate({
	*     target: cars.id,
	*     set: { brand: 'newBMW' },
	*     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
	*   });
	* ```
	*/
	onConflictDoUpdate(config) {
		if (config.where && (config.targetWhere || config.setWhere)) throw new Error("You cannot use both \"where\" and \"targetWhere\"/\"setWhere\" at the same time - \"where\" is deprecated, use \"targetWhere\" or \"setWhere\" instead.");
		const whereSql = config.where ? sql` where ${config.where}` : void 0;
		const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
		const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
		const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
		let targetColumn = "";
		targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(it.name)).join(",") : this.dialect.escapeName(config.target.name);
		this.config.onConflict = sql`(${sql.raw(targetColumn)})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
		return this;
	}
	/**
	* Attach [sqlcommenter](https://google.github.io/sqlcommenter) comment to a query
	*/
	comment(comment) {
		this.config.comment = sql.comment(comment);
		return this;
	}
	getSQL() {
		return this.dialect.buildInsertQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	/** @internal */
	getSelectedFields() {
		return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
			alias: getTableName(this.config.table),
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		})) : void 0;
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		this.config.ignoreSelectionCastCodecs = true;
		return this;
	}
	$dynamic() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/insert.js
var PgAsyncInsertBase = class extends PgInsertBase {
	static [entityKind] = "PgAsyncInsert";
	/** @internal */
	_prepare(name, generateName = false) {
		const { session, config, dialect } = this;
		const { returning: fields } = config;
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const query = dialect.sqlToQuery(this.getSQL());
			const mapper = fields ? this.dialect.mapperGenerators.rows(fields, void 0) : void 0;
			return session.prepareQuery(query, fields ? "arrays" : "raw", name ?? generateName, mapper, {
				type: "insert",
				tables: [...extractUsedTable(this.config.table)]
			});
		});
	}
	prepare(name) {
		return this._prepare(name, true);
	}
	execute = (placeholderValues) => {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
applyMixins(PgAsyncInsertBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/query.js
var RelationalQueryBuilder = class {
	static [entityKind] = "PgRelationalQueryBuilderV2";
	constructor(schema, table, tableConfig, dialect, session, parseJson, builder = PgRelationalQuery) {
		this.schema = schema;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.parseJson = parseJson;
		this.builder = builder;
	}
	findMany(config) {
		return new this.builder(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many", this.parseJson);
	}
	findFirst(config) {
		return new this.builder(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first", this.parseJson);
	}
};
var PgRelationalQuery = class {
	static [entityKind] = "PgRelationalQueryV2";
	constructor(schema, table, tableConfig, dialect, session, config, mode, parseJson) {
		this.schema = schema;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.config = config;
		this.mode = mode;
		this.parseJson = parseJson;
	}
	_getQuery() {
		return this.dialect.buildRelationalQuery({
			schema: this.schema,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			mode: this.mode
		});
	}
	getSQL() {
		return this._getQuery().sql;
	}
	_toSQL() {
		const query = this._getQuery();
		return {
			query,
			builtQuery: this.dialect.sqlToQuery(query.sql)
		};
	}
	toSQL() {
		return this._toSQL().builtQuery;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/query.js
var PgAsyncRelationalQuery = class extends PgRelationalQuery {
	static [entityKind] = "PgAsyncRelationalQueryV2";
	/** @internal */
	_prepare(name, generateName = false) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const { query, builtQuery } = this._toSQL();
			const mapper = this.dialect.mapperGenerators.relationalRows({
				isFirst: this.mode === "first",
				parseJson: this.parseJson,
				parseJsonIfString: false,
				rootJsonMappers: false,
				selection: query.selection,
				arrayModeRoot: true
			});
			return this.session.prepareQuery(builtQuery, "arrays", name ?? generateName, mapper);
		});
	}
	prepare(name) {
		return this._prepare(name, true);
	}
	execute(placeholderValues) {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	}
};
applyMixins(PgAsyncRelationalQuery, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/raw.js
var PgRaw = class {
	static [entityKind] = "PgRaw";
	constructor(prepared, sql, query) {
		this.prepared = prepared;
		this.sql = sql;
		this.query = query;
	}
	getSQL() {
		return this.sql;
	}
	getQuery() {
		return this.query;
	}
	_prepare() {
		return this.prepared;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/raw.js
var PgAsyncRaw = class extends PgRaw {
	static [entityKind] = "PgAsyncRaw";
	constructor(prepared, sql, query) {
		super(prepared, sql, query);
	}
	execute(placeholderValues) {
		return this.prepared.execute(placeholderValues);
	}
	_prepare() {
		return this.prepared;
	}
};
applyMixins(PgAsyncRaw, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.js
var PgRefreshMaterializedView = class {
	static [entityKind] = "PgRefreshMaterializedView";
	config;
	constructor(view, session, dialect) {
		this.session = session;
		this.dialect = dialect;
		this.config = { view };
	}
	concurrently() {
		if (this.config.withNoData !== void 0) throw new Error("Cannot use concurrently and withNoData together");
		this.config.concurrently = true;
		return this;
	}
	withNoData() {
		if (this.config.concurrently !== void 0) throw new Error("Cannot use concurrently and withNoData together");
		this.config.withNoData = true;
		return this;
	}
	/** @internal */
	getSQL() {
		return this.dialect.buildRefreshMaterializedViewQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/refresh-materialized-view.js
var PgAsyncRefreshMaterializedView = class extends PgRefreshMaterializedView {
	static [entityKind] = "PgAsyncRefreshMaterializedView";
	/** @internal */
	_prepare(name, generateName = false) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const query = this.dialect.sqlToQuery(this.getSQL());
			return this.session.prepareQuery(query, "raw", name ?? generateName);
		});
	}
	prepare(name) {
		return this._prepare(name, true);
	}
	execute = (placeholderValues) => {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
applyMixins(PgAsyncRefreshMaterializedView, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/select.js
var PgAsyncSelectBase = class extends PgSelectBase {
	static [entityKind] = "PgAsyncSelectQueryBuilder";
	/** @internal */
	_prepare(name, generateName = false) {
		const { session, dialect, cacheConfig, usedTables } = this;
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const query = this.config.tagged ? dialect._sqlToQuery(this.getSQL()) : dialect.sqlToQuery(this.getSQL());
			const fieldsList = this.config.fieldsFlat;
			const mapper = this.dialect.mapperGenerators.rows(fieldsList, this.joinsNotNullableMap);
			return session.prepareQuery(query, "arrays", name ?? generateName, mapper, {
				type: "select",
				tables: [...usedTables]
			}, cacheConfig);
		});
	}
	/**
	* Create a prepared statement for this query. This allows
	* the database to remember this query for the given session
	* and call it by name, rather than specifying the full query.
	*
	* {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
	*/
	prepare(name) {
		return this._prepare(name, true);
	}
	execute(placeholderValues) {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	}
};
applyMixins(PgAsyncSelectBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/query-builders/update.js
var PgUpdateBuilder = class {
	static [entityKind] = "PgUpdateBuilder";
	constructor(table, session, dialect, withList, builder = PgUpdateBase) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
		this.builder = builder;
	}
	set(values) {
		return new this.builder(this.table, mapUpdateSet(this.table, values), this.session, this.dialect, this.withList);
	}
};
var PgUpdateBase = class {
	static [entityKind] = "PgUpdate";
	config;
	tableName;
	joinsNotNullableMap;
	constructor(table, set, session, dialect, withList) {
		this.session = session;
		this.dialect = dialect;
		this.config = {
			set,
			table,
			withList,
			joins: []
		};
		this.tableName = getTableLikeName(table);
		this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
	}
	from(source) {
		const src = source;
		const tableName = getTableLikeName(src);
		if (typeof tableName === "string") this.joinsNotNullableMap[tableName] = true;
		this.config.from = src;
		return this;
	}
	getTableLikeFields(table) {
		if (is(table, PgTable)) return table[Table.Symbol.Columns];
		else if (is(table, Subquery)) return table._.selectedFields;
		return table[ViewBaseConfig].selectedFields;
	}
	createJoin(joinType) {
		return ((table, on) => {
			const tableName = getTableLikeName(table);
			if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) throw new Error(`Alias "${tableName}" is already used in this query`);
			if (typeof on === "function") {
				const from = this.config.from && !is(this.config.from, SQL) ? this.getTableLikeFields(this.config.from) : void 0;
				on = on(new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})), from && new Proxy(from, new SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})));
			}
			this.config.joins.push({
				on,
				table,
				joinType,
				alias: tableName
			});
			if (typeof tableName === "string") switch (joinType) {
				case "left":
					this.joinsNotNullableMap[tableName] = false;
					break;
				case "right":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "inner":
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "full":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = false;
			}
			return this;
		});
	}
	leftJoin = this.createJoin("left");
	rightJoin = this.createJoin("right");
	innerJoin = this.createJoin("inner");
	fullJoin = this.createJoin("full");
	/**
	* Adds a 'where' clause to the query.
	*
	* Calling this method will update only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/update}
	*
	* @param where the 'where' clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be updated.
	*
	* ```ts
	* // Update all cars with green color
	* await db.update(cars).set({ color: 'red' })
	*   .where(eq(cars.color, 'green'));
	* // or
	* await db.update(cars).set({ color: 'red' })
	*   .where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Update all BMW cars with a green color
	* await db.update(cars).set({ color: 'red' })
	*   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Update all cars with the green or blue color
	* await db.update(cars).set({ color: 'red' })
	*   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	returning(fields) {
		if (!fields) {
			fields = Object.assign({}, this.config.table[Table.Symbol.Columns]);
			if (this.config.from) {
				const tableName = getTableLikeName(this.config.from);
				if (typeof tableName === "string" && this.config.from && !is(this.config.from, SQL)) {
					const fromFields = this.getTableLikeFields(this.config.from);
					fields[tableName] = fromFields;
				}
				for (const join of this.config.joins) {
					const tableName = getTableLikeName(join.table);
					if (typeof tableName === "string" && !is(join.table, SQL)) {
						const fromFields = this.getTableLikeFields(join.table);
						fields[tableName] = fromFields;
					}
				}
			}
		}
		this.config.returningFields = fields;
		this.config.returning = orderSelectedFields(fields, void 0, this.dialect.codecs);
		return this;
	}
	/**
	* Attach [sqlcommenter](https://google.github.io/sqlcommenter) comment to a query
	*/
	comment(comment) {
		this.config.comment = sql.comment(comment);
		return this;
	}
	getSQL() {
		return this.dialect.buildUpdateQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	/** @internal */
	getSelectedFields() {
		return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
			alias: getTableName(this.config.table),
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		})) : void 0;
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		this.config.ignoreSelectionCastCodecs = true;
		return this;
	}
	$dynamic() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/update.js
var PgAsyncUpdateBase = class extends PgUpdateBase {
	static [entityKind] = "PgAsyncUpdate";
	/** @internal */
	_prepare(name, generateName = false) {
		const { session, config, dialect, joinsNotNullableMap } = this;
		const { returning: fields } = config;
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const query = dialect.sqlToQuery(this.getSQL());
			const mapper = fields ? this.dialect.mapperGenerators.rows(fields, joinsNotNullableMap) : void 0;
			return session.prepareQuery(query, fields ? "arrays" : "raw", name ?? generateName, mapper, {
				type: "update",
				tables: [...extractUsedTable(this.config.table)]
			});
		});
	}
	prepare(name) {
		return this._prepare(name, true);
	}
	execute = (placeholderValues = {}) => {
		return this._prepare().execute(placeholderValues);
	};
};
applyMixins(PgAsyncUpdateBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/db.js
var PgAsyncDatabase = class {
	static [entityKind] = "PgAsyncDatabase";
	query;
	constructor(dialect, session, relations, parseRqbJson = false, tagged = false) {
		this.dialect = dialect;
		this.session = session;
		this.tagged = tagged;
		this._ = {
			relations,
			session
		};
		this.query = {};
		for (const [tableName, relation] of Object.entries(relations)) this.query[tableName] = new RelationalQueryBuilder(relations, relations[relation.name].table, relation, dialect, session, parseRqbJson, PgAsyncRelationalQuery);
		this.$cache = { invalidate: async (_params) => {} };
	}
	/**
	* Creates a subquery that defines a temporary named result set as a CTE.
	*
	* It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
	*
	* @param alias The alias for the subquery.
	*
	* Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
	*
	* @example
	*
	* ```ts
	* // Create a subquery with alias 'sq' and use it in the select query
	* const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
	*
	* const result = await db.with(sq).select().from(sq);
	* ```
	*
	* To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
	*
	* ```ts
	* // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
	* const sq = db.$with('sq').as(db.select({
	*   name: sql<string>`upper(${users.name})`.as('name'),
	* })
	* .from(users));
	*
	* const result = await db.with(sq).select({ name: sq.name }).from(sq);
	* ```
	*/
	$with = (alias, selection) => {
		const as = (qb) => {
			if (typeof qb === "function") qb = qb(new QueryBuilder(this.dialect));
			const sql = ("withoutSelectionCastCodecs" in qb ? qb.withoutSelectionCastCodecs() : qb).getSQL();
			return new Proxy(new WithSubquery(sql, selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true, sql.usedTables ?? []), new SelectionProxyHandler({
				alias,
				sqlAliasedBehavior: "alias",
				sqlBehavior: "error"
			}));
		};
		return { as };
	};
	$count(source, filters) {
		return new PgAsyncCountBuilder({
			source,
			filters,
			session: this.session,
			dialect: this.dialect
		});
	}
	$cache;
	/**
	* Incorporates a previously defined CTE (using `$with`) into the main query.
	*
	* This method allows the main query to reference a temporary named result set.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
	*
	* @param queries The CTEs to incorporate into the main query.
	*
	* @example
	*
	* ```ts
	* // Define a subquery 'sq' as a CTE using $with
	* const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
	*
	* // Incorporate the CTE 'sq' into the main query and select from it
	* const result = await db.with(sq).select().from(sq);
	* ```
	*/
	with(...queries) {
		const self = this;
		function select(fields) {
			return new PgSelectBuilder({
				fields: fields ?? void 0,
				session: self.session,
				dialect: self.dialect,
				withList: queries,
				tagged: self.tagged
			}, PgAsyncSelectBase);
		}
		function selectDistinct(fields) {
			return new PgSelectBuilder({
				fields: fields ?? void 0,
				session: self.session,
				dialect: self.dialect,
				withList: queries,
				distinct: true,
				tagged: self.tagged
			}, PgAsyncSelectBase);
		}
		function selectDistinctOn(on, fields) {
			return new PgSelectBuilder({
				fields: fields ?? void 0,
				session: self.session,
				dialect: self.dialect,
				withList: queries,
				distinct: { on },
				tagged: self.tagged
			}, PgAsyncSelectBase);
		}
		/**
		* Creates an update query.
		*
		* Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
		*
		* Use `.set()` method to specify which values to update.
		*
		* See docs: {@link https://orm.drizzle.team/docs/update}
		*
		* @param table The table to update.
		*
		* @example
		*
		* ```ts
		* // Update all rows in the 'cars' table
		* await db.update(cars).set({ color: 'red' });
		*
		* // Update rows with filters and conditions
		* await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
		*
		* // Update with returning clause
		* const updatedCar: Car[] = await db.update(cars)
		*   .set({ color: 'red' })
		*   .where(eq(cars.id, 1))
		*   .returning();
		* ```
		*/
		function update(table) {
			return new PgUpdateBuilder(table, self.session, self.dialect, queries, PgAsyncUpdateBase);
		}
		/**
		* Creates an insert query.
		*
		* Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
		*
		* See docs: {@link https://orm.drizzle.team/docs/insert}
		*
		* @param table The table to insert into.
		*
		* @example
		*
		* ```ts
		* // Insert one row
		* await db.insert(cars).values({ brand: 'BMW' });
		*
		* // Insert multiple rows
		* await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
		*
		* // Insert with returning clause
		* const insertedCar: Car[] = await db.insert(cars)
		*   .values({ brand: 'BMW' })
		*   .returning();
		* ```
		*/
		function insert(table) {
			return new PgInsertBuilder(table, self.session, self.dialect, queries, void 0, PgAsyncInsertBase);
		}
		/**
		* Creates a delete query.
		*
		* Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
		*
		* See docs: {@link https://orm.drizzle.team/docs/delete}
		*
		* @param table The table to delete from.
		*
		* @example
		*
		* ```ts
		* // Delete all rows in the 'cars' table
		* await db.delete(cars);
		*
		* // Delete rows with filters and conditions
		* await db.delete(cars).where(eq(cars.color, 'green'));
		*
		* // Delete with returning clause
		* const deletedCar: Car[] = await db.delete(cars)
		*   .where(eq(cars.id, 1))
		*   .returning();
		* ```
		*/
		function delete_(table) {
			return new PgAsyncDeleteBase(table, self.session, self.dialect, queries);
		}
		return {
			select,
			selectDistinct,
			selectDistinctOn,
			update,
			insert,
			delete: delete_
		};
	}
	select(fields) {
		return new PgSelectBuilder({
			fields: fields ?? void 0,
			session: this.session,
			dialect: this.dialect,
			tagged: this.tagged
		}, PgAsyncSelectBase);
	}
	selectDistinct(fields) {
		return new PgSelectBuilder({
			fields: fields ?? void 0,
			session: this.session,
			dialect: this.dialect,
			distinct: true,
			tagged: this.tagged
		}, PgAsyncSelectBase);
	}
	selectDistinctOn(on, fields) {
		return new PgSelectBuilder({
			fields: fields ?? void 0,
			session: this.session,
			dialect: this.dialect,
			distinct: { on },
			tagged: this.tagged
		}, PgAsyncSelectBase);
	}
	/**
	* Creates an update query.
	*
	* Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
	*
	* Use `.set()` method to specify which values to update.
	*
	* See docs: {@link https://orm.drizzle.team/docs/update}
	*
	* @param table The table to update.
	*
	* @example
	*
	* ```ts
	* // Update all rows in the 'cars' table
	* await db.update(cars).set({ color: 'red' });
	*
	* // Update rows with filters and conditions
	* await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
	*
	* // Update with returning clause
	* const updatedCar: Car[] = await db.update(cars)
	*   .set({ color: 'red' })
	*   .where(eq(cars.id, 1))
	*   .returning();
	* ```
	*/
	update(table) {
		return new PgUpdateBuilder(table, this.session, this.dialect, void 0, PgAsyncUpdateBase);
	}
	/**
	* Creates an insert query.
	*
	* Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert}
	*
	* @param table The table to insert into.
	*
	* @example
	*
	* ```ts
	* // Insert one row
	* await db.insert(cars).values({ brand: 'BMW' });
	*
	* // Insert multiple rows
	* await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
	*
	* // Insert with returning clause
	* const insertedCar: Car[] = await db.insert(cars)
	*   .values({ brand: 'BMW' })
	*   .returning();
	* ```
	*/
	insert(table) {
		return new PgInsertBuilder(table, this.session, this.dialect, void 0, void 0, PgAsyncInsertBase);
	}
	/**
	* Creates a delete query.
	*
	* Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
	*
	* See docs: {@link https://orm.drizzle.team/docs/delete}
	*
	* @param table The table to delete from.
	*
	* @example
	*
	* ```ts
	* // Delete all rows in the 'cars' table
	* await db.delete(cars);
	*
	* // Delete rows with filters and conditions
	* await db.delete(cars).where(eq(cars.color, 'green'));
	*
	* // Delete with returning clause
	* const deletedCar: Car[] = await db.delete(cars)
	*   .where(eq(cars.id, 1))
	*   .returning();
	* ```
	*/
	delete(table) {
		return new PgAsyncDeleteBase(table, this.session, this.dialect);
	}
	refreshMaterializedView(view) {
		return new PgAsyncRefreshMaterializedView(view, this.session, this.dialect);
	}
	execute(query) {
		const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
		const builtQuery = this.dialect.sqlToQuery(sequel);
		return new PgAsyncRaw(this.session.prepareQuery(builtQuery, "raw", false), sequel, builtQuery);
	}
	transaction(transaction, config) {
		return this.session.transaction(transaction, config);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/session.js
var PgBasePreparedQuery = class {
	static [entityKind] = "PgBasePreparedQuery";
	constructor(query) {
		this.query = query;
	}
	getQuery() {
		return this.query;
	}
};
var PgSession = class {
	static [entityKind] = "PgSession";
	constructor(dialect) {
		this.dialect = dialect;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/cache/core/cache.js
var Cache = class {
	static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
	static [entityKind] = "NoopCache";
	strategy() {
		return "all";
	}
	async get(_key) {}
	async put(_hashedQuery, _response, _tables, _config) {}
	async onMutate(_params) {}
};
const strategyFor = async (query, params, queryMetadata, withCacheConfig) => {
	if (!queryMetadata) return { type: "skip" };
	const { type, tables } = queryMetadata;
	if ((type === "insert" || type === "update" || type === "delete") && tables.length > 0) return {
		type: "invalidate",
		tables
	};
	if (!withCacheConfig) return { type: "skip" };
	if (!withCacheConfig.enabled) return { type: "skip" };
	if (type === "select") return {
		type: "try",
		key: withCacheConfig.tag ?? await hashQuery(query, params),
		isTag: typeof withCacheConfig.tag !== "undefined",
		autoInvalidate: withCacheConfig.autoInvalidate,
		tables: queryMetadata.tables,
		config: withCacheConfig.config
	};
	return { type: "skip" };
};
async function hashQuery(sql, params) {
	const dataToHash = `${sql}-${JSON.stringify(params, (_, v) => typeof v === "bigint" ? `${v}n` : v)}`;
	const data = new TextEncoder().encode(dataToHash);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/pg-core/async/session.js
var PgAsyncPreparedQuery = class extends PgBasePreparedQuery {
	static [entityKind] = "PgAsyncPreparedQuery";
	/** @internal */
	mapper;
	fastPath;
	constructor(executor, query, mapper, mode, logger, cache, queryMetadata, cacheConfig) {
		super(query);
		this.executor = executor;
		this.mode = mode;
		this.logger = logger;
		this.cache = cache;
		this.queryMetadata = queryMetadata;
		this.cacheConfig = cacheConfig;
		this.mapper = mapper;
		if (cache && cache.strategy() === "all" && cacheConfig === void 0) this.cacheConfig = {
			enabled: true,
			autoInvalidate: true
		};
		if (!this.cacheConfig?.enabled) this.cacheConfig = void 0;
		this.fastPath = cacheConfig === void 0 && (cache === void 0 || is(cache, NoopCache)) && true;
	}
	async execute(placeholderValues = {}) {
		const { query, logger, executor, mapper, fastPath } = this;
		if (fastPath) {
			const sql = query._sql ? query._sql.join(" ") : query.sql;
			const params = query.params.length === 0 ? query.params : fillPlaceholders(query.params, placeholderValues);
			logger.logQuery(sql, params);
			const res = executor(params).catch((e) => {
				throw new DrizzleQueryError(sql, params, e);
			});
			if (!mapper) return res;
			return res.then((rows) => mapper(rows));
		}
		return tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = fillPlaceholders(this.query.params, placeholderValues);
			const sql = this.query._sql ? this.query._sql.join(" ") : this.query.sql;
			const { mapper } = this;
			span?.setAttributes({
				"drizzle.query.text": sql,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(sql, params);
			const query = tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": sql,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(sql, params, () => this.executor(params));
			});
			if (!mapper) return query;
			return query.then((rows) => tracer.startActiveSpan("drizzle.mapResponse", () => mapper(rows)));
		});
	}
	/** @internal */
	async queryWithCache(queryString, params, query) {
		const cacheStrat = this.cache !== void 0 && !is(this.cache, NoopCache) ? await strategyFor(queryString, params, this.queryMetadata, this.cacheConfig) : { type: "skip" };
		if (cacheStrat.type === "skip") return query().catch((e) => {
			throw new DrizzleQueryError(queryString, params, e);
		});
		const cache = this.cache;
		if (cacheStrat.type === "invalidate") return Promise.all([query(), cache.onMutate({ tables: cacheStrat.tables })]).then((res) => res[0]).catch((e) => {
			throw new DrizzleQueryError(queryString, params, e);
		});
		if (cacheStrat.type === "try") {
			const { tables, key, isTag, autoInvalidate, config } = cacheStrat;
			const fromCache = await cache.get(key, tables, isTag, autoInvalidate);
			if (fromCache === void 0) {
				const result = await query().catch((e) => {
					throw new DrizzleQueryError(queryString, params, e);
				});
				await cache.put(key, result, autoInvalidate ? tables : [], isTag, config);
				return result;
			}
			return fromCache;
		}
		assertUnreachable(cacheStrat);
	}
};
var PgAsyncSession = class extends PgSession {
	static [entityKind] = "PgAsyncSession";
	execute(query) {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return tracer.startActiveSpan("drizzle.prepareQuery", () => {
				return this.prepareQuery(this.dialect.sqlToQuery(query), "raw", false);
			}).execute();
		});
	}
	arrays(query) {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return tracer.startActiveSpan("drizzle.prepareQuery", () => {
				return this.prepareQuery(this.dialect.sqlToQuery(query), "arrays", false);
			}).execute();
		});
	}
	objects(query) {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return tracer.startActiveSpan("drizzle.prepareQuery", () => {
				return this.prepareQuery(this.dialect.sqlToQuery(query), "objects", false);
			}).execute();
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/neon-http/codecs.js
const neonHttpCodecs = refineGenericPgCodecs({
	bigint: {
		normalize: BigInt,
		normalizeArray: arrayCompatNormalize(BigInt)
	},
	bigserial: {
		normalize: BigInt,
		normalizeArray: arrayCompatNormalize(BigInt)
	},
	bit: { normalizeArray: parsePgArray },
	bytea: { normalizeParam: String },
	date: {
		castArray: castToTextArr,
		normalize: textToDate,
		normalizeArray: arrayCompatNormalize(textToDate)
	},
	"date:string": { castArray: castToTextArr },
	timestamp: {
		castArray: castToTextArr,
		normalize: textToDateWithTz,
		normalizeArray: arrayCompatNormalize(textToDateWithTz)
	},
	timestamptz: {
		castArray: castToTextArr,
		normalize: textToDate,
		normalizeArray: arrayCompatNormalize(textToDate)
	},
	"timestamp:string": { castArray: castToTextArr },
	"timestamptz:string": { castArray: castToTextArr },
	"geometry(point)": { normalizeArray: parsePgArrayAndNormalize(parseGeometryXY) },
	"geometry(point):tuple": { normalizeArray: parsePgArrayAndNormalize(parseGeometryTuple) },
	interval: { castArray: castToTextArr },
	json: { normalizeParam: (v) => JSON.stringify(v) },
	jsonb: { normalizeParam: (v) => JSON.stringify(v) },
	line: {
		cast: castToText,
		castArray: castToTextArr
	},
	"line:tuple": {
		cast: castToText,
		castArray: castToTextArr
	},
	macaddr8: {
		castArrayInJson: castToTextArr,
		castArray: castToTextArr
	},
	point: {
		cast: castToText,
		castArray: castToTextArr
	},
	"point:tuple": {
		cast: castToText,
		castArray: castToTextArr
	},
	sparsevec: { normalizeArray: parsePgArray }
});
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/neon-http/session.js
var NeonHttpSession = class extends PgAsyncSession {
	static [entityKind] = "NeonHttpSession";
	logger;
	cache;
	/** @internal */
	client;
	constructor(client, dialect, relations, options = {}) {
		super(dialect);
		this.relations = relations;
		this.options = options;
		this.client = client;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, mode, _name, mapper, queryMetadata, cacheConfig) {
		const executor = (params) => {
			const q = this.client.query ?? this.client;
			if (mode === "raw") return (async () => q(query.sql, params, {
				arrayMode: false,
				fullResults: true,
				authToken: this.options.authToken
			}))();
			return q(query.sql, params, {
				arrayMode: mode === "arrays",
				fullResults: true,
				authToken: this.options.authToken
			}).then((it) => it.rows);
		};
		return new PgAsyncPreparedQuery(executor, query, mapper, mode, this.logger, this.cache, queryMetadata, cacheConfig);
	}
	async batch(queries) {
		const preparedQueries = [];
		const builtQueries = [];
		const q = this.client.query ?? this.client;
		for (const query of queries) {
			const preparedQuery = query._prepare();
			const builtQuery = preparedQuery.getQuery();
			preparedQueries.push(preparedQuery);
			builtQueries.push(q(builtQuery.sql, builtQuery.params, {
				fullResults: true,
				arrayMode: preparedQuery.mode === "arrays"
			}));
		}
		return (await this.client.transaction(builtQueries, {
			authToken: this.options.authToken,
			fullResults: true,
			arrayMode: true
		})).map((result, i) => preparedQueries[i].mapper ? preparedQueries[i].mapper(result.rows) : result);
	}
	async transaction(_transaction, _config = {}) {
		throw new Error("No transactions support in neon-http driver");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@1.0.0-rc.4_@neo_885d6ca15e5b37ab70a7380c985033ad/node_modules/drizzle-orm/neon-http/driver.js
var NeonHttpDatabase = class NeonHttpDatabase extends PgAsyncDatabase {
	static [entityKind] = "NeonHttpDatabase";
	$withAuth(token) {
		const session = new NeonHttpSession(this.session.client, this.dialect, this._.relations, {
			...this.session.options,
			authToken: token
		});
		return new NeonHttpDatabase(this.dialect, session, this._.relations);
	}
	async batch(batch) {
		return this.session.batch(batch);
	}
};
function construct(client, config = {}) {
	const dialect = new PgDialect({
		useJitMappers: jitCompatCheck(config.jit),
		codecs: config.codecs ?? neonHttpCodecs
	});
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	const relations = config.relations ?? {};
	const session = new NeonHttpSession(client, dialect, relations ?? {}, {
		logger,
		cache: config.cache
	});
	export_types.setTypeParser(export_types.builtins.TIMESTAMPTZ, (val) => val);
	export_types.setTypeParser(export_types.builtins.TIMESTAMP, (val) => val);
	export_types.setTypeParser(export_types.builtins.DATE, (val) => val);
	export_types.setTypeParser(export_types.builtins.INTERVAL, (val) => val);
	export_types.setTypeParser(1231, (val) => val);
	export_types.setTypeParser(1115, (val) => val);
	export_types.setTypeParser(1185, (val) => val);
	export_types.setTypeParser(1187, (val) => val);
	export_types.setTypeParser(1182, (val) => val);
	const db = new NeonHttpDatabase(dialect, session, relations);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(cs(params[0]), params[1]);
	const { connection, client, ...DrizzlePgConfig } = params[0];
	if (client) return construct(client, DrizzlePgConfig);
	if (typeof connection === "object") {
		const { connectionString, ...options } = connection;
		return construct(cs(connectionString, options), DrizzlePgConfig);
	}
	return construct(cs(connection), DrizzlePgConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//#endregion
export { and, arrayContains, boolean, desc, drizzle, eq, index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar };
