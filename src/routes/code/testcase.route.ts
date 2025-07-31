import express from 'express';
import { validateRequest } from '../../middleware/validation.middleware';
import { isAuthenticate } from '../../middleware/is.authenticate';

import { createTestCase, deleteTestCase, getTestCaseById, getTestCasesByProblem, updateTestCase } from '../../controllers/code/testcase.controller';
import { createTestCaseValidation } from '../../validations/code/testcase/create.testcase.validation';
import { updateTestCaseValidation } from '../../validations/code/testcase/update.testcase.validation';

const testCaseRoutes = express.Router();

testCaseRoutes.post('/', isAuthenticate,createTestCaseValidation, validateRequest,createTestCase);


testCaseRoutes.get('/problem/:problemId',getTestCasesByProblem);

testCaseRoutes.get('/:id', getTestCaseById);

testCaseRoutes.put('/:id',isAuthenticate, updateTestCaseValidation,validateRequest, updateTestCase);

testCaseRoutes.delete('/:id',isAuthenticate, deleteTestCase);


export default testCaseRoutes;
