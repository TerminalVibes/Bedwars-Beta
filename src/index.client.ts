import {
	CoreGui,
	Debris,
	Players,
	ReplicatedStorage,
	RunService,
	StarterGui,
	TweenService,
	UserInputService,
	Workspace,
} from "@rbxts/services";
import { Library } from "ui";

// Libraries:
namespace Bin {
	export type Item =
		| (() => unknown)
		| RBXScriptConnection
		| { destroy(): void }
		| { Destroy(): void }
		| { Remove(): void };
}
type Node = { next?: Node; item: Bin.Item; isDrawing: boolean };
class Bin {
	private head: Node | undefined;
	private tail: Node | undefined;

	/**
	 * Adds an item into the Bin. This can be a:
	 * - `() => unknown`
	 * - RBXScriptConnection
	 * - Object with `.destroy()` or `.Destroy()`
	 */
	public add<T extends Bin.Item>(item: T, isDrawing = false): T {
		const node: Node = { item, isDrawing };
		this.head ??= node;
		if (this.tail) this.tail.next = node;
		this.tail = node;
		return item;
	}

	/**
	 * Destroys all items currently in the Bin:
	 * - Functions will be called
	 * - RBXScriptConnections will be disconnected
	 * - Objects will be `.destroy()`-ed
	 */
	public destroy(): void {
		while (this.head) {
			const item = this.head.item;
			if (typeIs(item, "function")) {
				item();
			} else if (this.head.isDrawing) {
				(item as DrawingObject).Remove();
			} else if (typeIs(item, "RBXScriptConnection")) {
				item.Disconnect();
			} else if ("destroy" in item) {
				item.destroy();
			} else if ("Destroy" in item) {
				item.Destroy();
			}
			this.head = this.head.next;
		}
	}

	/**
	 * Checks whether the Bin is empty.
	 */
	public isEmpty(): boolean {
		return this.head === undefined;
	}
}

class Nametag {
	public static readonly Instances = new Map<Player, Nametag>();
	private readonly Bin = new Bin();
	private readonly TextLabel = this.Bin.add(new Drawing("Text"), true);
	constructor(private Player: Player) {
		Nametag.Instances.set(Player, this);
		this.TextLabel.Text = Player.DisplayName;
		this.TextLabel.Font = Drawing.Fonts.System;
		this.TextLabel.Size = 18;
		this.TextLabel.Center = true;
		this.TextLabel.Outline = true;
		this.TextLabel.OutlineColor = new Color3(0.1, 0.1, 0.1);
		this.TextLabel.Color = Player.TeamColor.Color;
		this.TextLabel.Transparency = 0.85;
		this.Bin.add(RunService.RenderStepped.Connect(() => this.update()));
	}

	private update() {
		const Player = this.Player;
		const Character = Player.Character;
		const Camera = Workspace.CurrentCamera;
		if (Character && Camera) {
			const Head = Character.FindFirstChild("Head") as BasePart | undefined;
			const HumanoidRootPart = Character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
			if (Head && HumanoidRootPart) {
				const [Position] = Camera.WorldToViewportPoint(
					HumanoidRootPart.CFrame.mul(new CFrame(0, Head.Size.Y + HumanoidRootPart.Size.Y, 0)).Position,
				);
				if (Position.Z > 0) {
					this.TextLabel.Position = new Vector2(Position.X, Position.Y).sub(
						new Vector2(0, this.TextLabel.TextBounds.Y),
					);
					this.TextLabel.Visible = true;
				} else this.TextLabel.Visible = false;
			} else this.TextLabel.Visible = false;
		} else this.TextLabel.Visible = false;
	}

	public Destroy(): void {
		Nametag.Instances.delete(this.Player);
		this.Bin.destroy();
	}
}

class ESPBox {
	public static readonly Instances = new Map<Player, ESPBox>();
	private readonly Bin = new Bin();
	private readonly library = {
		TLX: new Drawing("Line"),
		TLY: new Drawing("Line"),
		TRX: new Drawing("Line"),
		TRY: new Drawing("Line"),
		BLX: new Drawing("Line"),
		BLY: new Drawing("Line"),
		BRX: new Drawing("Line"),
		BRY: new Drawing("Line"),
	};

	constructor(private Player: Player) {
		ESPBox.Instances.set(Player, this);
		for (const [, v] of pairs(this.library)) {
			v.Color = Player.TeamColor.Color;
			v.Transparency = 1;
			this.Bin.add(v, true);
		}
		this.Bin.add(RunService.RenderStepped.Connect(() => this.update()));
	}

