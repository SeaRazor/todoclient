import OpenAI from 'openai';
import {config} from "../config.js";
import { todoService } from './todoService'; 

const todoTools = [
  {
    type: "function",
    function: {
      name: "getAllTodos",
      description: "Get all todo items",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
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
        tools: todoTools,
        tool_choice: 'auto'
      });

      const choice = completion.choices[0];
      const msg = choice.message;

      // If a function call is requested by the model (supports both tool_calls and function_call)
      if (msg.tool_calls) {
        // Handle multiple tool calls as per OpenAI tool-calling protocol
        const toolMessages = [];
        for (const toolCall of msg.tool_calls) {
          const { name, arguments: args } = toolCall.function;
          let parsedArgs = args;
          if (typeof args === 'string') {
            try { parsedArgs = JSON.parse(args); } catch (e) { parsedArgs = {}; }
          }
          const result = await handleTodoFunctionCall(name, parsedArgs);
          // If this was a createTodo call, mark the result for the ChatBot
          if (name === 'createTodo') {
            toolMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name,
              content: JSON.stringify({ ...result, createdByChat: true })
            });
          } else {
            toolMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name,
              content: typeof result === 'string' ? result : JSON.stringify(result)
            });
          }
        }
        // Now send the original messages + assistant + all tool messages
        const followup = await openai.chat.completions.create({
          messages: [
            { role: 'user', content: message },
            msg,
            ...toolMessages
          ],
          model: config.OPENAI_MODEL
        });
        let content = followup.choices[0].message.content;
        if (toolMessages.some(tm => tm.name === 'createTodo')) {
          content += '\n\ntodo created by chat';
        }
        return content;
      } else if (msg.function_call) {
        // Handle legacy function_call format (like o3-mini)
        const { name, arguments: args } = msg.function_call;
        let parsedArgs = args;
        if (typeof args === 'string') {
          try {
            parsedArgs = JSON.parse(args);
          } catch (e) {
            console.error('Error parsing arguments:', e);
          }
        }
        const result = await handleTodoFunctionCall(name, parsedArgs);
        //  just return the result as the assistant's message
        return typeof result === 'string' ? result : JSON.stringify(result);
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