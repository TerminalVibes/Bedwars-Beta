interface DrawingObject {
	Visible: boolean;
	Transparency: number;
	Color: Color3;
	Remove(): void;
}

interface Line extends DrawingObject {
	Thickness: number;
	From: Vector2;
	To: Vector2;
}

interface Text extends DrawingObject {
	Text: string;
	Size: number;
	Center: boolean;
	Outline: boolean;
	OutlineColor: Color3;
	Position: Vector2;
	Font: number;
	readonly TextBounds: Vector2;
}

interface Image extends DrawingObject {
	Data: string;
	Size: Vector2;
	Position: Vector2;
	Rounding: number;
}

interface Circle extends DrawingObject {
	Thickness: number;
	NumSides: number;
	Radius: number;
	Filled: boolean;
	Position: Vector2;
}

interface Square extends DrawingObject {
	Thickness: number;
	Size: Vector2;
	Position: Vector2;
	Filled: boolean;
}

interface Quad extends DrawingObject {
	Thickness: number;
	PointA: Vector2;
	PointB: Vector2;
	PointC: Vector2;
	PointD: Vector2;
	Filled: boolean;
}

interface Triangle extends DrawingObject {
	Thickness: number;
	PointA: Vector2;
	PointB: Vector2;
	PointC: Vector2;
	Filled: boolean;
}

interface CreatableDrawings {
	Line: Line;
	Text: Text;
	Image: Image;
	Circle: Circle;
	Square: Square;
	Quad: Quad;
	Triangle: Triangle;
}

interface Drawing {
	new <T extends keyof CreatableDrawings>(Type: T): CreatableDrawings[T];
	Fonts: {
		UI: 0;
		System: 1;
		Plex: 2;
		Monospace: 3;
	};
}

declare const Drawing: Drawing;
