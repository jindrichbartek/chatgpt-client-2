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
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userInput })
      });

      const gptData = await response.json();
      if (!response.ok) {
        throw new Error(gptData.error.message);
      }
      if (!gptData) {
        throw new Error('No response from ChatGPT');
      }
      setConversation([...conversation, { type: 'user', text: userInput }, { type: 'chatgpt', text: gptData.result }]);
      setUserInput('');
    } catch (err) {
      console.error(err);
    }
    
  };

  const messageType = (message: any) => {
    return message.type === 'user' ? 'user-message' : 'chatgpt-message';
  }

  return (
    <>
      <header>
        <h1 className='px-4'>Chat GPT</h1>
      </header>
          <main className='relative flex flex-1 min-h-screen h-full w-full'>
            <section id='section1' className='flex flex-col w-full items-center justify-start
              max-h-85vh flex-basis-20 overflow-auto'>
              { conversation.map((message, index) => (
                <article key={ index } className={ `text-left md:w-1/2 w-full ${messageType(message)}` }>
                  { message.text }
                </article>
              )) }
            </section>
            <section id='section2' className='absolute bottom-4vh left-0 w-full flex justify-center'>
              <form className='flex items-center justify-center w-full' onSubmit={ handleSubmit }>
                <textarea
                  className='border rounded-md shadow-md md:w-3/4 w-full p-2 ml-4'
                  value={ userInput }
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your prompt."
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-4 py-2 px-4 rounded"
                >
                  Send
                </button>
              </form>
            </section>
          </main>
    </>
  );
};

  export default ChatGPTClient;