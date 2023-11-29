import asyncHandler from 'express-async-handler'
import { prisma } from '../../prisma.js'
import { calculateMinutes } from '../calculate-minutes.utils.js'

export const getWorkoutLog = asyncHandler(async (req, res) => {
	const workoutLog = await prisma.workoutLog.findUnique({
		where: {
			id: +req.params.id
		},

		include: {
			workout: {
				include: {
					exercises: true
				}
			},

			exerciseLogs: {
				orderBy: {
					id: 'asc'
				},
				include: {
					exercise: true
				}
			}
		}
	})

	if (!workoutLog) {
		res.status(404)
		throw new Error('Workout not found!')
	}

	const minutes = calculateMinutes()

	res.json({
		...workoutLog,
		minute: calculateMinutes(workoutLog.workout.exercises.length)
	})
})
