import { GoogleGenAI } from '@google/genai'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateAiDescription(title) {
 const prompt = `
Write a human-like blog article on "${title}" using only HTML tags:

- Use <h2> for headings and <p> for paragraphs.
- Include <ul> and <li> for lists.
- Target length: 10-20 words for comprehensive coverage
- Use <strong> to emphasize key points.
- Do NOT include <html>, <body>, <head>, <title>, or markdown symbols.
- Start with an engaging intro (<p>), have 3–5 sections (<h2>), each with 2 paragraphs (<p>).
- End with a concluding paragraph summarizing key points.
- Write in a clear, conversational tone with practical tips and examples.
- Include actionable takeaways and relevant details in lists (<ul><li>).
- Return only HTML content, ready to insert into a webpage.
`;



    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}

export default generateAiDescription
