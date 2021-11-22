type Label = {
	UpdateText(text: string): Label;
};

type Button = {
	AddToolTip(name: string): Button;
};

type TextBox = {
	SetValue(value: string): TextBox;
	AddToolTip(name: string): TextBox;
};

type Toggle = {
	AddToolTip(name: string): Toggle;
	GetState(): boolean;
	CreateKeybind(
		bind: string,
		callback?: () => void,
	): {
		SetBind(Key: string): void;
		GetBind(): string;
	};
};

type Slider = {
	AddToolTip(name: string): void;
	GetValue(): number;
};

type Dropdown<T extends string> = {
	AddToolTip(name: string): Dropdown<T>;
	GetOption(): T;
	SetOption(option: T): Dropdown<T>;
	RemoveOption(option: T): Dropdown<T>;
	ClearOptions(): Dropdown<T>;
};

type ColorPicker = {
	AddToolTip(name: string): void;
	UpdateColor(color: Color3): void;
};

type Section = {
	/**
	 * Creates a text label
	 */
	CreateLabel(name: string): Label;

	/**
	 * Creates a button
	 */
	CreateButton(name: string, callback: () => void): Button;

	/**
	 * Creates a text box
	 */
	CreateTextBox(name: string, placeHolder: string, numbersOnly: boolean, callback: (value: string) => void): TextBox;

	/**
	 * Creates a toggle button
	 */
	CreateToggle(name: string, initialState: boolean | undefined, callback: (value: boolean) => void): Toggle;

	/**
	 * Creates a slider
	 */
	CreateSlider(
		name: string,
		min: number,
		max: number,
		initialValue: number,
		precise: boolean,
		callback: (value: number) => void,
	): Slider;

	/**
	 * Creates a dropdown
	 */
	CreateDropdown<T extends string>(
		name: string,
		optionTable: T[],
		callback: (value: T) => void,
		initialValue?: T,
	): Dropdown<T>;

	/**
	 * Creates a color picker
	 */
	CreateColorpicker(name: string, callback: (value: Color3) => void): ColorPicker;
};

type Tab = {
	CreateSection(name: string): Section;
};

type Window = {
	CreateTab(name: string): Tab;

	Toggle(status: boolean): void;
	ChangeColor(color: Color3): void;
	SetBackground(imageId: string | number): void;
	SetBackgroundColor(color: Color3): void;
	SetBackgroundTransparency(transparency: number): void;
	SetTileOffset(tileOffset: number): void;
	SetTileScale(tileScale: number): void;
};

export type Library = {
	CreateWindow(
		configs: {
			WindowName: string;
			Color: Color3;
		},
		parent: CoreGui | PlayerGui,
	): Window;
};
