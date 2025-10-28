import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './componets/chat-container/ChatContainer';
import ContactContaioner from './componets/contact-container/ContactContaioner';
import ExptyChatContainer from './componets/empty-chat-container/ExptyChatContainer';

function ChatPage() {

  console.log("Chat page");
  

  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Setup Profile to continue");
      navigate("/profile");
    }
  }, []);

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContaioner />
      {selectedChatType === undefined ?
        <ExptyChatContainer />
        :
        <ChatContainer />
      }
    </div>
  )
}

export default ChatPage