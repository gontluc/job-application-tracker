export default async function parseData(dataString: string) {
    try {
        return JSON.parse(dataString)

    } catch (error) {
        console.log("Error parsing JSON")
        throw new Error()
    }
}