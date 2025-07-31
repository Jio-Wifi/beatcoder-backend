import axios from 'axios';
import config from '../config';

// const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';


const HEADERS = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': config.RAPID_API_KEY || '', 
  'X-RapidAPI-Host': config.RAPID_API_HOST || '',
};

export async function runJudge0({
  source_code,
  language_id,
  stdin = '',
}: {
  source_code: string;
  language_id: number;
  stdin?: string;
}) {
  const response = await axios.post(
    JUDGE0_URL,
    { source_code, language_id, stdin },
    { headers: HEADERS }
  );

  return response.data;
}
