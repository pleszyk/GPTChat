import { SiOpenai } from 'react-icons/si';
import { HiUser } from "react-icons/hi";

function ChatMessage({ message }) {
  return (
    <div className='chat-message'>
    <div className={`flex items-end ${message.role === 'user' && 'justify-end'}`}>
      <div className={`flex flex-col space-y-2 text-md max-w-xs mx-2 ${message.role === 'assistant' && 'order-2 items-start'} ${ message.role === 'user' && 'order-1 items-end'}`}>
        <div>
          <span className={`px-4 py-2 rounded-lg inline-block ${message.role === 'assistant' && 'rounded-bl-none bg-gray-300 text-gray-600'} ${message.role === 'user' && 'rounded-br-none bg-blue-600 text-white'}`}>
            {message.content}
          </span>
        </div>
      </div>
      {message.role === 'assistant' && <SiOpenai className='w-6 h-6 rounded-full order-1' /> }
      {message.role === 'user' && <HiUser className='w-6 h-6 rounded-full order-2' /> }
    </div>
  </div>
  );
}
export default ChatMessage;