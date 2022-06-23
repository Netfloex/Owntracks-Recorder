import { z } from "zod"

// https://owntracks.org/booklet/tech/json/index.html

const triggerMap = {
	p: "ping",
	c: "circular",
	b: "beacon",
	r: "response",
	u: "manual",
	t: "timer",
	v: "ios",
} as const

const connectionMap = {
	w: "wifi",
	o: "offline",
	m: "mobile",
} as const

const batteryStatusMap = {
	0: "unknown",
	1: "unplugged",
	2: "charging",
	3: "full",
} as const

export const owntracksSchema = z
	.object({
		_type: z.string(),
		BSSID: z.string().optional(),
		SSID: z.string().optional(),
		acc: z.number().optional(),
		alt: z.number().optional(),
		batt: z.number().optional(),
		bs: z
			.number()
			.optional()
			.transform(
				(bs) => batteryStatusMap[bs as keyof typeof batteryStatusMap],
			),
		conn: z
			.string()
			.optional()
			.transform(
				(conn) => connectionMap[conn as keyof typeof connectionMap],
			),
		created_at: z
			.number()
			.transform((createdAt) => new Date(createdAt * 1000)),
		inregions: z.array(z.string()).optional(),
		lat: z.number(),
		lon: z.number(),
		m: z.number().optional(),
		t: z
			.string()
			.transform((t) => triggerMap[t as keyof typeof triggerMap])
			.optional(),
		tid: z.string().optional(),
		tst: z.number().transform((tst) => new Date(tst * 1000)),
		vac: z.number().optional(),
		vel: z.number().optional(),

		username: z.string(),
		device: z.string(),
	})
	.transform((data) => ({
		type: data._type,
		BSSID: data.BSSID,
		SSID: data.SSID,
		accuracy: data.acc,
		altitude: data.alt,
		battery: data.batt,
		batteryStatus: data.bs,
		connection: data.conn,
		createdAt: data.created_at,
		regions: data.inregions,
		latitude: data.lat,
		longitude: data.lon,
		mode: data.m,
		trigger: data.t,
		trackerId: data.tid,
		timestamp: data.tst,
		verticalAccuracy: data.vac,
		velocity: data.vel,
		username: data.username,
		device: data.device,
	}))
