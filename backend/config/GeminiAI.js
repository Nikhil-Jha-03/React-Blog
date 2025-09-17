import { GoogleGenAI } from '@google/genai'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateAiDescription(title) {
 const prompt = `
Write a comprehensive, human-like blog article on the topic: "${title}".

STRUCTURE REQUIREMENTS:
- Use **only HTML tags**: <h2> for section headings and <p> for paragraphs
- Include <ul> and <li> tags for bullet points and lists when appropriate
- Use <strong> for emphasis on key terms or important points
- Do **not** use markdown, asterisks, underscores, or any formatting symbols
- Do **not** include <html>, <body>, <head>, <title>, or any boilerplate tags
- Start with an engaging introductory paragraph using <p>
- Include 4–6 well-developed sections with descriptive <h2> headings
- Each section should have 2–3 substantial paragraphs (<p>)
- Use bullet points (<ul><li>) for lists, steps, tips, or key takeaways
- End with a thoughtful concluding paragraph that summarizes key points

CONTENT GUIDELINES:
- Target length: 700-800 words for comprehensive coverage
- Write in a conversational yet professional tone
- Use specific examples, practical tips, and actionable insights
- Include relevant statistics, facts, or research when appropriate
- Address common questions, concerns, or misconceptions readers might have
- Make each section flow naturally into the next
- Include real-world applications and case studies when relevant
- Provide step-by-step guidance where applicable

WRITING STYLE:
- Write as an expert but remain accessible to general audiences
- Use varied sentence structures and paragraph lengths
- Include transitional phrases between sections for smooth flow
- Avoid jargon unless properly explained
- Use active voice predominantly (80%+ of sentences)
- Create compelling, informative headings that preview section content
- Include rhetorical questions to engage readers
- Use storytelling elements where appropriate

ENGAGEMENT ELEMENTS:
- Start with a hook (surprising statistic, question, or relatable scenario)
- Include actionable takeaways in each section
- Use bullet points for easy scanning of key information
- Add practical examples that readers can relate to
- Include potential challenges and solutions
- End with a call-to-action or next steps for readers

SEO AND READABILITY:
- Use subheadings that include relevant keywords naturally
- Break up long paragraphs (max 3-4 sentences each)
- Include transition words and phrases for better flow
- Use simple, clear language while maintaining expertise
- Ensure each section provides unique value

OUTPUT FORMAT:
Return only the HTML content with proper <h2>, <p>, <ul>, <li>, and <strong> tags, ready for direct insertion into a webpage. No additional explanations or wrapper text needed.
`;


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}

export default generateAiDescription