	private update(): void {
		const library = this.library;

		const Player = this.Player;
		const Character = Player.Character;
		const Camera = Workspace.CurrentCamera;
		if (Character && Camera) {
			const HumanoidRootPart = Character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
			if (HumanoidRootPart) {
				const Size = HumanoidRootPart.Size.mul(new Vector3(1.25, 1.5, 1));
				const Root = HumanoidRootPart.CFrame;
				const [ScreenPosition, OnScreen] = Camera.WorldToViewportPoint(HumanoidRootPart.Position);
				if (OnScreen) {
					const [TL] = Camera.WorldToViewportPoint(Root.mul(new CFrame(Size.X, Size.Y, 0)).Position);
					const [TLX] = Camera.WorldToViewportPoint(Root.mul(new CFrame(Size.X * 0.5, Size.Y, 0)).Position);
					const [TLY] = Camera.WorldToViewportPoint(Root.mul(new CFrame(Size.X, Size.Y * 0.5, 0)).Position);

					const [TR] = Camera.WorldToViewportPoint(Root.mul(new CFrame(-Size.X, Size.Y, 0)).Position);
					const [TRX] = Camera.WorldToViewportPoint(Root.mul(new CFrame(-Size.X * 0.5, Size.Y, 0)).Position);
					const [TRY] = Camera.WorldToViewportPoint(Root.mul(new CFrame(-Size.X, Size.Y * 0.5, 0)).Position);

					const [BL] = Camera.WorldToViewportPoint(Root.mul(new CFrame(Size.X, -Size.Y, 0)).Position);
					const [BLX] = Camera.WorldToViewportPoint(Root.mul(new CFrame(Size.X * 0.5, -Size.Y, 0)).Position);
					const [BLY] = Camera.WorldToViewportPoint(Root.mul(new CFrame(Size.X, -Size.Y * 0.5, 0)).Position);

					const [BR] = Camera.WorldToViewportPoint(Root.mul(new CFrame(-Size.X, -Size.Y, 0)).Position);
					const [BRX] = Camera.WorldToViewportPoint(Root.mul(new CFrame(-Size.X * 0.5, -Size.Y, 0)).Position);
					const [BRY] = Camera.WorldToViewportPoint(Root.mul(new CFrame(-Size.X, -Size.Y * 0.5, 0)).Position);

					library.TLX.From = new Vector2(TL.X, TL.Y);
					library.TLX.To = new Vector2(TLX.X, TLX.Y);
					library.TLY.From = new Vector2(TL.X, TL.Y);
					library.TLY.To = new Vector2(TLY.X, TLY.Y);

					library.TRX.From = new Vector2(TR.X, TR.Y);
					library.TRX.To = new Vector2(TRX.X, TRX.Y);
					library.TRY.From = new Vector2(TR.X, TR.Y);
					library.TRY.To = new Vector2(TRY.X, TRY.Y);

					library.BLX.From = new Vector2(BL.X, BL.Y);
					library.BLX.To = new Vector2(BLX.X, BLX.Y);
					library.BLY.From = new Vector2(BL.X, BL.Y);
					library.BLY.To = new Vector2(BLY.X, BLY.Y);

					library.BRX.From = new Vector2(BR.X, BR.Y);
					library.BRX.To = new Vector2(BRX.X, BRX.Y);
					library.BRY.From = new Vector2(BR.X, BR.Y);
					library.BRY.To = new Vector2(BRY.X, BRY.Y);

					const Thickness = math.clamp(100 / ScreenPosition.Z, 1, 4);
					for (const [, v] of pairs(library)) {
						v.Thickness = Thickness;
						v.Visible = true;
					}
				} else for (const [, v] of pairs(library)) v.Visible = false;
			} else for (const [, v] of pairs(library)) v.Visible = false;
		} else for (const [, v] of pairs(library)) v.Visible = false;
	}

	public Destroy(): void {
		ESPBox.Instances.delete(this.Player);
		this.Bin.destroy();
	}
}

class Tracer {
	public static readonly Instances = new Map<Player, Tracer>();

	private readonly Bin = new Bin();
	private readonly Line = this.Bin.add(new Drawing("Line"), true);

	constructor(private Player: Player) {
		Tracer.Instances.set(Player, this);
		this.Line.Color = this.Player.TeamColor.Color;
		this.Line.Transparency = 1;
		this.Line.Thickness = 2;
		this.Bin.add(RunService.RenderStepped.Connect(() => this.update()));
	}

