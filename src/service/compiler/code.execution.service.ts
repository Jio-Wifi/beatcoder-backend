import CustomError from "../../utils/custom.error";
import { runJudge0 } from "../../utils/judge.zero";

const languageMap: Record<string, number> = {
  cpp: 54,
  python: 71,
  javascript: 63,
  java: 62,
  c: 50,
};

class CodeExecutionService {
  async execute(
    language: string,
    code: string,
    input: string = ""
  ): Promise<string> {
    const language_id = languageMap[language];
    if (!language_id) {
      throw new CustomError("Unsupported language", 400);
    }

    const result = await runJudge0({
      source_code: code,
      language_id,
      stdin: input,
    });

    

    return result;
  }
}

export default new CodeExecutionService();
