import asyncHandler from 'express-async-handler';

import { prisma } from '../../prisma.js';
import { calculateMinute } from '../calculate-minute.js';


// @desc    get workoutLog
// @route   POST /api/workouts/log/:id
// @access  Private

export const getWorkoutLog = asyncHandler(async (req, res) => {
  const workoutLog = await prisma.workoutLog.findUnique({
    where: {
      id: +req.params.id,
    },
    include: {
      workout: {
        include: {
          exercises: true,
        },
      },
      exerciseLogs: {
        orderBy: {
          id: 'desc',
        },
        include: {
          exercise: true,
        },
      },
    },
  });

  if (!workoutLog) {
    res.status(404);
    throw new Error('workout log not found');
  }

  res.json({ ...workoutLog, minute: calculateMinute(workoutLog.workout.exercises.length) });
});
