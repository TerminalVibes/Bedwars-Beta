-- Compiled with roblox-ts v1.2.7
local CoreGui = game:GetService("CoreGui")
local Debris = game:GetService("Debris")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local StarterGui = game:GetService("StarterGui")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local Workspace = game:GetService("Workspace")
-- Libraries:
local Bin
do
	Bin = setmetatable({}, {
		__tostring = function()
			return "Bin"
		end,
	})
	Bin.__index = Bin
	function Bin.new(...)
		local self = setmetatable({}, Bin)
		return self:constructor(...) or self
	end
	function Bin:constructor()
	end
	function Bin:add(item, isDrawing)
		if isDrawing == nil then
			isDrawing = false
		end
		local node = {
			item = item,
			isDrawing = isDrawing,
		}
		if self.head == nil then
			self.head = node
		end
		if self.tail then
			self.tail.next = node
		end
		self.tail = node
		return item
	end
	function Bin:destroy()
		while self.head do
			local item = self.head.item
			if type(item) == "function" then
				item()
			elseif self.head.isDrawing then
				item:Remove()
			elseif typeof(item) == "RBXScriptConnection" then
				item:Disconnect()
			elseif item.destroy ~= nil then
				item:destroy()
			elseif item.Destroy ~= nil then
				item:Destroy()
			end
			self.head = self.head.next
		end
	end
	function Bin:isEmpty()
		return self.head == nil
	end
end
local Nametag
do
	Nametag = setmetatable({}, {
		__tostring = function()
			return "Nametag"
		end,
	})
	Nametag.__index = Nametag
	function Nametag.new(...)
		local self = setmetatable({}, Nametag)
		return self:constructor(...) or self
	end
	function Nametag:constructor(Player)
		self.Player = Player
		self.Bin = Bin.new()
		self.TextLabel = self.Bin:add(Drawing.new("Text"), true)
		local _instances = Nametag.Instances
		local _self = self
		-- ▼ Map.set ▼
		_instances[Player] = _self
		-- ▲ Map.set ▲
		self.TextLabel.Text = Player.DisplayName
		self.TextLabel.Font = Drawing.Fonts.System
		self.TextLabel.Size = 18
		self.TextLabel.Center = true
		self.TextLabel.Outline = true
		self.TextLabel.OutlineColor = Color3.new(0.1, 0.1, 0.1)
		self.TextLabel.Color = Player.TeamColor.Color
		self.TextLabel.Transparency = 0.85
		self.Bin:add(RunService.RenderStepped:Connect(function()
			return self:update()
		end))
	end
	function Nametag:update()
		local Player = self.Player
		local Character = Player.Character
		local Camera = Workspace.CurrentCamera
		if Character and Camera then
			local Head = Character:FindFirstChild("Head")
			local HumanoidRootPart = Character:FindFirstChild("HumanoidRootPart")
			if Head and HumanoidRootPart then
				local _fn = Camera
				local _cFrame = HumanoidRootPart.CFrame
				local _cFrame_1 = CFrame.new(0, Head.Size.Y + HumanoidRootPart.Size.Y, 0)
				local Position = _fn:WorldToViewportPoint((_cFrame * _cFrame_1).Position)
				if Position.Z > 0 then
					local _vector2 = Vector2.new(Position.X, Position.Y)
					local _vector2_1 = Vector2.new(0, self.TextLabel.TextBounds.Y)
					self.TextLabel.Position = _vector2 - _vector2_1
					self.TextLabel.Visible = true
				else
					self.TextLabel.Visible = false
				end
			else
				self.TextLabel.Visible = false
			end
		else
			self.TextLabel.Visible = false
		end
	end
	function Nametag:Destroy()
		local _instances = Nametag.Instances
		local _player = self.Player
		-- ▼ Map.delete ▼
		_instances[_player] = nil
		-- ▲ Map.delete ▲
		self.Bin:destroy()
	end
	Nametag.Instances = {}
