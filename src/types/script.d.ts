// Script API:

/** Returns the environment of Script. Errors if the script is not loaded in memory. */
declare function getsenv(Script: LocalScript | ModuleScript): any;

/** Gets the script that is calling this function. */
declare function getcallingscript(): LocalScript | ModuleScript | undefined;

/** Gets a bare function from the script passed. Please note this is not the original function of the script and will not have upvalues/enviornment correctly defined. */
declare function getscriptclosure(Script: LocalScript | ModuleScript): (...args: any[]) => any;

/** Returns a SHA384 hash of the scripts bytecode. You can use this to detect changes of a script. */
declare function getscripthash(Script: LocalScript | ModuleScript): String;
