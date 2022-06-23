import { owntracksSchema } from "@schemas/owntracks"
import bodyParser from "body-parser"
import express from "express"

console.log("Started")

const app = express()

app.use(bodyParser.json())
app.use((req, res) => {
	console.log(`Request received on: ${req.url}`)
	console.log("JSON Body:", req.body)
	if (!("_type" in req.body)) {
		console.log("*req.body* is missing *_type*")
		return res.json({ error: true }).status(400)
	}
	const data = owntracksSchema.safeParse({
		...req.body,
		username: req.header("x-limit-u"),
		device: req.header("x-limit-d"),
	})
	if (data.success) {
		console.log("Owntracks Data:")

		console.log(data.data)

		return res.status(200).json({ ok: true })
	} else {
		console.log(data.error.toString())
		console.log("Did not receive correct data")

		return res.json({ error: true }).status(400)
	}
})
const port = process.env.PORT ?? 3000
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
