import createAedes from "aedes"
import chalk from "chalk"
import { createServer } from "net"

import { isLocationMessage } from "@utils/isLocationMessage"
import { jsonParseSafe } from "@utils/jsonParseSafe"
import { parseAndInsert } from "@utils/parseAndInsert"

export const aedes = createAedes()
export const netServer = createServer(aedes.handle)

aedes.on("publish", async (packet) => {
	const parsed = jsonParseSafe(packet.payload.toString())
	if ("data" in parsed && parsed.data) {
		if (isLocationMessage(parsed.data)) {
			const [, username, device] = packet.topic.split("/")
			await parseAndInsert({ ...parsed.data, username, device })
		} else if (!process.env.HIDE_NON_LOCATIONMESSAGE) {
			console.log(
				chalk`{bold MQTT} Published a non LocationMessage:`,
				parsed.data,
			)
		}
	}
})

// Events
aedes.on("client", (client) => {
	console.log(chalk`{green {bold Connected:}} {dim ${client.id}}`)
})

aedes.on("clientDisconnect", (client) => {
	console.log(chalk`{red {bold Disconnected:}} {dim ${client.id}}`)
})

aedes.on("clientError", (client, err) => {
	console.log("client error", client.id, err.message, err.stack)
})

aedes.on("connectionError", (client, err) => {
	console.log("client error: client: %s, error: %s", client.id, err.message)
})
