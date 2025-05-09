import OpenAI from 'openai';

class ChatService {
  constructor() {
    // Initialize with a default API key - in production, this should be handled securely
    this.openai = new OpenAI({
      apiKey: 'your-api-key-here', // Replace with actual API key
      dangerouslyAllowBrowser: true // Only for demo purposes
    });
  }

  async sendMessage(message) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  }

  setApiKey(apiKey) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
}

export const chatService = new ChatService(); 