end
local ESPBox
do
	ESPBox = setmetatable({}, {
		__tostring = function()
			return "ESPBox"
		end,
	})
	ESPBox.__index = ESPBox
	function ESPBox.new(...)
		local self = setmetatable({}, ESPBox)
		return self:constructor(...) or self
	end
	function ESPBox:constructor(Player)
		self.Player = Player
		self.Bin = Bin.new()
		self.library = {
			TLX = Drawing.new("Line"),
			TLY = Drawing.new("Line"),
			TRX = Drawing.new("Line"),
			TRY = Drawing.new("Line"),
			BLX = Drawing.new("Line"),
			BLY = Drawing.new("Line"),
			BRX = Drawing.new("Line"),
			BRY = Drawing.new("Line"),
		}
		local _instances = ESPBox.Instances
		local _self = self
		-- ▼ Map.set ▼
		_instances[Player] = _self
		-- ▲ Map.set ▲
		for _, v in pairs(self.library) do
			v.Color = Player.TeamColor.Color
			v.Transparency = 1
			self.Bin:add(v, true)
		end
		self.Bin:add(RunService.RenderStepped:Connect(function()
			return self:update()
		end))
	end
	function ESPBox:update()
		local library = self.library
		local Player = self.Player
		local Character = Player.Character
		local Camera = Workspace.CurrentCamera
		if Character and Camera then
			local HumanoidRootPart = Character:FindFirstChild("HumanoidRootPart")
			if HumanoidRootPart then
				local _size = HumanoidRootPart.Size
				local _vector3 = Vector3.new(1.25, 1.5, 1)
				local Size = _size * _vector3
				local Root = HumanoidRootPart.CFrame
				local ScreenPosition, OnScreen = Camera:WorldToViewportPoint(HumanoidRootPart.Position)
				if OnScreen then
					local _fn = Camera
					local _cFrame = CFrame.new(Size.X, Size.Y, 0)
					local TL = _fn:WorldToViewportPoint((Root * _cFrame).Position)
					local _fn_1 = Camera
					local _cFrame_1 = CFrame.new(Size.X * 0.5, Size.Y, 0)
					local TLX = _fn_1:WorldToViewportPoint((Root * _cFrame_1).Position)
					local _fn_2 = Camera
					local _cFrame_2 = CFrame.new(Size.X, Size.Y * 0.5, 0)
					local TLY = _fn_2:WorldToViewportPoint((Root * _cFrame_2).Position)
					local _fn_3 = Camera
					local _cFrame_3 = CFrame.new(-Size.X, Size.Y, 0)
					local TR = _fn_3:WorldToViewportPoint((Root * _cFrame_3).Position)
					local _fn_4 = Camera
					local _cFrame_4 = CFrame.new(-Size.X * 0.5, Size.Y, 0)
					local TRX = _fn_4:WorldToViewportPoint((Root * _cFrame_4).Position)
					local _fn_5 = Camera
					local _cFrame_5 = CFrame.new(-Size.X, Size.Y * 0.5, 0)
					local TRY = _fn_5:WorldToViewportPoint((Root * _cFrame_5).Position)
					local _fn_6 = Camera
					local _cFrame_6 = CFrame.new(Size.X, -Size.Y, 0)
					local BL = _fn_6:WorldToViewportPoint((Root * _cFrame_6).Position)
					local _fn_7 = Camera
					local _cFrame_7 = CFrame.new(Size.X * 0.5, -Size.Y, 0)
					local BLX = _fn_7:WorldToViewportPoint((Root * _cFrame_7).Position)
					local _fn_8 = Camera
					local _cFrame_8 = CFrame.new(Size.X, -Size.Y * 0.5, 0)
					local BLY = _fn_8:WorldToViewportPoint((Root * _cFrame_8).Position)
					local _fn_9 = Camera
					local _cFrame_9 = CFrame.new(-Size.X, -Size.Y, 0)
					local BR = _fn_9:WorldToViewportPoint((Root * _cFrame_9).Position)
					local _fn_10 = Camera
					local _cFrame_10 = CFrame.new(-Size.X * 0.5, -Size.Y, 0)
					local BRX = _fn_10:WorldToViewportPoint((Root * _cFrame_10).Position)
					local _fn_11 = Camera
					local _cFrame_11 = CFrame.new(-Size.X, -Size.Y * 0.5, 0)
					local BRY = _fn_11:WorldToViewportPoint((Root * _cFrame_11).Position)
					library.TLX.From = Vector2.new(TL.X, TL.Y)
					library.TLX.To = Vector2.new(TLX.X, TLX.Y)
					library.TLY.From = Vector2.new(TL.X, TL.Y)
					library.TLY.To = Vector2.new(TLY.X, TLY.Y)
					library.TRX.From = Vector2.new(TR.X, TR.Y)
					library.TRX.To = Vector2.new(TRX.X, TRX.Y)
					library.TRY.From = Vector2.new(TR.X, TR.Y)
					library.TRY.To = Vector2.new(TRY.X, TRY.Y)
					library.BLX.From = Vector2.new(BL.X, BL.Y)
					library.BLX.To = Vector2.new(BLX.X, BLX.Y)
					library.BLY.From = Vector2.new(BL.X, BL.Y)
					library.BLY.To = Vector2.new(BLY.X, BLY.Y)
					library.BRX.From = Vector2.new(BR.X, BR.Y)
					library.BRX.To = Vector2.new(BRX.X, BRX.Y)
					library.BRY.From = Vector2.new(BR.X, BR.Y)
					library.BRY.To = Vector2.new(BRY.X, BRY.Y)
					local Thickness = math.clamp(100 / ScreenPosition.Z, 1, 4)
					for _, v in pairs(library) do
						v.Thickness = Thickness
						v.Visible = true
					end
				else
					for _, v in pairs(library) do
						v.Visible = false
					end
				end
			else
				for _, v in pairs(library) do
					v.Visible = false
				end
			end
		else
			for _, v in pairs(library) do
				v.Visible = false
			end
		end
	end
	function ESPBox:Destroy()
		local _instances = ESPBox.Instances
		local _player = self.Player
		-- ▼ Map.delete ▼
		_instances[_player] = nil
		-- ▲ Map.delete ▲
		self.Bin:destroy()
	end
	ESPBox.Instances = {}