	private update(): void {
		const Camera = Workspace.CurrentCamera;
		const Character = this.Player.Character;
		if (Camera && Character) {
			const Humanoid = Character.FindFirstChildWhichIsA("Humanoid");
			const HumanoidRootPart = Character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
			if (HumanoidRootPart && Humanoid && Humanoid.Health > 0) {
				const CameraCFrame = Camera.CFrame;
				const MousePosition = UserInputService.GetMouseLocation();

				const ObjectPosition = CameraCFrame.PointToObjectSpace(HumanoidRootPart.Position);
				const [ScreenPosition] = Camera.WorldToViewportPoint(HumanoidRootPart.Position);
				const [TracerPosition] = Camera.WorldToViewportPoint(
					CameraCFrame.PointToWorldSpace(
						ScreenPosition.Z < 0
							? CFrame.Angles(
									0,
									0,
									math.atan2(ObjectPosition.Y, ObjectPosition.X) + math.pi,
							  ).VectorToWorldSpace(
									CFrame.Angles(0, math.rad(89.9), 0).VectorToWorldSpace(new Vector3(0, 0, -1)),
							  )
							: ObjectPosition,
					),
				);
				this.Line.From = MousePosition.add(
					new Vector2(TracerPosition.X, TracerPosition.Y).sub(MousePosition).Unit.mul(10),
				);
				this.Line.To = new Vector2(TracerPosition.X, TracerPosition.Y);
				this.Line.Transparency = math.clamp(ScreenPosition.Z / 200, 0.4, 0.8);
				this.Line.Visible = true;
			} else this.Line.Visible = false;
		} else this.Line.Visible = false;
	}

	public Destroy(): void {
		Tracer.Instances.delete(this.Player);
		this.Bin.destroy();
	}
}

class Radar {
	private readonly Bin = new Bin();

	private readonly Origin: Triangle;
	private readonly Cursor: Circle;
	private readonly Border: Circle;
	private readonly Background: Circle;

	constructor(
		public Position: Vector2 = new Vector2(200, 200),
		public Radius: number = 100,
		public Adornee: Player | BasePart | (() => Vector3),
	) {
		this.Cursor = this.CreateCircle({
			Transparency: 1,
			Color: new Color3(1, 1, 1),
			Radius: 3,
			Filled: true,
			Thickness: 1,
		});

		this.Border = this.CreateCircle({
			Transparency: 0.75,
			Color: new Color3(0.3, 0.3, 0.3),
			Radius: this.Radius,
			Filled: false,
			Visible: true,
			Thickness: 3,
			Position: this.Position,
		});

		this.Background = this.CreateCircle({
			Transparency: 0.9,
			Color: new Color3(0.04, 0.04, 0.04),
			Radius: this.Radius,
			Filled: true,
			Visible: true,
			Thickness: 1,
			Position: this.Position,
		});

		this.Origin = this.Bin.add(new Drawing("Triangle"), true);
		this.Origin.Visible = true;
		this.Origin.Thickness = 1;
		this.Origin.Filled = true;
		this.Origin.Color = Color3.fromRGB(255, 255, 255);
		this.Origin.PointA = this.Position.add(new Vector2(0, -4));
		this.Origin.PointB = this.Position.add(new Vector2(-3, 4));
		this.Origin.PointC = this.Position.add(new Vector2(3, 4));

		task.defer(() => {
			let Dragging = false;
			let Offset = new Vector2(0, 0);
			Dragging = false;
			Offset = new Vector2(0, 0);
			this.Bin.add(
				UserInputService.InputBegan.Connect((input) => {
					if (
						input.UserInputType === Enum.UserInputType.MouseButton1 &&
						new Vector2(input.Position.X, input.Position.Y).sub(this.Position).Magnitude <= this.Radius
					) {
						Offset = this.Position.sub(new Vector2(input.Position.X, input.Position.Y));
						Dragging = true;
					}
				}),
			);
			this.Bin.add(
				UserInputService.InputEnded.Connect((input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						Dragging = false;
					}
				}),
			);
			this.Bin.add(
				RunService.RenderStepped.Connect(() => {
					const mousePosition = UserInputService.GetMouseLocation();
					if (mousePosition.sub(this.Position).Magnitude <= this.Radius) {
						this.Cursor.Visible = true;
						this.Cursor.Position = mousePosition;
					} else this.Cursor.Visible = false;
					if (Dragging) {
						this.Position = this.Position.Lerp(
							new Vector2(mousePosition.X, mousePosition.Y - 36).add(Offset),
							0.2,
						);
						this.Origin.PointA = this.Position.add(new Vector2(0, -4));
						this.Origin.PointB = this.Position.add(new Vector2(-3, 4));
						this.Origin.PointC = this.Position.add(new Vector2(3, 4));
						this.Border.Position = this.Position;
						this.Background.Position = this.Position;
					}
				}),
			);
		});
	}

	public Destroy(): void {
		this.Bin.destroy();
	}

	private RadarDot = class {
		private readonly Bin = new Bin();
		private readonly Dot: Circle;
		constructor(
			public Adornee: BasePart | (() => Vector3),
			Color: Color3 = Color3.fromRGB(60, 170, 255),
			public Parent: Radar,
		) {
			this.Dot = this.CreateCircle({
				Transparency: 1,
				Color: Color,
				Radius: 3,
				Filled: true,
				Thickness: 1,
			});
			Parent.Bin.add(this.Bin);
			this.Bin.add(
				RunService.RenderStepped.Connect(() => {
					const Position = typeIs(Adornee, "function")
						? Adornee()
						: Adornee.IsDescendantOf(game) && Adornee.Position;
					if (Position) {
						const Relative = this.GetRelative();
						const NewPosition = Parent.Position.sub(Relative);
					} else {
						this.Bin.destroy();
					}
				}),
			);
		}

		public Destroy(): void {
			this.Bin.destroy();
		}

		private GetRelative() {
			const Camera = Workspace.CurrentCamera;
			if (Camera) {
				const Adornee = this.Parent.Adornee;
				const Position = typeIs(Adornee, "Instance")
					? (Adornee.IsA("Player")
							? (Adornee.Character!.FindFirstChild("HumanoidRootPart") as BasePart)
							: Adornee
					  ).Position
					: Adornee();
				const OrientatedCFrame = new CFrame(Position, Camera.CFrame.Position);
				const ObjectSpace = OrientatedCFrame.PointToObjectSpace(
					typeIs(this.Adornee, "function") ? this.Adornee() : this.Adornee.Position,
				);
				return new Vector2(ObjectSpace.X, ObjectSpace.Z);
			}
			return new Vector2(0, 0);
		}
		private CreateCircle(properties: Partial<Circle>) {
			const {
				Transparency = 1,
				Color = new Color3(1, 1, 1),
				Visible = false,
				Thickness = 1,
				Position = new Vector2(0, 0),
				Radius = 100,
				Filled = false,
			} = properties;
			const Circle = new Drawing("Circle");
			Circle.Transparency = Transparency;
			Circle.Color = Color;
			Circle.Visible = Visible;
			Circle.Thickness = Thickness;
			Circle.Position = Position;
			Circle.Radius = Radius;
			Circle.NumSides = math.clamp((Radius * 55) / 100, 10, 75);
			Circle.Filled = Filled;
			this.Bin.add(Circle, true);
			return Circle;
		}
	};

	private CreateCircle(properties: Partial<Circle>) {
		const {
			Transparency = 1,
			Color = new Color3(1, 1, 1),
			Visible = false,
			Thickness = 1,
			Position = new Vector2(0, 0),
			Radius = 100,
			Filled = false,
		} = properties;
		const Circle = new Drawing("Circle");
		Circle.Transparency = Transparency;
		Circle.Color = Color;
		Circle.Visible = Visible;
		Circle.Thickness = Thickness;
		Circle.Position = Position;
		Circle.Radius = Radius;
		Circle.NumSides = math.clamp((Radius * 55) / 100, 10, 75);
		Circle.Filled = Filled;
		this.Bin.add(Circle, true);
		return Circle;
	}
}

