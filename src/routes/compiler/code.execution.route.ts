import express from 'express';
import { validateRequest } from '../../middleware/validation.middleware';
import { validateRunCode } from '../../validations/compiler/code.execution.validation';
import { excuteCode } from '../../controllers/compiler/code.execution.controller';

const compilerRoutes = express.Router();

compilerRoutes.post('/execute',validateRunCode, validateRequest, excuteCode);

export default compilerRoutes;
