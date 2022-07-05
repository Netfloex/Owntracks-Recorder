import { Location } from "@entity/Location"
import { owntracksSchema } from "@schemas/owntracks"
import chalk from "chalk"
import { AppDataSource } from "src/data-source"

export const parseAndInsert = async (data: unknown): Promise<boolean> => {
	const parsed = owntracksSchema.safeParse(data)

	if (parsed.success) {
		console.log(
			chalk`Inserting... {dim (${parsed.data.latitude} ${
				parsed.data.longitude
			}) ${parsed.data.SSID ? parsed.data.SSID : ""} ${
				parsed.data.battery
			}%}`,
		)

		const location = Location.construct(parsed.data)
		await AppDataSource.manager.save(location)
		const count = await AppDataSource.manager.count(Location)

		console.log(
			chalk`Currently storing {bold {yellow ${count}}} locations in the database`,
		)

		return true
	} else {
		console.log(parsed.error.toString())
		console.log(chalk.red`Did not receive correct data`)
		return false
	}
}
