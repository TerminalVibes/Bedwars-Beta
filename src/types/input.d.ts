// Input API:

/** Returns if the main window is in focus. This must return true for any other mouse/keyboard function to work. */
declare function iswindowactive(): boolean;

/** Simulates a key press for the specified keycode. */
declare function keypress(keycode: number): void;

/** Releases key on the keyboard. You can access the key values from the link above. */
declare function keyrelease(keycode: number): void;

/** Simulates a full left mouse button press. */
declare function mouse1click(): void;

/** Simulates a left mouse button press without releasing it. */
declare function mouse1press(): void;

/** Simulates a left mouse button release. */
declare function mouse1release(): void;

/** Simulates a full right mouse button press. */
declare function mouse2click(): void;

/** Clicks down on the right mouse button. */
declare function mouse2press(): void;

/** Simulates a right mouse button release. */
declare function mouse2release(): void;

/** Scrolls the mouse wheel virtually by px pixels. */
declare function mousescroll(px: number): void;

/** Moves the mouse cursor relatively to the current mouse position by coordinates x and y. */
declare function mousemoverel(x: number, y: number): void;

/** Move's your mouse to the x and y coordinates in pixels from topleft of the main window. */
declare function mousemoveabs(x: number, y: number): void;