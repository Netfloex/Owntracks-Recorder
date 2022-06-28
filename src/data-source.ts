import { Location } from "./entity/Location"
import "reflect-metadata"
import { DataSource } from "typeorm"

const { env } = process
export const AppDataSource = new DataSource({
	synchronize: true,
	logging: false,
	entities: [Location],
	migrations: [],
	subscribers: [],
	type: (env.DB_TYPE as "postgres") ?? "postgres",
	username: env.DB_USERNAME ?? "postgres",
	password: env.DB_PASSWORD ?? "owntracks-recorder",
	database: env.DB_DATABASE ?? "owntracks",
	host: env.DB_HOST,
})
