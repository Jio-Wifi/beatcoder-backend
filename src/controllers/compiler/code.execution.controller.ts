import { Request, Response } from "express";
import CodeExecutionService from "../../service/compiler/code.execution.service";
import CustomError from "../../utils/custom.error";
import catchAsync from "../../utils/catch.async";

export const excuteCode = catchAsync(async (req: Request, res: Response) => {
  const { language, code, input = "" } = req.body;
// console.log("Code execution request:", req.body);

  if (!language || !code.trim()) {
    throw new CustomError("Language and non-empty code are required", 400);
  }

  const result = await CodeExecutionService.execute(language, code, input);

  return res.status(200).json({ success: true, result });
});
