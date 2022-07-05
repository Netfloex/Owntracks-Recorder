import { owntracksSchema } from "@schemas/owntracks"
import { z } from "zod"

type LocationMessage = z.input<typeof owntracksSchema>
export function isLocationMessage(data: unknown): data is LocationMessage {
	return (
		typeof data == "object" &&
		data !== null &&
		"_type" in data &&
		(data as LocationMessage)._type == "location"
	)
}