end
local Tracer
do
	Tracer = setmetatable({}, {
		__tostring = function()
			return "Tracer"
		end,
	})
	Tracer.__index = Tracer
	function Tracer.new(...)
		local self = setmetatable({}, Tracer)
		return self:constructor(...) or self
	end
	function Tracer:constructor(Player)
		self.Player = Player
		self.Bin = Bin.new()
		self.Line = self.Bin:add(Drawing.new("Line"), true)
		local _instances = Tracer.Instances
		local _self = self
		-- ▼ Map.set ▼
		_instances[Player] = _self
		-- ▲ Map.set ▲
		self.Line.Color = self.Player.TeamColor.Color
		self.Line.Transparency = 1
		self.Line.Thickness = 2
		self.Bin:add(RunService.RenderStepped:Connect(function()
			return self:update()
		end))
	end
	function Tracer:update()
		local Camera = Workspace.CurrentCamera
		local Character = self.Player.Character
		if Camera and Character then
			local Humanoid = Character:FindFirstChildWhichIsA("Humanoid")
			local HumanoidRootPart = Character:FindFirstChild("HumanoidRootPart")
			if HumanoidRootPart and (Humanoid and Humanoid.Health > 0) then
				local CameraCFrame = Camera.CFrame
				local MousePosition = UserInputService:GetMouseLocation()
				local ObjectPosition = CameraCFrame:PointToObjectSpace(HumanoidRootPart.Position)
				local ScreenPosition = Camera:WorldToViewportPoint(HumanoidRootPart.Position)
				local TracerPosition = Camera:WorldToViewportPoint(CameraCFrame:PointToWorldSpace(ScreenPosition.Z < 0 and CFrame.Angles(0, 0, math.atan2(ObjectPosition.Y, ObjectPosition.X) + math.pi):VectorToWorldSpace(CFrame.Angles(0, math.rad(89.9), 0):VectorToWorldSpace(Vector3.new(0, 0, -1))) or ObjectPosition))
				local _arg0 = (Vector2.new(TracerPosition.X, TracerPosition.Y) - MousePosition).Unit * 10
				self.Line.From = MousePosition + _arg0
				self.Line.To = Vector2.new(TracerPosition.X, TracerPosition.Y)
				self.Line.Transparency = math.clamp(ScreenPosition.Z / 200, 0.4, 0.8)
				self.Line.Visible = true
			else
				self.Line.Visible = false
			end
		else
			self.Line.Visible = false
		end
	end
	function Tracer:Destroy()
		local _instances = Tracer.Instances
		local _player = self.Player
		-- ▼ Map.delete ▼
		_instances[_player] = nil
		-- ▲ Map.delete ▲
		self.Bin:destroy()
	end
	Tracer.Instances = {}
end
local Radar
do
	Radar = setmetatable({}, {
		__tostring = function()
			return "Radar"
		end,
	})
	Radar.__index = Radar
	function Radar.new(...)
		local self = setmetatable({}, Radar)
		return self:constructor(...) or self
	end
	function Radar:constructor(Position, Radius, Adornee)
		if Position == nil then
			Position = Vector2.new(200, 200)
		end
		if Radius == nil then
			Radius = 100
		end
		self.Position = Position
		self.Radius = Radius
		self.Adornee = Adornee
		self.Bin = Bin.new()
		local _class
		do
			_class = setmetatable({}, {
				__tostring = function()
					return "Anonymous"
				end,
			})
			_class.__index = _class
			function _class.new(...)
				local self = setmetatable({}, _class)
				return self:constructor(...) or self
			end
			function _class:constructor(Adornee, Color, Parent)
				if Color == nil then
					Color = Color3.fromRGB(60, 170, 255)
				end
				self.Adornee = Adornee
				self.Parent = Parent
				self.Bin = Bin.new()
				self.Dot = self:CreateCircle({
					Transparency = 1,
					Color = Color,
					Radius = 3,
					Filled = true,
					Thickness = 1,
				})
				Parent.Bin:add(self.Bin)
				self.Bin:add(RunService.RenderStepped:Connect(function()
					local Position = type(Adornee) == "function" and Adornee() or Adornee:IsDescendantOf(game) and Adornee.Position
					if Position then
						local Relative = self:GetRelative()
						local NewPosition = Parent.Position - Relative
					else
						self.Bin:destroy()
					end
				end))
			end
			function _class:Destroy()
				self.Bin:destroy()
			end
			function _class:GetRelative()
				local Camera = Workspace.CurrentCamera
				if Camera then
					local Adornee = self.Parent.Adornee
					local Position = typeof(Adornee) == "Instance" and (Adornee:IsA("Player") and (Adornee.Character:FindFirstChild("HumanoidRootPart")) or Adornee).Position or Adornee()
					local OrientatedCFrame = CFrame.new(Position, Camera.CFrame.Position)
					local _fn = OrientatedCFrame
					local _adornee = self.Adornee
					local ObjectSpace = _fn:PointToObjectSpace(type(_adornee) == "function" and self.Adornee() or self.Adornee.Position)
					return Vector2.new(ObjectSpace.X, ObjectSpace.Z)
				end
				return Vector2.new(0, 0)
			end
			function _class:CreateCircle(properties)
				local _binding = properties
				local Transparency = _binding.Transparency
				if Transparency == nil then
					Transparency = 1
				end
				local Color = _binding.Color
				if Color == nil then
					Color = Color3.new(1, 1, 1)
				end
				local Visible = _binding.Visible
				if Visible == nil then
					Visible = false
				end
				local Thickness = _binding.Thickness
				if Thickness == nil then
					Thickness = 1
				end
				local Position = _binding.Position
				if Position == nil then
					Position = Vector2.new(0, 0)
				end
				local Radius = _binding.Radius
				if Radius == nil then
					Radius = 100
				end
				local Filled = _binding.Filled
				if Filled == nil then
					Filled = false
				end
				local Circle = Drawing.new("Circle")
				Circle.Transparency = Transparency
				Circle.Color = Color
				Circle.Visible = Visible
				Circle.Thickness = Thickness
				Circle.Position = Position
				Circle.Radius = Radius
				Circle.NumSides = math.clamp((Radius * 55) / 100, 10, 75)
				Circle.Filled = Filled
				self.Bin:add(Circle, true)
				return Circle
			end
		end
		self.RadarDot = _class
		self.Cursor = self:CreateCircle({
			Transparency = 1,
			Color = Color3.new(1, 1, 1),
			Radius = 3,
			Filled = true,
			Thickness = 1,
		})
		self.Border = self:CreateCircle({
			Transparency = 0.75,
			Color = Color3.new(0.3, 0.3, 0.3),
			Radius = self.Radius,
			Filled = false,
			Visible = true,
			Thickness = 3,
			Position = self.Position,
		})
		self.Background = self:CreateCircle({
			Transparency = 0.9,
			Color = Color3.new(0.04, 0.04, 0.04),
			Radius = self.Radius,
			Filled = true,
			Visible = true,
			Thickness = 1,
			Position = self.Position,
		})
		self.Origin = self.Bin:add(Drawing.new("Triangle"), true)
		self.Origin.Visible = true
		self.Origin.Thickness = 1
		self.Origin.Filled = true
		self.Origin.Color = Color3.fromRGB(255, 255, 255)
		local _position = self.Position
		local _vector2 = Vector2.new(0, -4)
		self.Origin.PointA = _position + _vector2
		local _position_1 = self.Position
		local _vector2_1 = Vector2.new(-3, 4)
		self.Origin.PointB = _position_1 + _vector2_1
		local _position_2 = self.Position
		local _vector2_2 = Vector2.new(3, 4)
		self.Origin.PointC = _position_2 + _vector2_2
		task.defer(function()
			local Dragging = false
			local Offset = Vector2.new(0, 0)
			Dragging = false
			Offset = Vector2.new(0, 0)
			self.Bin:add(UserInputService.InputBegan:Connect(function(input)
				local _condition = input.UserInputType == Enum.UserInputType.MouseButton1
				if _condition then
					local _vector2_3 = Vector2.new(input.Position.X, input.Position.Y)
					local _position_3 = self.Position
					_condition = (_vector2_3 - _position_3).Magnitude <= self.Radius
				end
				if _condition then
					local _position_3 = self.Position
					local _vector2_3 = Vector2.new(input.Position.X, input.Position.Y)
					Offset = _position_3 - _vector2_3
					Dragging = true
				end
			end))
			self.Bin:add(UserInputService.InputEnded:Connect(function(input)
				if input.UserInputType == Enum.UserInputType.MouseButton1 then
					Dragging = false
				end
			end))
			self.Bin:add(RunService.RenderStepped:Connect(function()
				local mousePosition = UserInputService:GetMouseLocation()
				local _position_3 = self.Position
				if (mousePosition - _position_3).Magnitude <= self.Radius then
					self.Cursor.Visible = true
					self.Cursor.Position = mousePosition
				else
					self.Cursor.Visible = false
				end
				if Dragging then
					local _fn = self.Position
					local _vector2_3 = Vector2.new(mousePosition.X, mousePosition.Y - 36)
					local _offset = Offset
					self.Position = _fn:Lerp(_vector2_3 + _offset, 0.2)
					local _position_4 = self.Position
					local _vector2_4 = Vector2.new(0, -4)
					self.Origin.PointA = _position_4 + _vector2_4
					local _position_5 = self.Position
					local _vector2_5 = Vector2.new(-3, 4)
					self.Origin.PointB = _position_5 + _vector2_5
					local _position_6 = self.Position
					local _vector2_6 = Vector2.new(3, 4)
					self.Origin.PointC = _position_6 + _vector2_6
					self.Border.Position = self.Position
					self.Background.Position = self.Position
				end
			end))
		end)
	end
	function Radar:Destroy()
		self.Bin:destroy()
	end
	function Radar:CreateCircle(properties)
		local _binding = properties
		local Transparency = _binding.Transparency
		if Transparency == nil then
			Transparency = 1
		end
		local Color = _binding.Color
		if Color == nil then
			Color = Color3.new(1, 1, 1)
		end
		local Visible = _binding.Visible
		if Visible == nil then
			Visible = false
		end
		local Thickness = _binding.Thickness
		if Thickness == nil then
			Thickness = 1
		end
		local Position = _binding.Position
		if Position == nil then
			Position = Vector2.new(0, 0)
		end
		local Radius = _binding.Radius
		if Radius == nil then
			Radius = 100
		end
		local Filled = _binding.Filled
		if Filled == nil then
			Filled = false
		end
		local Circle = Drawing.new("Circle")
		Circle.Transparency = Transparency
		Circle.Color = Color
		Circle.Visible = Visible
		Circle.Thickness = Thickness
		Circle.Position = Position
		Circle.Radius = Radius
		Circle.NumSides = math.clamp((Radius * 55) / 100, 10, 75)
		Circle.Filled = Filled
		self.Bin:add(Circle, true)
		return Circle
	end
