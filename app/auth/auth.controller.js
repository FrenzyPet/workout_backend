import asyncHandler from 'express-async-handler'
import { hash } from 'argon2'
import { faker, tr } from '@faker-js/faker'
import { prisma } from '../prisma.js'
import { generateToken } from './generate-token.js'
import { UserFields } from '../utils/user.utils.js'

export const authUser = asyncHandler(async (request, response) => {
	const user = await prisma.user.findMany({
		where: {
			password1: 'qweqwe'
		}
	})
	response.json(user)
})

export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('A user with the same email already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.person.fullName()
		},
		select: UserFields
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
