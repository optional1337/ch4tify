import React from 'react'
import Navbar from '../components/navbar'
import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelected'
import Sidebar from '../components/sideBar'
import { chatStore } from '../store/chatStore'

const DashboardPage = () => {
  const { selectedUser } = chatStore();

  return (
    <>
      <Navbar />
      <div className="h-screen w-full bg-base-200 z-10">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-74 md:w-full lg:w-full max-w-6x2l h-[calc(100vh-6rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              {/* Sidebar - hide on mobile if chat is selected */}
              <div className={`${selectedUser ? 'hidden' : 'flex'} lg:flex`}>
                <Sidebar />
              </div>

              {/* Main Chat Area */}
              <>
                {!selectedUser ? (
                  <div className="flex flex-1">
                    <NoChatSelected />
                  </div>
                ) : (
                  <div className="flex flex-1">
                    <ChatContainer />
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
