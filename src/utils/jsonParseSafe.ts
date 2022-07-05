export const jsonParseSafe = <T>(
	obj: string,
): { data: T } | { error: unknown } => {
	try {
		return {
			data: JSON.parse(obj),
		}
	} catch (error) {
		return { error }
	}
}