end
local PartAdornment
do
	PartAdornment = setmetatable({}, {
		__tostring = function()
			return "PartAdornment"
		end,
	})
	PartAdornment.__index = PartAdornment
	function PartAdornment.new(...)
		local self = setmetatable({}, PartAdornment)
		return self:constructor(...) or self
	end
	function PartAdornment:constructor(Part, Color)
		self.Part = Part
		self.Bin = Bin.new()
		local _instances = PartAdornment.Instances
		local _self = self
		-- ▼ Map.set ▼
		_instances[Part] = _self
		-- ▲ Map.set ▲
		local Adornment = self.Bin:add(Instance.new("BoxHandleAdornment"))
		Adornment.Name = "BoxHandleAdornment"
		Adornment.Color3 = Color
		Adornment.Transparency = 0.75
		Adornment.AlwaysOnTop = true
		Adornment.ZIndex = 5
		Adornment.Adornee = Part
		local _size = Part.Size
		local _vector3 = Vector3.new(0.05, 0.05, 0.05)
		Adornment.Size = _size + _vector3
		syn.protect_gui(Adornment)
		Adornment.Parent = Part
		self.Bin:add(Part.AncestryChanged:Connect(function()
			return self:Destroy()
		end))
	end
	function PartAdornment:Destroy()
		local _instances = PartAdornment.Instances
		local _part = self.Part
		-- ▼ Map.delete ▼
		_instances[_part] = nil
		-- ▲ Map.delete ▲
		self.Bin:destroy()
	end
	PartAdornment.Instances = {}
