import { BaseEntity } from "typeorm"

export class ConstructableBaseEntity extends BaseEntity {
	static construct<T>(this: new () => T, params: Partial<T>): T {
		return Object.assign(new this(), params)
	}
}