class PartAdornment {
	public static readonly Instances = new Map<BasePart, PartAdornment>();
	private readonly Bin = new Bin();
	constructor(private Part: BasePart, Color: Color3) {
		PartAdornment.Instances.set(Part, this);

		const Adornment = this.Bin.add(new Instance("BoxHandleAdornment"));
		Adornment.Name = "BoxHandleAdornment";
		Adornment.Color3 = Color;
		Adornment.Transparency = 0.75;
		Adornment.AlwaysOnTop = true;
		Adornment.ZIndex = 5;
		Adornment.Adornee = Part;
		Adornment.Size = Part.Size.add(new Vector3(0.05, 0.05, 0.05));
		syn.protect_gui(Adornment);
		Adornment.Parent = Part;
		this.Bin.add(Part.AncestryChanged.Connect(() => this.Destroy()));
	}
	public Destroy(): void {
		PartAdornment.Instances.delete(this.Part);
		this.Bin.destroy();
	}
}

// Constants:
const Library = loadstring(
	game.HttpGet("https://raw.githubusercontent.com/OminousVibes-Exploit/Quality-Interfaces/main/Bracket-v3.lua"),
)() as Library;

const Configurations = {
	Combat: {
		Melee: {
			OrientationBot: false,
			DirectionOffset: 30,
			Sensitivity: 0.5,
			AutomaticSwing: false,
			OrientationDistance: 30,
			SwingDistance: 15,
		},
		Range: {
			SilentAim: false,
			FOVCircle: false,
			FOVRadius: 250,
			FOVColor3: Color3.fromRGB(255, 255, 255),
			FOVRainbow: false,
			TargetSelection: "Closest to Cursor",
		},
		Sprint: {
			Enabled: false,
			AlwaysActive: false,
			CameraFOV: true,
		},
	},
	Base: {
		Bed: {
			Alarm: true,
			Distance: 100,
			Callout: false,
			Message: "${team} is near bed",
			TeamOnly: true,
		},
	},
	Visuals: {
		Players: {
			Nametag: false,
			ESPBox: false,
			Tracers: false,
			IgnoreSpectators: false,
		},
		Others: {
			BedsESP: false,
			DropESP: false,
			PropESP: false,
		},
	},
	Menu: {
		Color: Color3.fromRGB(255, 128, 64),
		BackgroundTransparency: 0,
		Rainbow: false,
		RainbowSpeed: 1,
	},
};