end
-- Constants:
local Library = loadstring(game:HttpGet("https://raw.githubusercontent.com/OminousVibes-Exploit/Quality-Interfaces/main/Bracket-v3.lua"))()
local Configurations = {
	Combat = {
		Melee = {
			OrientationBot = false,
			DirectionOffset = 30,
			Sensitivity = 0.5,
			AutomaticSwing = false,
			OrientationDistance = 30,
			SwingDistance = 15,
		},
		Range = {
			SilentAim = false,
			FOVCircle = false,
			FOVRadius = 250,
			FOVColor3 = Color3.fromRGB(255, 255, 255),
			FOVRainbow = false,
			TargetSelection = "Closest to Cursor",
		},
		Sprint = {
			Enabled = false,
			AlwaysActive = false,
			CameraFOV = true,
		},
	},
	Base = {
		Bed = {
			Alarm = true,
			Distance = 100,
			Callout = false,
			Message = "${team} is near bed",
			TeamOnly = true,
		},
	},
	Visuals = {
		Players = {
			Nametag = false,
			ESPBox = false,
			Tracers = false,
			IgnoreSpectators = false,
		},
		Others = {
			BedsESP = false,
			DropESP = false,
			PropESP = false,
		},
	},
	Menu = {
		Color = Color3.fromRGB(255, 128, 64),
		BackgroundTransparency = 0,
		Rainbow = false,
		RainbowSpeed = 1,
	},
}
local LocalPlayer = Players.LocalPlayer
local FOVCircle = Drawing.new("Circle")
local _exp = (Workspace.Map.Blocks:GetChildren())
local _arg0 = function(block)
	return block:IsA("MeshPart") and block.Name == "bed"
end
-- ▼ ReadonlyArray.filter ▼
local _newValue = {}
local _length = 0
for _k, _v in ipairs(_exp) do
	if _arg0(_v, _k - 1, _exp) == true then
		_length += 1
		_newValue[_length] = _v
	end
end
-- ▲ ReadonlyArray.filter ▲
local Beds = _newValue
-- Variables:
local Bed
-- Functions:
local lerp = function(a, b, t)
	return a + (b - a) * t
end
local ValidCharacter = function(Character)
	if not Character then
		return false
	end
	local _condition = not not Character:FindFirstChild("HumanoidRootPart")
	if _condition then
		local _result = Character:FindFirstChildWhichIsA("Humanoid")
		if _result ~= nil then
			_result = _result.Health
		end
		local _condition_1 = _result
		if _condition_1 == nil then
			_condition_1 = 0
		end
		_condition = _condition_1 > 0
	end
	return _condition
end
local FilterTargets = function()
	local _exp_1 = Players:GetPlayers()
	local _arg0_1 = function(value)
		return value.Team ~= LocalPlayer.Team
	end
	-- ▼ ReadonlyArray.filter ▼
	local _newValue_1 = {}
	local _length_1 = 0
	for _k, _v in ipairs(_exp_1) do
		if _arg0_1(_v, _k - 1, _exp_1) == true then
			_length_1 += 1
			_newValue_1[_length_1] = _v
		end
	end
	-- ▲ ReadonlyArray.filter ▲
	return _newValue_1
end
local GetTarget = function(method, useFov)
	for _, Target in ipairs(FilterTargets()) do
	end
end
-- Interface:
local Window = Library:CreateWindow({
	WindowName = "Bedwars",
	Color = Color3.fromRGB(255, 128, 64),
}, CoreGui)
do
	local Tab = Window:CreateTab("Combat")
	do
		local Section = Tab:CreateSection("Melee Combat")
		local Configs = Configurations.Combat.Melee
		Section:CreateToggle("Orientation Bot", Configs.OrientationBot, function(value)
			Configs.OrientationBot = value
			return Configs.OrientationBot
		end):AddToolTip("Points your character toward the nearest enemy.")
		Section:CreateSlider("Orientation Distance", 10, 100, Configs.OrientationDistance, true, function(value)
			Configs.OrientationDistance = value
			return Configs.OrientationDistance
		end):AddToolTip("Maximum Distance before the bot can point your character at enemies.")
		Section:CreateSlider("Direction Offset", -180, 180, Configs.DirectionOffset, true, function(value)
			Configs.DirectionOffset = value
			return Configs.DirectionOffset
		end):AddToolTip("The amount of degrees to offset your character's direction.")
		Section:CreateSlider("Sensitivity", 0.1, 0.9, Configs.Sensitivity, false, function(value)
			Configs.Sensitivity = value
			return Configs.Sensitivity
		end):AddToolTip("The smoothness of the orientation. 0.1 - Most smooth, 0.9 - Least Smooth")
		Section:CreateToggle("Auto Swing", Configs.AutomaticSwing, function(value)
			Configs.AutomaticSwing = value
			return Configs.AutomaticSwing
		end):AddToolTip("Automatically clicks when an enemy is in range.")
		Section:CreateSlider("Swing Distance", 5, 50, Configs.SwingDistance, false, function(value)
			Configs.SwingDistance = value
			return Configs.SwingDistance
		end):AddToolTip("Maximum Distance before the bot can swing your weapon.")
	end
	do
		local Section = Tab:CreateSection("Range Combat")
		local Configs = Configurations.Combat.Range
		Section:CreateToggle("Silent Aim", Configs.SilentAim, function(value)
			Configs.SilentAim = value
			return Configs.SilentAim
		end):AddToolTip("Aims your bow automatically")
		Section:CreateToggle("FOV Circle", Configs.FOVCircle, function(value)
			Configs.FOVCircle = value
			return Configs.FOVCircle
		end):AddToolTip("Draws a circle around your mouse, targets within the circle can be aimed at with the silent aim."):CreateKeybind("NONE")
		Section:CreateSlider("FOV Radius", 25, 500, Configs.FOVRadius, true, function(value)
			Configs.FOVRadius = value
			FOVCircle.Radius = value
			FOVCircle.NumSides = math.floor(math.clamp((value * 55) / 100, 10, 75))
		end)
		Section:CreateColorpicker("FOV Color", function(value)
			Configs.FOVColor3 = value
			FOVCircle.Color = value
		end):UpdateColor(Configs.FOVColor3)
		Section:CreateToggle("FOV Rainbow", Configs.FOVRainbow, function(value)
			Configs.FOVRainbow = value
			return Configs.FOVRainbow
		end)
		Section:CreateDropdown("Target Selection", { "Closest to Player", "Closest to Cursor" }, function(value)
			Configs.TargetSelection = value
			return Configs.TargetSelection
		end, Configs.TargetSelection):AddToolTip("The priority of which the silent aim selects its targets from.")
	end
	do
		local Section = Tab:CreateSection("Sprint")
		local Configs = Configurations.Combat.Sprint
		Section:CreateToggle("Enabled", Configs.Enabled, function(value)
			local _exp_1 = Configurations.Combat.Sprint
			_exp_1.Enabled = value
			return _exp_1.Enabled
		end)
		Section:CreateToggle("Always Active", Configs.AlwaysActive, function(value)
			local _exp_1 = Configurations.Combat.Sprint
			_exp_1.AlwaysActive = value
			return _exp_1.AlwaysActive
		end)
		Section:CreateToggle("Camera FOV", Configs.CameraFOV, function(value)
			local _exp_1 = Configurations.Combat.Sprint
			_exp_1.CameraFOV = value
			return _exp_1.CameraFOV
		end)
	end
