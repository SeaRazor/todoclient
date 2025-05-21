import OpenAI from 'openai';
import {config} from "../config.js";
import { todoService } from './todoService'; 

const todoFunctions = [
  {
    name: "getAllTodos",
    description: "Get all todo items",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "createTodo",
    description: "Create a new todo item",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the todo" },
        daysToExpire: { type: "number", description: "Days until expiration" },
        isCompleted: { type: "boolean", description: "Is the todo completed?" }
      },
      required: ["title", "daysToExpire"],
    },
  },
  // Add updateTodo, deleteTodo, etc.
];


export function createChatService() {
  let openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  async function sendMessage(message) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: config.OPENAI_MODEL,
        functions: todoFunctions,
        function_call: 'auto'
      });

      const choice = completion.choices[0];
      const msg = choice.message;

      // If a function call is requested by the model
      if (msg.tool_calls) {
        const { name, arguments: args } = msg.tool_calls;
        let result;
        // Parse arguments (OpenAI may send as stringified JSON)
        let parsedArgs = args;
        if (typeof args === 'string') {
          try {
            parsedArgs = JSON.parse(args);
          } catch (e) {
            console.error('Error parsing arguments:', e);
          }
        }
        result = await handleTodoFunctionCall(name, parsedArgs);
        // Optionally, send result back to OpenAI for a final response
        const followup = await openai.chat.completions.create({
          messages: [
            { role: 'user', content: message },
            msg,
            { role: 'function', name, content: JSON.stringify(result) }
          ],
          model: config.OPENAI_MODEL
        });
        return followup.choices[0].message.content;
      }
      return msg.content;
    } catch (error) {
      console.error('Error in chat service:', error);
      return 'Sorry, there was an error processing your request.';
    }
  }

  function setApiKey(apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  return {
    sendMessage,
    setApiKey
  };
}

// Keep handleTodoFunctionCall as a helper function
async function handleTodoFunctionCall(name, parsedArgs) {
  if (name === 'getAllTodos') {
    return await todoService.getAllTodos();
  } else if (name === 'createTodo') {
    return await todoService.createTodo(parsedArgs);
  } else {
    return { error: 'Unknown function call' };
  }
}

export const chatService = createChatService();