const LocalPlayer = Players.LocalPlayer;
const FOVCircle = new Drawing("Circle");
const Beds = (Workspace.Map.Blocks.GetChildren() as MeshPart[]).filter(
	(block) => block.IsA("MeshPart") && block.Name === "bed",
);

// Variables:
let Bed: MeshPart | undefined;

// Functions:
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ValidCharacter = (Character: Model | undefined): boolean => {
	if (!Character) return false;
	return (
		!!Character.FindFirstChild("HumanoidRootPart") &&
		(Character.FindFirstChildWhichIsA("Humanoid")?.Health ?? 0) > 0
	);
};
const FilterTargets = () => Players.GetPlayers().filter((value) => value.Team !== LocalPlayer.Team);
const GetTarget = (method: "Closest to Cursor" | "Closest to Mouse", useFov: boolean) => {
	for (const Target of FilterTargets()) {
	}
};

// Interface:
const Window = Library.CreateWindow(
	{
		WindowName: "Bedwars",
		Color: Color3.fromRGB(255, 128, 64),
	},
	CoreGui,
);

{
	const Tab = Window.CreateTab("Combat");
	{
		const Section = Tab.CreateSection("Melee Combat");
		const Configs = Configurations.Combat.Melee;

		Section.CreateToggle(
			"Orientation Bot",
			Configs.OrientationBot,
			(value) => (Configs.OrientationBot = value),
		).AddToolTip("Points your character toward the nearest enemy.");
		Section.CreateSlider(
			"Orientation Distance",
			10,
			100,
			Configs.OrientationDistance,
			true,
			(value) => (Configs.OrientationDistance = value),
		).AddToolTip("Maximum Distance before the bot can point your character at enemies.");
		Section.CreateSlider(
			"Direction Offset",
			-180,
			180,
			Configs.DirectionOffset,
			true,
			(value) => (Configs.DirectionOffset = value),
		).AddToolTip("The amount of degrees to offset your character's direction.");
		Section.CreateSlider(
			"Sensitivity",
			0.1,
			0.9,
			Configs.Sensitivity,
			false,
			(value) => (Configs.Sensitivity = value),
		).AddToolTip("The smoothness of the orientation. 0.1 - Most smooth, 0.9 - Least Smooth");
		Section.CreateToggle(
			"Auto Swing",
			Configs.AutomaticSwing,
			(value) => (Configs.AutomaticSwing = value),
		).AddToolTip("Automatically clicks when an enemy is in range.");
		Section.CreateSlider(
			"Swing Distance",
			5,
			50,
			Configs.SwingDistance,
			false,
			(value) => (Configs.SwingDistance = value),
		).AddToolTip("Maximum Distance before the bot can swing your weapon.");
	}
	{
		const Section = Tab.CreateSection("Range Combat");
		const Configs = Configurations.Combat.Range;

		Section.CreateToggle("Silent Aim", Configs.SilentAim, (value) => (Configs.SilentAim = value)).AddToolTip(
			"Aims your bow automatically",
		);

		Section.CreateToggle("FOV Circle", Configs.FOVCircle, (value) => (Configs.FOVCircle = value))
			.AddToolTip(
				"Draws a circle around your mouse, targets within the circle can be aimed at with the silent aim.",
			)
			.CreateKeybind("NONE");

		Section.CreateSlider("FOV Radius", 25, 500, Configs.FOVRadius, true, (value) => {
			Configs.FOVRadius = value;
			FOVCircle.Radius = value;
			FOVCircle.NumSides = math.floor(math.clamp((value * 55) / 100, 10, 75));
		});

		Section.CreateColorpicker("FOV Color", (value) => {
			Configs.FOVColor3 = value;
			FOVCircle.Color = value;
		}).UpdateColor(Configs.FOVColor3);

		Section.CreateToggle("FOV Rainbow", Configs.FOVRainbow, (value) => (Configs.FOVRainbow = value));

		Section.CreateDropdown(
			"Target Selection",
			["Closest to Player", "Closest to Cursor"],
			(value) => (Configs.TargetSelection = value),
			Configs.TargetSelection,
		).AddToolTip("The priority of which the silent aim selects its targets from.");
	}
	{
		const Section = Tab.CreateSection("Sprint");
		const Configs = Configurations.Combat.Sprint;

		Section.CreateToggle("Enabled", Configs.Enabled, (value) => (Configurations.Combat.Sprint.Enabled = value));
		Section.CreateToggle(
			"Always Active",
			Configs.AlwaysActive,
			(value) => (Configurations.Combat.Sprint.AlwaysActive = value),
		);
		Section.CreateToggle(
			"Camera FOV",
			Configs.CameraFOV,
			(value) => (Configurations.Combat.Sprint.CameraFOV = value),
		);
	}
}

