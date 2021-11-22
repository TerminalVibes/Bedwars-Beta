interface CoreGui extends PlayerGui {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_CoreGui: unique symbol;

	/**
	 * The current version of the CoreGui. Everytime the CoreGui is majorly changed, this number is increased.
	 **/
	readonly Version: number;
}

// Type Overrides
interface DataModel {
	HttpGet(http: string): string;
}

interface Services {
	CoreGui: CoreGui;
}
