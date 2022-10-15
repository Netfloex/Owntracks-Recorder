import createAedes from "aedes"
import chalk from "chalk"
import { pathExists, readFile } from "fs-extra"
import { createServer as createNetServer, Server as NetServer } from "net"
import { createServer as createTlsServer, Server as TlsServer } from "tls"

import { isLocationMessage } from "@utils/isLocationMessage"
import { jsonParseSafe } from "@utils/jsonParseSafe"
import { parseAndInsert } from "@utils/parseAndInsert"

export const aedes = createAedes({
	authorizeSubscribe: () => {
		return null
	},
})
export const initializeAedes = async (port: number): Promise<void> => {
	let server: TlsServer | NetServer
	const privKey = process.env.SSL_PRIVKEY
	const pubKey = process.env.SSL_PUBKEY
	if (privKey && pubKey) {
		console.log(chalk`{green Enabling TLS} on Aedes`)
		if (
			!(
				await Promise.all([pathExists(privKey), pathExists(pubKey)])
			).every((exists) => exists === true)
		) {
			throw new Error(
				`Private Key or Public key could not be found:\n - privKey: ${privKey}\n - pubKey: ${pubKey}`,
			)
		}

		server = createTlsServer(
			{
				key: await readFile(privKey),
				cert: await readFile(pubKey),
			},
			aedes.handle,
		)
	} else {
		server = createNetServer(aedes.handle)
	}

	server.listen(port)
}

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
