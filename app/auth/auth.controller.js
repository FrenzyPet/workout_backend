import { prisma } from '../prisma.js'

export const authUser = async (request, response) => {
	const user = await prisma.user.findMany()
	response.json(user)
}
