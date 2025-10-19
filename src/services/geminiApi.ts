export const generateCommitMessageFromDiff = async (
  geminiKey: string,
  oldContent: string,
  newContent: string
): Promise<{ type: string; message: string }> => {
  if (!geminiKey) {
    throw new Error('Gemini API Key is required.');
  }

  const prompt = `You are an expert Git commit message generator. Analyze the difference between the old and new code below. Generate a Conventional Commit message.
  Respond ONLY with a JSON object in this format: {"type": "commit_type", "message": "your_concise_message"}.
  Example response: {"type": "refactor", "message": "improve API request error handling"}

  OLD CODE (if any):
  ---
  ${oldContent}
  ---

  NEW CODE:
  ---
  ${newContent}
  ---
  `;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiKey}`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!response.ok) {
    throw new Error('Gemini API request failed.');
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  const cleanedText = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanedText);
};