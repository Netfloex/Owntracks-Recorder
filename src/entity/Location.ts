import { ConstructableBaseEntity } from "./ConstructableBaseEntity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("Location", { schema: "public" })
export class Location extends ConstructableBaseEntity {
	@PrimaryGeneratedColumn({ type: "integer", name: "id" })
	id!: number

	@Column()
	type!: string

	@Column({ nullable: true })
	BSSID!: string

	@Column({ nullable: true })
	SSID!: string

	@Column({ nullable: true })
	accuracy!: number

	@Column({ nullable: true })
	altitude!: number

	@Column({ nullable: true })
	battery!: number

	@Column({ nullable: true })
	batteryStatus!: string

	@Column({ nullable: true })
	connection!: string

	@Column()
	createdAt!: Date

	@Column("text", { nullable: true, array: true })
	regions!: string[]

	@Column("decimal", { precision: 10, scale: 8 })
	latitude!: number

	@Column("decimal", { precision: 11, scale: 8 })
	longitude!: number

	@Column({ nullable: true })
	mode!: number

	@Column({ nullable: true })
	trigger!: string

	@Column({ nullable: true })
	trackerId!: string

	@Column()
	timestamp!: Date

	@Column({ nullable: true })
	verticalAccuracy!: number

	@Column({ nullable: true })
	velocity!: number

	@Column()
	username!: string

	@Column()
	device!: string
}
