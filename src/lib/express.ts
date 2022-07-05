import bodyParser from "body-parser"
import chalk from "chalk"
import express, { Response } from "express"

import { isLocationMessage } from "@utils/isLocationMessage"
import { parseAndInsert } from "@utils/parseAndInsert"

export const app = express()
app.use(bodyParser.json())

app.use(async (req, res): Promise<Response> => {
	const error = (): Response => res.json({ error: true }).status(400)
	console.log(
		chalk`Request received on: {dim ${req.protocol}://${req.header(
			"host",
		)}${req.url}}`,
	)
	if (Object.keys(req.body).length == 0) {
		console.log("Empty Body")

		return error()
	}

	if (isLocationMessage(req.body)) {
		console.log(chalk`{bold req.body} is not a {bold locationMessage}`)
		return error()
	}

	if (
		await parseAndInsert({
			...req.body,
			username: req.header("x-limit-u"),
			device: req.header("x-limit-d"),
		})
	) {
		return res.json({ ok: true })
	}

	return error()
})
