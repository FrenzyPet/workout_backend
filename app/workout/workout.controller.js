import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'

export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: +id }))
			}
		}
	})

	res.json(workout)
})

export const getWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			exercises: true
		}
	})

	if (!workout) {
		res.status(404)
		throw new Error('Workout not found!')
	}

	const minutes = Math.ceil(workout.exercises.length * 3.7)

	res.json({ ...workout, minutes })
})

export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})

	res.json(workouts)
})

export const updateWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body
	const { id } = req.params

	try {
		const workout = await prisma.workout.update({
			where: {
				id: +id
			},
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id: +id }))
				}
			}
		})

		res.json(workout)
	} catch (error) {
		res.status(404)
		throw new Error('Workout not found!')
	}
})

export const deleteWorkout = asyncHandler(async (req, res) => {
	const { id } = req.params

	try {
		const workout = await prisma.workout.delete({
			where: {
				id: Number(id)
			}
		})

		res.json({
			message: 'Workout has been deleted',
			workout
		})
	} catch (error) {
		res.status(404)
		throw new Error('Workout not found!')
	}
})