{
	const Tab = Window.CreateTab("Base");
	{
		const Section = Tab.CreateSection("Bed");
		const Configs = Configurations.Base.Bed;

		Section.CreateButton("Reset Bed", () => {
			let Distance = Configs.Distance;
			for (const v of Beds) {
				if (v.Name === "bed" && v.IsA("MeshPart")) {
					const magnitude = v.Position.sub(
						(LocalPlayer.Character!.FindFirstChild("HumanoidRootPart") as BasePart).Position,
					).Magnitude;
					if (magnitude <= Distance) {
						Bed = v;
						Distance = magnitude;
					}
				}
			}
			const Visualizer = new Instance("Part");
			Visualizer.Anchored = true;
			Visualizer.CanCollide = false;
			Visualizer.Color = LocalPlayer.TeamColor.Color;
			Visualizer.Transparency = 0.25;
			Visualizer.Shape = Enum.PartType.Cylinder;
			Visualizer.TopSurface = Enum.SurfaceType.Smooth;
			Visualizer.BottomSurface = Enum.SurfaceType.Smooth;
			Visualizer.Size = new Vector3(500, 0.5, 0.5);
			Visualizer.Position = Bed?.Position ?? new Vector3(0, 9e4, 0);
			Visualizer.Orientation = new Vector3(0, 0, 90);

			syn.protect_gui(Visualizer);
			Visualizer.Parent = Workspace;
			TweenService.Create(Visualizer, new TweenInfo(1), {
				Size: new Vector3(500, 25, 25),
				Transparency: 1,
			}).Play();
			Debris.AddItem(Visualizer, 1.25);
		}).AddToolTip("Finds the closest bed to you and sets it as your current bed.");
		Section.CreateToggle("Alarm (Custom)", Configs.Alarm, (value) => (Configs.Alarm = value)).AddToolTip(
			"Custom Bed Alarm that notifies you when someone is approaching your bed.",
		);
		Section.CreateSlider(
			"Alarm Distance",
			50,
			200,
			Configs.Distance,
			true,
			(value) => (Configs.Distance = value),
		).AddToolTip("Maximum Distance for players to trigger the alarm");
		Section.CreateToggle("Callout", Configs.Callout, (value) => (Configs.Callout = value)).AddToolTip(
			"Sends a chat message to alerts others when someone is approaching your bed.",
		);
		Section.CreateTextBox("Callout Message", "Message", false, (value) => (Configs.Message = value))
			.AddToolTip("${name} for player name, ${team} for player team.")
			.SetValue(Configs.Message);
		Section.CreateToggle("Team only?", Configs.TeamOnly, (value) => (Configs.TeamOnly = value)).AddToolTip(
			"Whether callouts will send messages to only your team.",
		);
	}
}

{
	const Tab = Window.CreateTab("Visuals");
	{
		const Section = Tab.CreateSection("Players");
		const Configs = Configurations.Visuals.Players;

		Section.CreateToggle("Nametag", Configs.Nametag, (value) => (Configs.Nametag = value));
		Section.CreateToggle("ESP Box", Configs.ESPBox, (value) => (Configs.ESPBox = value));
		Section.CreateToggle("Tracers", Configs.Tracers, (value) => (Configs.Tracers = value));
		Section.CreateToggle(
			"Ignore Spectators",
			Configs.IgnoreSpectators,
			(value) => (Configs.IgnoreSpectators = value),
		);
	}
	{
		const Section = Tab.CreateSection("Others");
		const Configs = Configurations.Visuals.Others;

		Section.CreateToggle("Beds ESP", Configs.BedsESP, (value) => (Configs.BedsESP = value)).AddToolTip(
			"This shows each teams bed",
		);
		Section.CreateToggle("Drop ESP", Configs.DropESP, (value) => (Configs.DropESP = value)).AddToolTip(
			"This shows dropped items and resources",
		);
		Section.CreateToggle("Prop ESP", Configs.PropESP, (value) => (Configs.PropESP = value)).AddToolTip(
			"This shows certain Kit props",
		);
	}
}