end
do
	local Tab = Window:CreateTab("Base")
	do
		local Section = Tab:CreateSection("Bed")
		local Configs = Configurations.Base.Bed
		Section:CreateButton("Reset Bed", function()
			local Distance = Configs.Distance
			for _, v in ipairs(Beds) do
				if v.Name == "bed" and v:IsA("MeshPart") then
					local _position = v.Position
					local _position_1 = (LocalPlayer.Character:FindFirstChild("HumanoidRootPart")).Position
					local magnitude = (_position - _position_1).Magnitude
					if magnitude <= Distance then
						Bed = v
						Distance = magnitude
					end
				end
			end
			local Visualizer = Instance.new("Part")
			Visualizer.Anchored = true
			Visualizer.CanCollide = false
			Visualizer.Color = LocalPlayer.TeamColor.Color
			Visualizer.Transparency = 0.25
			Visualizer.Shape = Enum.PartType.Cylinder
			Visualizer.TopSurface = Enum.SurfaceType.Smooth
			Visualizer.BottomSurface = Enum.SurfaceType.Smooth
			Visualizer.Size = Vector3.new(500, 0.5, 0.5)
			local _result = Bed
			if _result ~= nil then
				_result = _result.Position
			end
			local _condition = _result
			if _condition == nil then
				_condition = Vector3.new(0, 9e4, 0)
			end
			Visualizer.Position = _condition
			Visualizer.Orientation = Vector3.new(0, 0, 90)
			syn.protect_gui(Visualizer)
			Visualizer.Parent = Workspace
			TweenService:Create(Visualizer, TweenInfo.new(1), {
				Size = Vector3.new(500, 25, 25),
				Transparency = 1,
			}):Play()
			Debris:AddItem(Visualizer, 1.25)
		end):AddToolTip("Finds the closest bed to you and sets it as your current bed.")
		Section:CreateToggle("Alarm (Custom)", Configs.Alarm, function(value)
			Configs.Alarm = value
			return Configs.Alarm
		end):AddToolTip("Custom Bed Alarm that notifies you when someone is approaching your bed.")
		Section:CreateSlider("Alarm Distance", 50, 200, Configs.Distance, true, function(value)
			Configs.Distance = value
			return Configs.Distance
		end):AddToolTip("Maximum Distance for players to trigger the alarm")
		Section:CreateToggle("Callout", Configs.Callout, function(value)
			Configs.Callout = value
			return Configs.Callout
		end):AddToolTip("Sends a chat message to alerts others when someone is approaching your bed.")
		Section:CreateTextBox("Callout Message", "Message", false, function(value)
			Configs.Message = value
			return Configs.Message
		end):AddToolTip("${name} for player name, ${team} for player team."):SetValue(Configs.Message)
		Section:CreateToggle("Team only?", Configs.TeamOnly, function(value)
			Configs.TeamOnly = value
			return Configs.TeamOnly
		end):AddToolTip("Whether callouts will send messages to only your team.")
	end
end
do
	local Tab = Window:CreateTab("Visuals")
	do
		local Section = Tab:CreateSection("Players")
		local Configs = Configurations.Visuals.Players
		Section:CreateToggle("Nametag", Configs.Nametag, function(value)
			Configs.Nametag = value
			return Configs.Nametag
		end)
		Section:CreateToggle("ESP Box", Configs.ESPBox, function(value)
			Configs.ESPBox = value
			return Configs.ESPBox
		end)
		Section:CreateToggle("Tracers", Configs.Tracers, function(value)
			Configs.Tracers = value
			return Configs.Tracers
		end)
		Section:CreateToggle("Ignore Spectators", Configs.IgnoreSpectators, function(value)
			Configs.IgnoreSpectators = value
			return Configs.IgnoreSpectators
		end)
	end
	do
		local Section = Tab:CreateSection("Others")
		local Configs = Configurations.Visuals.Others
		Section:CreateToggle("Beds ESP", Configs.BedsESP, function(value)
			Configs.BedsESP = value
			return Configs.BedsESP
		end):AddToolTip("This shows each teams bed")
		Section:CreateToggle("Drop ESP", Configs.DropESP, function(value)
			Configs.DropESP = value
			return Configs.DropESP
		end):AddToolTip("This shows dropped items and resources")
		Section:CreateToggle("Prop ESP", Configs.PropESP, function(value)
			Configs.PropESP = value
			return Configs.PropESP
		end):AddToolTip("This shows certain Kit props")
	end
