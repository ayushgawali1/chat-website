import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Contact } from 'lucide-react';
import React from 'react'
import { RiCloseFill } from "react-icons/ri"

function ChatHeader() {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10 md:px-20'>
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className='w-12 h-12 relative'>
            {selectedChatType === "contact" ?
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`} >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              :
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
                #
              </div>
            }

          </div>
          <div className="flex flex-col items-center justify-center">
            <span>
              {selectedChatType === "channel" && selectedChatData.name}
              {selectedChatType === "contact" && selectedChatData.firstName && selectedChatData.lastName ?
                `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email
              }
            </span>
            <span className='text-xs'>
              {selectedChatData.email}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 border-1 border-transparent hover:border-white focus:outline-none hover:text-white duration-100 transition-all"
          >
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader