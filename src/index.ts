import { AppDataSource } from "./data-source"
import chalk from "chalk"
import yn from "yn"

import { initializeAedes } from "@lib/aedes"
import { startExpressServer } from "@lib/express"

console.log(chalk`{green Started}`)

const parseInteger = (int: string | undefined, or: number): number => {
	return int === undefined ? or : parseInt(int) || or
}

const port = parseInteger(process.env.PORT, 3000)
const aedesPort = parseInteger(process.env.AEDES_PORT, 3001)

const runExpress = yn(process.env.HTTP, { default: true })
const runAedes = yn(process.env.MQTT, { default: true })
AppDataSource.initialize()
	.then(() => {
		console.log("DataSource initialized")

		if (runExpress) startExpressServer(port)

		if (runAedes)
			initializeAedes(aedesPort).then(() => {
				console.log(
					chalk`{bold Aedes} listening on port {dim ${aedesPort}}`,
				)
			})
	})
	.catch((error) => {
		if ("code" in error && error.code == "ECONNREFUSED") {
			console.log(
				chalk`{red ERROR} Could not connect to the database at {dim ${error.address}${error.port}}`,
			)
		}
	})
