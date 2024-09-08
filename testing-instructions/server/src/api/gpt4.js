// src/api/gpt4.js
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.GPT4_API_KEY
});

async function sendToGPT4(imageUrls, context) {
  try {
    if (!Array.isArray(imageUrls)) {
      throw new Error('Expected imageUrls to be an array');
    }


    const prompt = `
      Generate detailed, step-by-step test cases for the functionality depicted in the images below. Each test case should include:
      - **Description**: What the test case is about.
      - **Pre-conditions**: What needs to be set up or ensured before testing.
      - **Testing Steps**: Clear, step-by-step instructions on how to perform the test.
      - **Expected Result**: What should happen if the feature works correctly.
      
      **Context**: ${context}
      
      **Images**:
      ${imageUrls.map(url => `- Image: ${url}`).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt }
          ]
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error sending request to GPT-4:', error);
    throw error;
  }
}

module.exports = sendToGPT4;