{
	const Tab = Window.CreateTab("Settings");
	{
		const Section = Tab.CreateSection("General");
		Section.CreateButton("Unload Cheats", () => {});
	}
	{
		const Section = Tab.CreateSection("Menu");
		const Configs = Configurations.Menu;

		Section.CreateToggle("Toggle Menu", true, (value) => Window.Toggle(value)).CreateKeybind("LeftAlt");
		Section.CreateColorpicker("Color", (value) => {
			Window.ChangeColor(value);
			Configs.Color = value;
		}).UpdateColor(Configs.Color);
		Section.CreateSlider("Background Transparency", 0, 1, Configs.BackgroundTransparency, false, (value) =>
			Window.SetBackgroundTransparency(value),
		);
		Section.CreateTextBox("Background Texture", "Texture ID", false, (value) => Window.SetBackground(value));

		Section.CreateToggle("Rainbow", Configs.Rainbow, (value) => {
			Configs.Rainbow = value;
			!value && Window.ChangeColor(Configs.Color);
		});
		Section.CreateSlider(
			"Rainbow Speed",
			1,
			5,
			Configs.RainbowSpeed,
			true,
			(value) => (Configs.RainbowSpeed = value),
		);
	}
}

// Listeners:
RunService.Stepped.Connect((dt) => {
	{
		// Melee Combat:
		const Configs = Configurations.Combat.Melee;
		const Character = LocalPlayer.Character;
		if (Character && ValidCharacter(Character)) {
			const Humanoid = Character.FindFirstChild("Humanoid") as Humanoid;
			const HumanoidRootPart = Character.FindFirstChild("HumanoidRootPart") as BasePart;
			if (Configs.OrientationBot && UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton3)) {
				const [Target, Distance, Position] = (() => {
					let Target: (Player & { Character: Model & { HumanoidRootPart: BasePart } }) | undefined;
					let Distance: number = Configs.OrientationDistance;
					let TargetPosition: Vector3 = new Vector3();
					for (const v of FilterTargets()) {
						const Character = v.Character;
						if (ValidCharacter(Character)) {
							const Position = (Character!.FindFirstChild("HumanoidRootPart") as BasePart).Position;
							const Magnitude = HumanoidRootPart.Position.sub(
								new Vector3(Position.X, HumanoidRootPart.Position.Y, Position.Z),
							).Magnitude;
							if (Magnitude <= Distance && math.abs(HumanoidRootPart.Position.Y - Position.Y) <= 40) {
								Target = v as Player & { Character: Model & { HumanoidRootPart: BasePart } };
								Distance = Magnitude;
								TargetPosition = Position;
							}
						}
					}
					return [Target, Distance, TargetPosition] as LuaTuple<[Player | undefined, number, Vector3]>;
				})();
				if (Target !== undefined) {
					Humanoid.AutoRotate = false;
					HumanoidRootPart.CFrame = HumanoidRootPart.CFrame.Lerp(
						new CFrame(
							HumanoidRootPart.Position,
							new Vector3(Position.X, HumanoidRootPart.Position.Y, Position.Z),
						).mul(CFrame.Angles(0, math.rad(Configs.DirectionOffset), 0)),
						Configs.Sensitivity,
					);
					if (Configs.AutomaticSwing && Distance <= Configs.SwingDistance) {
						mouse1click();
					}
				} else {
					Humanoid.AutoRotate = true;
				}
			} else {
				Humanoid.AutoRotate = true;
			}
		}
	}
	{
		// Sprint:
		const Configs = Configurations.Combat.Sprint;
		if (Configs.Enabled) {
			const Character = LocalPlayer.Character;
			if (Character && ValidCharacter(Character)) {
				const Camera = Workspace.CurrentCamera as Camera;
				const Humanoid = Character.FindFirstChildWhichIsA("Humanoid") as Humanoid;
				if (Configs.AlwaysActive) {
					Humanoid.WalkSpeed = lerp(Humanoid.WalkSpeed, 21, 0.5);
					if (Configs.CameraFOV)
						Camera.FieldOfView = lerp(Camera.FieldOfView, Configs.CameraFOV ? 77 : 70, 0.2);
				} else if (Humanoid.MoveDirection.Magnitude > 0.5) {
					Humanoid.WalkSpeed = lerp(Humanoid.WalkSpeed, 21, 0.5);
					Camera.FieldOfView = lerp(Camera.FieldOfView, Configs.CameraFOV ? 77 : 70, 0.2);
				} else {
					Humanoid.WalkSpeed = lerp(Humanoid.WalkSpeed, 14, 0.5);
					Camera.FieldOfView = lerp(Camera.FieldOfView, 70, 0.2);
				}
			}
		}
	}
});

