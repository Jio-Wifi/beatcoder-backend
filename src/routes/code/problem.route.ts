import express from 'express';
import { validateRequest } from '../../middleware/validation.middleware';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { createProblemValidation } from '../../validations/code/problem/create.problem.validation';
import { updateProblemValidation } from '../../validations/code/problem/update.problem.validation';
import { deleteProblemValidation } from '../../validations/code/problem/delete.problem.validation';
import { createProblem, deleteProblem, getAllProblems, getProblemBySlug, updateProblem } from '../../controllers/code/problem.controller';

const problemRoutes = express.Router();

// Admin routes
problemRoutes.post('/', isAuthenticate,authorizeRoles('admin'),createProblemValidation,validateRequest,createProblem);
problemRoutes.put('/:slug', isAuthenticate,authorizeRoles('admin'),updateProblemValidation,validateRequest,updateProblem);
problemRoutes.delete('/:slug', isAuthenticate,authorizeRoles('admin'),deleteProblemValidation,validateRequest,deleteProblem);

// public routes
problemRoutes.get('/', getAllProblems);
problemRoutes.get('/:slug', getProblemBySlug);

// TestCase Routes


export default problemRoutes;
