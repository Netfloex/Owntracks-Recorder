import { AppDataSource } from "./data-source"
import chalk from "chalk"

import { initializeAedes } from "@lib/aedes"
import { app } from "@lib/express"

console.log(chalk`{green Started}`)

const parseInteger = (int: string | undefined, or: number): number => {
	return int === undefined ? or : parseInt(int) || or
}

const port = parseInteger(process.env.PORT, 3000)
const aedesPort = parseInteger(process.env.AEDES_PORT, 3001)

AppDataSource.initialize()
	.then(() => {
		console.log("DataSource initialized")

		app.listen(port, () => {
			console.log(chalk`{bold Express} listening on port {dim ${port}}`)
		})

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
