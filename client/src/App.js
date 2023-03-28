import { SiOpenai } from 'react-icons/si';
import { VscUnmute } from 'react-icons/vsc';
import { VscMute } from 'react-icons/vsc';
import { VscClearAll } from 'react-icons/vsc';
import { BsFillMicFill } from 'react-icons/bs';
import { BsFillMicMuteFill } from 'react-icons/bs';
import { TbSend } from 'react-icons/tb';
import ChatMessage from './components/ChatMessage';
import { createRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const chatContainer = createRef(null);
  const [input, setInput] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [mic, setMic] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: 'assistant',
      content: 'Hello there! Is there anything I can assist you with today?',
    },
  ]);

  function clearChat() {
    setChatLog([
      {
        role: 'assistant',
        content: 'Hello there! Is there anything I can assist you with today?',
      },
    ]);
  }

  useEffect(() => {
    if (chatContainer) {
      chatContainer.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [chatContainer]);

  function toggleVoice() {
    if (speaking) {
      setSpeaking(false);
    } else {
      setSpeaking(true);
    }
  }
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition();

  function toggleMic() {
    if (mic) {
      setMic(false);
      recognition.stop();
    } else {
      setMic(true);
      recognition.start();
      recognition.onresult = (e) => {
        setInput(e.results[0][0].transcript);
        setMic(false);
      };
      recognition.onend = () => setMic(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { role: 'user', content: `${input}` }];
    setInput('');
    setChatLog(chatLogNew);

    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: chatLogNew,
      }),
    });
    const data = await response.json();

    //TTS
    if (speaking) {
      let speak = new SpeechSynthesisUtterance();
      speak.text = data.message;
      speechSynthesis.speak(speak);
    }

    setChatLog([
      ...chatLogNew,
      { role: 'assistant', content: `${data.message}` },
    ]);
  }

  return (
    <div className='App'>
      <div className='h-screen overflow-hidden flex items-center justify-start bg-[#edf2f7]'>
        <div className='flex-1 p:2 sm:p-6 flex flex-col h-screen'>
          <div className='flex sm:items-center justify-between py-2 px-2 border-b-2 border-gray-200'>
            <div className='relative flex items-center space-x-4'>
              <div className='relative'>
                <span className='absolute text-green-500 right-0 bottom-0'>
                  <svg width='15' height='15'>
                    <circle cx='6' cy='6' r='6' fill='currentColor'></circle>
                  </svg>
                </span>
                <SiOpenai className='w-10 sm:w-16 h-10 sm:h-16 rounded-full' />
              </div>
              <div className='flex flex-col leading-tight'>
                <div className='text-2xl mt-1 flex items-center'>
                  <span className='text-gray-700 mr-3'>ChatGPT</span>
                </div>
                <span className='text-lg text-gray-600'>AI assistant</span>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={clearChat}
                type='button'
                className='inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none'
              >
                <VscClearAll size={25} />
              </button>
              <button
                onClick={toggleVoice}
                type='button'
                className='inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none'
              >
                {speaking ? <VscMute size={25} /> : <VscUnmute size={25} />}
              </button>
            </div>
          </div>
          <div
            ref={chatContainer}
            id='messages'
            className='flex h-screen flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
          >
            {chatLog.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
          <div className='border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
            <div className='relative flex'>
              <span className='absolute inset-y-0 flex items-center'>
                <button
                  onClick={toggleMic}
                  type='button'
                  className='inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none'
                >
                  {mic ? (
                    <BsFillMicMuteFill size={25} />
                  ) : (
                    <BsFillMicFill size={25} />
                  )}
                </button>
              </span>

              <form onSubmit={handleSubmit} className='w-3/4 sm:w-4/5 md:w-5/6 lg:w-[92%]'>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type='text'
                  placeholder='Write your message'
                  className='w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3'
                />
              </form>

              <div className='absolute right-0 items-center inset-y-0 sm:flex'>
                <button
                  onClick={handleSubmit}
                  type='button'
                  className='inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none'
                >
                  <span className='font-bold pr-2'>Send</span>
                  <TbSend size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
