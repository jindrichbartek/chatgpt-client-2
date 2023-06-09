// pages/index.tsx

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';

type MessageType = 'user' | 'chatgpt';

interface Message {
  type: MessageType;
  text: string;
}

const ChatGPTClient: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const userMessage = userInput;
    setUserInput('');
    setConversation(prev => [...prev, { type: 'user', text: userMessage }]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMessage })
      });

      const gptData = await response.json();
      if (!response.ok) {
        throw new Error(gptData.error.message);
      }
      if (!gptData) {
        throw new Error('No response from ChatGPT');
      }
      setConversation(prev => [...prev, { type: 'chatgpt', text: gptData.result }]);
    } catch (err) {
      console.error(err);
    }
    
  };

  function handleKeyDown (e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  }

  const getMessageClass = (message: any) => {
    return message.type === 'user' ? 'bg-gray-200' : 'bg-gray-100';
  }

  return (
    <>
      <header>
        <h1 className='px-4'>Chat GPT</h1>
      </header>
          <main className='relative flex flex-1 min-h-screen h-full w-full'>
            <section ref={chatRef}  id='chat' className='flex flex-col w-full items-center justify-start
              max-h-85vh flex-basis-20 overflow-auto'>
              { conversation.map((message, index) => (
                <article key={ index } className={ `text-left md:w-1/2 w-full p-2.5 rounded mb-2.5 ${getMessageClass(message)}` }>
                  { message.text }
                </article>
              )) }
            </section>
            <section id='form' className='absolute bottom-4vh left-0 w-full flex justify-center'>
              <form className='flex items-center justify-center w-full' onSubmit={ handleSubmit }>
                <textarea
                  className='border rounded-md shadow-md md:w-3/4 w-full p-2 ml-4'
                  value={ userInput }
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
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