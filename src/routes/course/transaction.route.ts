// import express from 'express';
// import { isAuthenticate } from '../../middleware/is.authenticate';
// import { createTransactionValidation } from '../../validations/course/transaction/create.transaction.validation';
// import { authorizeRoles } from '../../middleware/authorize.role';
// import { validateRequest } from '../../middleware/validation.middleware';
// import { createTransaction, getAllTransactions, getTransactionById, updateTransactionStatus, verifyTransaction } from '../../controllers/course/transaction.controller';
// import { updateTransactionStatusValidation } from '../../validations/course/transaction/update.transaction.status.validation';

// const transactionRoutes = express.Router();

// transactionRoutes.post(
//   '/',
//   isAuthenticate,
//   authorizeRoles('user'),
//   createTransactionValidation,
//   validateRequest,
//   createTransaction
// );

// transactionRoutes.patch(
//   '/:id/status',
//   isAuthenticate,
//   authorizeRoles('admin'),
//   updateTransactionStatusValidation,
//   validateRequest,
//   updateTransactionStatus
// );

// transactionRoutes.get('/', isAuthenticate, authorizeRoles('admin'), getAllTransactions);
// transactionRoutes.get('/:id', isAuthenticate, authorizeRoles('admin'), getTransactionById);

// transactionRoutes.post('/verify', isAuthenticate, authorizeRoles('user'), verifyTransaction);


// export default transactionRoutes;