let LastIntruded = os.clock();
let Intruded = false;
RunService.Heartbeat.Connect((dt) => {
	{
		// Bed Alarm:
		const Configs = Configurations.Base.Bed;
		if (Configs.Alarm && Bed && Bed.IsDescendantOf(Workspace) && os.clock() - LastIntruded > 15) {
			let Intruder: Player | undefined;
			let Distance = Configs.Distance;
			for (const v of FilterTargets()) {
				const Character = v.Character;
				if (Character && ValidCharacter(Character)) {
					const HumanoidRootPart = Character.FindFirstChild("HumanoidRootPart") as BasePart;
					if (HumanoidRootPart) {
						const Magnitude = HumanoidRootPart.Position.sub(Bed.Position).Magnitude;
						if (Magnitude < Distance) {
							Intruder = v;
							Distance = Magnitude;
						}
					}
				}
			}
			if (!Intruded && Intruder) {
				StarterGui.SetCore("SendNotification", {
					Title: "Bed Alarm",
					Text: `${Intruder.DisplayName} is near bed.`,
					Duration: 5,
				});
				if (Configs.Callout) {
					ReplicatedStorage.DefaultChatSystemChatEvents.SayMessageRequest.FireServer(
						Configs.Message.gsub("${name}", Intruder.DisplayName)[0].gsub(
							"${team}",
							Intruder.Team?.Name ?? "",
						)[0],
						Configs.TeamOnly ? "Team" : "All",
					);
				}
				LastIntruded = os.clock();
			}
			Intruded = !!Intruder;
		}
	}
});

const DropESPs: BasePart[] = [];
RunService.RenderStepped.Connect((dt) => {
	{
		// Ranged Combat:
		const Configs = Configurations.Combat.Range;
		if (Configs.FOVCircle) {
			FOVCircle.Position = UserInputService.GetMouseLocation();
			FOVCircle.Color = Configs.FOVRainbow ? Color3.fromHSV((time() % 10) / 10, 1, 1) : Configs.FOVColor3;
		}
		FOVCircle.Visible = Configs.FOVCircle;
	}
	{
		// Player ESP:
		const Configs = Configurations.Visuals.Players;
		Players.GetPlayers().forEach((player) => {
			if (player === LocalPlayer) return;
			const Character = player.Character;
			if ((Configs.IgnoreSpectators || player.Team?.Name !== "Spectators") && ValidCharacter(Character)) {
				if (Configs.Nametag) {
					if (!Nametag.Instances.has(player)) new Nametag(player);
				} else Nametag.Instances.get(player)?.Destroy();
				if (Configs.ESPBox) {
					if (!ESPBox.Instances.has(player)) new ESPBox(player);
				} else ESPBox.Instances.get(player)?.Destroy();
				if (Configs.Tracers) {
					if (!Tracer.Instances.has(player)) new Tracer(player);
				} else Tracer.Instances.get(player)?.Destroy();
			} else {
				Nametag.Instances.get(player)?.Destroy();
				ESPBox.Instances.get(player)?.Destroy();
				Tracer.Instances.get(player)?.Destroy();
			}
		});
	}
	{
		// Other ESP:
		const Configs = Configurations.Visuals.Others;

		if (Configs.BedsESP) {
			for (const bed of Beds) {
				const Covers = bed.FindFirstChild("Covers") as BasePart | undefined;
				if (!Covers) {
					Beds.remove(Beds.indexOf(bed));
					continue;
				}
				if (!PartAdornment.Instances.has(Covers)) new PartAdornment(Covers, Covers.Color);
			}
		} else for (const bed of Beds) PartAdornment.Instances.get(bed.FindFirstChild("Covers") as BasePart)?.Destroy();

		if (Configs.DropESP) {
			for (const v of Workspace.ItemDrops.GetChildren()) {
				if (v.IsA("BasePart")) {
					const name = v.Name as "iron" | "diamond" | "emerald";
					let Color: Color3;
					switch (name) {
						case "iron":
							Color = new Color3(1, 1, 1);
							break;
						case "diamond":
							Color = new Color3(0, 0, 1);
							break;
						case "emerald":
							Color = new Color3(0, 1, 0);
							break;
						default:
							Color = new Color3(0.5, 0.5, 0.5);
							break;
					}
					if (!PartAdornment.Instances.has(v)) new PartAdornment(v, Color) && DropESPs.push(v);
				}
			}
		} else {
			DropESPs.forEach((value, key, instances) => value.Destroy());
		}

		if (Configs.PropESP) {
		}
	}

	{
		// Interface:
		const Configs = Configurations.Menu;
		if (Configs.Rainbow) {
			const Speed = 10 / Configs.RainbowSpeed;
			Window.ChangeColor(Color3.fromHSV((time() % Speed) / Speed, 1, 1));
		}
	}
});

// Actions:
Window.Toggle(true);
FOVCircle.Thickness = 1;

{
	let Distance = math.huge;
	for (const v of Beds) {
		if (v.Name === "bed" && v.IsA("MeshPart")) {
			const magnitude = v.Position.sub(
				(LocalPlayer.Character!.FindFirstChild("HumanoidRootPart") as BasePart).Position,
			).Magnitude;
			if (magnitude <= Distance) {
				Bed = v;
				Distance = magnitude;
			}
		}
	}
}
