import { AppDataSource } from "./data-source"
import chalk from "chalk"

import { netServer } from "@lib/aedes"
import { app } from "@lib/express"

console.log(chalk`{green Started}`)
const port = process.env.PORT ?? 3000
const aedesPort = process.env.AEDES_PORT ?? 3001

AppDataSource.initialize().then(() => {
	console.log("DataSource initialized")

	app.listen(port, () => {
		console.log(chalk`{bold Express} listening on port {dim ${port}}`)
	})

	netServer.listen(aedesPort, () => {
		console.log(chalk`{bold Aedes} listening on port {dim ${aedesPort}}`)
	})
})
