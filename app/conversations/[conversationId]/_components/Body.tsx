'use client'
import useConversation from '@/app/hooks/useConversation'
import { FullMessageType } from '@/app/types'
import React, { useRef } from 'react'
import MessageBox from './MessageBox'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body:React.FC<BodyProps> = ({initialMessages}) => {

  const [messages, setMessages] = React.useState<FullMessageType[]>(initialMessages)

  const bottomRef = useRef<HTMLDivElement>(null)

  const {conversationId} = useConversation()

  // 5:17

  return (
    <div
    className='flex-1 overflow-y-auto '
    >

    {messages.map((message, index) => (
      <MessageBox
      isLastMessage={index === messages.length - 1}
      key={message.id}
      data = {message}
      />
    ))}

      <div ref={bottomRef} className='pt-24'></div>
    </div>
  )
}

export default Body