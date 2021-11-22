// Hooking API:

/** Hooks function old, replacing it with the function hook. The old function is returned, you must use this function in order to call the original function. */
declare function hookfunction(old: (...args: any[]) => any, hook: (...args: any[]) => any): (...args: any[]) => any;

/** Hooks the metamethod passed in the object's metatable with hook. A function to call the original metamethod is returned, you must use this function in order to call the original metamethod. This function will error if an object without a metatable is passed or a invalid metamethod is passed. */
declare function hookmetamethod<T>(object: T, metamethod: string, hook: (...args: any[]) => any): (object: T, ...args: any[]) => any;

/** Pushes a new CClosure that invokes function f upon call. */
declare function newcclosure<T, F extends (self: T, ...args: any[]) => any>(f: F): F;
