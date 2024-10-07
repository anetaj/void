export const getBasename = (pathStr: string = "") => {
	// "unixify" path
	pathStr = pathStr.replace(/[/\\]+/g, "/") // replace any / or \ or \\ with /
	const parts = pathStr.split("/") // split on /
	return parts[parts.length - 1]
}