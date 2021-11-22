// Reflection API:

/** Loads chunk as a Lua function with optional chunk_name and returns it if compilation is successful. Otherwise, if an error has occurred during compilation, nil followed by the error message will be returned. */
declare function loadstring(chunk: string, chunk_name?: string): (...args: any[]) => any | undefined

/** Returns true if the current thread is a Synapse thread. Note: Checkcaller does NOT check the call stack of the function, if you call a game function then it calls out to checkcaller, the result will be true! Be careful. */
declare function checkcaller(): boolean;

/** Returns true if f is an LClosure. */
declare function islclosure(f: (...args: any[]) => any): boolean;

/** Returns the Synapse formatted bytecode for source string script. */
declare function dumpstring(Script: string): string;

/** Decompiles Script and returns the decompiled script with timeout. If the decompilation fails, then the return value will be an error message. */
declare function decompile(Script: LocalScript | ModuleScript | string | ((...args: any[]) => any), mode?: any, timeout?: number): string;
