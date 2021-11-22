// Environment API:

/** Returns the environment that will be applied to each script ran by Synapse. */
declare function getgenv(): SynGlobals;

/** Returns the global environment for the LocalScript state. */
declare function getrenv(): void;

/** Returns the Lua registry. */
declare function getreg(): void;

/** Returns all functions and userdata values within the GC. Passing true will also return tables. */
declare function getgc(): void;

/** Returns a list of all instances within the game. */
declare function getinstances(): Instance[];

/** Returns a list of all instances parented to nil within the game. */
declare function getnilinstances(): Instance[];

/** Returns a list of all scripts within the game. */
declare function getscripts(): (LocalScript | ModuleScript)[];

/** Returns all ModuleScripts loaded in the game. */
declare function getloadedmodules(): ModuleScript[];

/** Gets a list of connections to the specified signal. */
declare function getconnections(obj: RBXScriptSignal): RBXScriptConnection;

/** Fires all the connections connected to the signal Signal with Args. */
declare function firesignal(Signal: RBXScriptSignal, ...args: any[]): void;

/** Fires the designated ClickDetector with provided Distance. If Distance isn't provided, it will default to 0. */
declare function fireclickdetector(Detector: ClickDetector, Distance?: number): void;

/** Fires the designated ProximityPrompt. */
declare function fireproximityprompt(Prompt: ProximityPrompt, Distance: number): void;

/**
 * Fakes a .Touched event to ToTouch with Part. The Toggle argument must be either 0 or 1 (for fire/un-fire).
 * Note: The ToTouch argument must have a child with class TouchTransmitter in order for this function to work.
 */
declare function firetouchinterest(Part: Instance, ToTouch: BasePart, Toggle: 1 | 0): void;

/** Returns true if the Part is owned by the player. */
declare function isnetworkowner(Part: BasePart): boolean;

/** Returns the hidden property Property from Object. Errors if the property does not exist. */
declare function gethiddenproperty(Object: Instance, Property: string): any;

/** Sets the hidden property Property with Value from Object. Errors if the property does not exist. */
declare function sethiddenproperty(Object: Instance, Property: string, Value: any): void;

/** Sets the player's SimulationRadius. If MaxSimulationRadius is specified, it will set that as well. */
declare function setsimulationradius(SimulationRadius: number, MaxSimulationRadius?: number): void;
