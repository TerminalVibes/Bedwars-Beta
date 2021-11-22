// Metatable API:

/** Retrieve the metatable of value irregardless of value's metatable's __metatable field. Returns nil if it doesn't exist. */
declare function getrawmetatable<T>(value: T): LuaMetatable<T> & { __namecall?: (self: T, ...args: unknown[]) => any };

/** Sets o's metatable to mt even if the __metatable field exists in o's metatable. */
declare function setrawmetatable(o: any, mt: LuaMetatable<any>): boolean;

/** Sets t's read-only value to val. */
declare function setreadonly(t: LuaMetatable<any>, val: boolean): void;

/** Returns t's read-only condition. */
declare function isreadonly(t: LuaMetatable<any>): boolean;