end
do
	local Tab = Window:CreateTab("Settings")
	do
		local Section = Tab:CreateSection("General")
		Section:CreateButton("Unload Cheats", function() end)
	end
	do
		local Section = Tab:CreateSection("Menu")
		local Configs = Configurations.Menu
		Section:CreateToggle("Toggle Menu", true, function(value)
			return Window:Toggle(value)
		end):CreateKeybind("LeftAlt")
		Section:CreateColorpicker("Color", function(value)
			Window:ChangeColor(value)
			Configs.Color = value
		end):UpdateColor(Configs.Color)
		Section:CreateSlider("Background Transparency", 0, 1, Configs.BackgroundTransparency, false, function(value)
			return Window:SetBackgroundTransparency(value)
		end)
		Section:CreateTextBox("Background Texture", "Texture ID", false, function(value)
			return Window:SetBackground(value)
		end)
		Section:CreateToggle("Rainbow", Configs.Rainbow, function(value)
			Configs.Rainbow = value
			local _ = not value and Window:ChangeColor(Configs.Color)
		end)
		Section:CreateSlider("Rainbow Speed", 1, 5, Configs.RainbowSpeed, true, function(value)
			Configs.RainbowSpeed = value
			return Configs.RainbowSpeed
		end)
	end
end
-- Listeners:
RunService.Stepped:Connect(function(dt)
	do
		-- Melee Combat:
		local Configs = Configurations.Combat.Melee
		local Character = LocalPlayer.Character
		if Character and ValidCharacter(Character) then
			local Humanoid = Character:FindFirstChild("Humanoid")
			local HumanoidRootPart = Character:FindFirstChild("HumanoidRootPart")
			if Configs.OrientationBot and UserInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton3) then
				local Target, Distance, Position = (function()
					local Target
					local Distance = Configs.OrientationDistance
					local TargetPosition = Vector3.new()
					for _, v in ipairs(FilterTargets()) do
						local Character = v.Character
						if ValidCharacter(Character) then
							local Position = (Character:FindFirstChild("HumanoidRootPart")).Position
							local _position = HumanoidRootPart.Position
							local _vector3 = Vector3.new(Position.X, HumanoidRootPart.Position.Y, Position.Z)
							local Magnitude = (_position - _vector3).Magnitude
							if Magnitude <= Distance and math.abs(HumanoidRootPart.Position.Y - Position.Y) <= 40 then
								Target = v
								Distance = Magnitude
								TargetPosition = Position
							end
						end
					end
					return Target, Distance, TargetPosition
				end)()
				if Target ~= nil then
					Humanoid.AutoRotate = false
					local _fn = HumanoidRootPart.CFrame
					local _cFrame = CFrame.new(HumanoidRootPart.Position, Vector3.new(Position.X, HumanoidRootPart.Position.Y, Position.Z))
					local _arg0_1 = CFrame.Angles(0, math.rad(Configs.DirectionOffset), 0)
					HumanoidRootPart.CFrame = _fn:Lerp(_cFrame * _arg0_1, Configs.Sensitivity)
					if Configs.AutomaticSwing and Distance <= Configs.SwingDistance then
						mouse1click()
					end
				else
					Humanoid.AutoRotate = true
				end
			else
				Humanoid.AutoRotate = true
			end
		end
	end
	do
		-- Sprint:
		local Configs = Configurations.Combat.Sprint
		if Configs.Enabled then
			local Character = LocalPlayer.Character
			if Character and ValidCharacter(Character) then
				local Camera = Workspace.CurrentCamera
				local Humanoid = Character:FindFirstChildWhichIsA("Humanoid")
				if Configs.AlwaysActive then
					Humanoid.WalkSpeed = lerp(Humanoid.WalkSpeed, 21, 0.5)
					if Configs.CameraFOV then
						Camera.FieldOfView = lerp(Camera.FieldOfView, Configs.CameraFOV and 77 or 70, 0.2)
					end
				elseif Humanoid.MoveDirection.Magnitude > 0.5 then
					Humanoid.WalkSpeed = lerp(Humanoid.WalkSpeed, 21, 0.5)
					Camera.FieldOfView = lerp(Camera.FieldOfView, Configs.CameraFOV and 77 or 70, 0.2)
				else
					Humanoid.WalkSpeed = lerp(Humanoid.WalkSpeed, 14, 0.5)
					Camera.FieldOfView = lerp(Camera.FieldOfView, 70, 0.2)
				end
			end
		end
	end
