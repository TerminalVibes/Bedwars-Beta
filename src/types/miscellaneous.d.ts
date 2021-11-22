// Miscellaneous API:

/** Sets value to the clipboard. */
declare function setclipboard(Value: string): void;

/** Sets FFlag with Value. Must be run before the game loads, auto execute + auto launch recommended. */
declare function setfflag(FFlag: string, Value: string): void;

/** Returns the namecall method if the function is called in an __namecall metatable hook. */
declare function getnamecallmethod(): string;

/** Sets the current namecall method to the new namecall method. Must be called in a __namecall metatable hook. */
declare function setnamecallmethod(Method: string): void;

/** Returns a Content string that can be used as a fake Asset ID for GUI elements. Please note this will only affect your client. */
declare function getsynasset(path: string): any;

/** Gets a list of special properties for MeshParts, UnionOperations, and Terrain instances. */
declare function getspecialinfo(obj: Instance): void;

/** Saves the current game into your workspace folder. You can use table t to customize options for this. */
declare function saveinstance(t?: {
	mode?: "optimized" | "full" | "scripts";
	noscripts?: boolean;
	scriptcache?: boolean;
	timeout: number;
}): void;

/** Creates a message box with parameters text, caption and style. */
declare function messagebox(text: string, caption: string, flags: number): number;
