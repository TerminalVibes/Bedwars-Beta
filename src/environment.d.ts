interface Workspace {
	BedwarsSounds: Folder;
	BlockEngineSounds: Folder;
	ItemDrops: Folder;
	BananaPeels: Folder;
	AxolotlData: Folder;
	Ravens: Folder;
	MapCFrames: Folder & {
		"1_item_shop": CFrameValue;
		"2_item_shop": CFrameValue;
		"3_item_shop": CFrameValue;
		"4_item_shop": CFrameValue;
		"1_bed": CFrameValue;
		"2_bed": CFrameValue;
		"3_bed": CFrameValue;
		"4_bed": CFrameValue;
	};
	Map: Folder & {
		Blocks: Folder;
	};
	BedAlarmZones: Folder;
	BlockHandlersReady: BoolValue;
	FootstepSounds: Folder;
	ProjectileTargeting: Folder;
	NpcContainer: Folder;
	Explosions: Folder;
	ArcParticles: Folder;
	ClientBalloonHooks: Folder;
	RavenEffects: Folder;
	Clouds: Folder;
}

interface ReplicatedStorage {
	DefaultChatSystemChatEvents: Folder & {
		OnNewMessage: RemoteEvent;
		OnMessageDoneFiltering: RemoteEvent;
		OnNewSystemMessage: RemoteEvent;
		OnChannelJoined: RemoteEvent;
		OnChannelLeft: RemoteEvent;
		OnMuted: RemoteEvent;
		OnUnmuted: RemoteEvent;
		OnMainChannelSet: RemoteEvent;
		ChannelNameColorUpdated: RemoteEvent;
		SayMessageRequest: RemoteEvent;
		SetBlockedUserIdsRequest: RemoteEvent;
		GetInitDataRequest: RemoteFunction;
		MutePlayerRequest: RemoteFunction;
		UnMutePlayerRequest: RemoteFunction;
	};
	Inventories: Folder;
	ItemsReady: BoolValue;
	ProjectilesReady: BoolValue;
}
