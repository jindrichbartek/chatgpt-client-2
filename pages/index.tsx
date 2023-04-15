// pages/index.tsx

import { useState, FormEvent } from 'react';

type MessageType = 'user' | 'chatgpt';

interface Message {
  type: MessageType;
  text: string;
}

const ChatGPTClient: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setConversation([...conversation, { type: 'user', text: userInput }]);
    let chatGPTResponse;
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userInput })
      }).then((res) => res.json());
      if (response.result) {
        chatGPTResponse = response.result;
      } else {
        throw new Error('No response from ChatGPT');
      }

      setConversation([...conversation, { type: 'user', text: userInput }, { type: 'chatgpt', text: chatGPTResponse }]);
      setUserInput('');
    } catch (err) {
      console.error(err);
    }
    
  };

  return (
    <div>
      <h1>ChatGPT Client</h1>
      <div>
        {conversation.map((message, index) => (
          <div key={index} className={message.type === 'user' ? 'user-message' : 'chatgpt-message'}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message"/>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  };

  export default ChatGPTClient;