end)
local LastIntruded = os.clock()
local Intruded = false
RunService.Heartbeat:Connect(function(dt)
	do
		-- Bed Alarm:
		local Configs = Configurations.Base.Bed
		if Configs.Alarm and (Bed and (Bed:IsDescendantOf(Workspace) and os.clock() - LastIntruded > 15)) then
			local Intruder
			local Distance = Configs.Distance
			for _, v in ipairs(FilterTargets()) do
				local Character = v.Character
				if Character and ValidCharacter(Character) then
					local HumanoidRootPart = Character:FindFirstChild("HumanoidRootPart")
					if HumanoidRootPart then
						local _position = HumanoidRootPart.Position
						local _position_1 = Bed.Position
						local Magnitude = (_position - _position_1).Magnitude
						if Magnitude < Distance then
							Intruder = v
							Distance = Magnitude
						end
					end
				end
			end
			if not Intruded and Intruder then
				StarterGui:SetCore("SendNotification", {
					Title = "Bed Alarm",
					Text = Intruder.DisplayName .. " is near bed.",
					Duration = 5,
				})
				if Configs.Callout then
					local _fn = ReplicatedStorage.DefaultChatSystemChatEvents.SayMessageRequest
					local _message = Configs.Message
					local _displayName = Intruder.DisplayName
					local _exp_1 = (string.gsub(_message, "${name}", _displayName))
					local _result = Intruder.Team
					if _result ~= nil then
						_result = _result.Name
					end
					local _condition = _result
					if _condition == nil then
						_condition = ""
					end
					_fn:FireServer((string.gsub(_exp_1, "${team}", _condition)), Configs.TeamOnly and "Team" or "All")
				end
				LastIntruded = os.clock()
			end
			Intruded = not not Intruder
		end
	end
end)
local DropESPs = {}
RunService.RenderStepped:Connect(function(dt)
	do
		-- Ranged Combat:
		local Configs = Configurations.Combat.Range
		if Configs.FOVCircle then
			FOVCircle.Position = UserInputService:GetMouseLocation()
			FOVCircle.Color = Configs.FOVRainbow and Color3.fromHSV((time() % 10) / 10, 1, 1) or Configs.FOVColor3
		end
		FOVCircle.Visible = Configs.FOVCircle
	end
	do
		-- Player ESP:
		local Configs = Configurations.Visuals.Players
		local _exp_1 = Players:GetPlayers()
		local _arg0_1 = function(player)
			if player == LocalPlayer then
				return nil
			end
			local Character = player.Character
			local _condition = Configs.IgnoreSpectators
			if not _condition then
				local _result = player.Team
				if _result ~= nil then
					_result = _result.Name
				end
				_condition = _result ~= "Spectators"
			end
			local _condition_1 = _condition
			if _condition_1 then
				_condition_1 = ValidCharacter(Character)
			end
			if _condition_1 then
				if Configs.Nametag then
					if not (Nametag.Instances[player] ~= nil) then
						Nametag.new(player)
					end
				else
					local _result = Nametag.Instances[player]
					if _result ~= nil then
						_result:Destroy()
					end
				end
				if Configs.ESPBox then
					if not (ESPBox.Instances[player] ~= nil) then
						ESPBox.new(player)
					end
				else
					local _result = ESPBox.Instances[player]
					if _result ~= nil then
						_result:Destroy()
					end
				end
				if Configs.Tracers then
					if not (Tracer.Instances[player] ~= nil) then
						Tracer.new(player)
					end
				else
					local _result = Tracer.Instances[player]
					if _result ~= nil then
						_result:Destroy()
					end
				end
			else
				local _result = Nametag.Instances[player]
				if _result ~= nil then
					_result:Destroy()
				end
				local _result_1 = ESPBox.Instances[player]
				if _result_1 ~= nil then
					_result_1:Destroy()
				end
				local _result_2 = Tracer.Instances[player]
				if _result_2 ~= nil then
					_result_2:Destroy()
				end
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp_1) do
			_arg0_1(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	do
		-- Other ESP:
		local Configs = Configurations.Visuals.Others
		if Configs.BedsESP then
			for _, bed in ipairs(Beds) do
				local Covers = bed:FindFirstChild("Covers")
				if not Covers then
					local _arg0_1 = (table.find(Beds, bed) or 0) - 1
					table.remove(Beds, _arg0_1 + 1)
					continue
				end
				if not (PartAdornment.Instances[Covers] ~= nil) then
					PartAdornment.new(Covers, Covers.Color)
				end
			end
		else
			for _, bed in ipairs(Beds) do
				local _instances = PartAdornment.Instances
				local _arg0_1 = bed:FindFirstChild("Covers")
				local _result = _instances[_arg0_1]
				if _result ~= nil then
					_result:Destroy()
				end
			end
		end
		if Configs.DropESP then
			for _, v in ipairs(Workspace.ItemDrops:GetChildren()) do
				if v:IsA("BasePart") then
					local name = v.Name
					local Color
					repeat
						if name == "iron" then
							Color = Color3.new(1, 1, 1)
							break
						end
						if name == "diamond" then
							Color = Color3.new(0, 0, 1)
							break
						end
						if name == "emerald" then
							Color = Color3.new(0, 1, 0)
							break
						end
						Color = Color3.new(0.5, 0.5, 0.5)
						break
					until true
					if not (PartAdornment.Instances[v] ~= nil) then
						local _condition = PartAdornment.new(v, Color)
						if _condition then
							-- ▼ Array.push ▼
							local _length_1 = #DropESPs
							DropESPs[_length_1 + 1] = v
							-- ▲ Array.push ▲
							_condition = _length_1 + 1
						end
					end
				end
			end
		else
			local _arg0_1 = function(value, key, instances)
				return value:Destroy()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(DropESPs) do
				_arg0_1(_v, _k - 1, DropESPs)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		if Configs.PropESP then
		end
	end
	do
		-- Interface:
		local Configs = Configurations.Menu
		if Configs.Rainbow then
			local Speed = 10 / Configs.RainbowSpeed
			Window:ChangeColor(Color3.fromHSV((time() % Speed) / Speed, 1, 1))
		end
	end
end)
-- Actions:
Window:Toggle(true)
FOVCircle.Thickness = 1
do
	local Distance = math.huge
	for _, v in ipairs(Beds) do
		if v.Name == "bed" and v:IsA("MeshPart") then
			local _position = v.Position
			local _position_1 = (LocalPlayer.Character:FindFirstChild("HumanoidRootPart")).Position
			local magnitude = (_position - _position_1).Magnitude
			if magnitude <= Distance then
				Bed = v
				Distance = magnitude
			end
		end
	end
end
