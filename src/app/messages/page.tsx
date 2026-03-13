'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Send, Paperclip, Phone, Video, Info, ArrowLeft, Check, CheckCheck, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const contacts = [
  {
    id: 1,
    name: 'Ahmed Rashid',
    role: 'Client',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267045',
    lastMessage: 'Is the plumbing repair still on for tomorrow?',
    time: '2:15 PM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Sarah Khan',
    role: 'Provider',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267046',
    lastMessage: 'I have finished the deep cleaning. Please check.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'Karim Ullah',
    role: 'Client',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267047',
    lastMessage: 'Thanks for the great work!',
    time: 'Monday',
    unread: 0,
    online: true,
  },
];

const initialMessages = [
  {
    id: 1,
    senderId: 'me',
    text: 'Hello Ahmed! Yes, everything is on track for tomorrow at 10 AM.',
    time: '2:10 PM',
    status: 'read',
  },
  {
    id: 2,
    senderId: 1,
    text: 'Perfect. Do I need to provide any specific tools or will you bring everything?',
    time: '2:12 PM',
    status: 'received',
  },
  {
    id: 3,
    senderId: 'me',
    text: 'I will bring all the necessary tools and supplies. Just make sure the area under the sink is cleared.',
    time: '2:14 PM',
    status: 'read',
  },
  {
    id: 4,
    senderId: 1,
    text: 'Is the plumbing repair still on for tomorrow?',
    time: '2:15 PM',
    status: 'received',
  },
];

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      senderId: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-0'} 
        border-r border-slate-100 flex flex-col transition-all duration-300 md:relative absolute z-20 h-full bg-white
      `}>
        <div className="p-6 border-b border-slate-100">
           <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                 <MoreVertical size={20} />
              </Button>
           </div>
           <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
              <Input 
                placeholder="Search conversations..." 
                className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-medium" 
              />
           </div>
        </div>

        <ScrollArea className="flex-1">
           <div className="p-3 space-y-1">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                    ${selectedContact.id === contact.id ? 'bg-primary-soft shadow-sm' : 'hover:bg-slate-50'}
                  `}
                >
                   <div className="relative group">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                         <AvatarImage src={contact.avatar} />
                         <AvatarFallback className="font-bold text-slate-400">{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#2286BE] border-2 border-white rounded-full shadow-sm" />
                      )}
                   </div>
                   <div className="flex-1 text-left overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                         <span className={`font-bold truncate ${selectedContact.id === contact.id ? 'text-[#2286BE]' : 'text-slate-900'}`}>
                           {contact.name}
                         </span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{contact.time}</span>
                      </div>
                      <p className={`text-sm truncate ${contact.unread > 0 ? 'font-black text-slate-900' : 'text-slate-400 font-medium'}`}>
                        {contact.lastMessage}
                      </p>
                   </div>
                   {contact.unread > 0 && (
                     <Badge className="bg-[#2286BE] text-white font-black h-5 w-5 flex items-center justify-center rounded-full p-0 shadow-lg shadow-primary/20">
                       {contact.unread}
                     </Badge>
                   )}
                </button>
              ))}
           </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-slate-50/30 relative">
         {/* Chat Header */}
         <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
               <Button 
                 variant="ghost" 
                 size="icon" 
                 className="md:hidden text-slate-400"
                 onClick={() => setIsSidebarOpen(true)}
               >
                  <ArrowLeft size={20} />
               </Button>
               <div className="relative">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback className="font-bold">{selectedContact.name[0]}</AvatarFallback>
                  </Avatar>
                  {selectedContact.online && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#2286BE] border-2 border-white rounded-full" />
                  )}
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 leading-none">{selectedContact.name}</h3>
                  <p className="text-[10px] font-bold text-[#2286BE] uppercase tracking-widest mt-1">
                    {selectedContact.online ? 'Online now' : 'Seen 2h ago'}
                  </p>
               </div>
            </div>
            
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl">
                  <Phone size={20} />
               </Button>
               <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl">
                  <Video size={20} />
               </Button>
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl">
                  <Info size={20} />
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                    <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer">Clear History</DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer">Block User</DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer text-red-600">Report</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </header>

         {/* Messages Scroll Area */}
         <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="flex justify-center my-4">
                  <span className="bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Today</span>
               </div>

               <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`
                         max-w-[80%] md:max-w-[70%] lg:max-w-[60%] px-5 py-3.5 rounded-[2rem] shadow-sm relative group
                         ${message.senderId === 'me' 
                            ? 'bg-[#2286BE] text-white rounded-br-none' 
                            : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                          }
                       `}>
                          <p className="text-sm md:text-base font-medium leading-relaxed">
                            {message.text}
                          </p>
                          <div className={`
                            flex items-center gap-1.5 mt-1.5 
                            ${message.senderId === 'me' ? 'justify-end text-white/70' : 'text-slate-400'}
                          `}>
                             <span className="text-[10px] font-bold">{message.time}</span>
                             {message.senderId === 'me' && (
                               message.status === 'read' ? <CheckCheck size={14} className="text-white" /> : <Check size={14} />
                             )}
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </ScrollArea>

         {/* Message Input */}
         <footer className="p-6 bg-white border-t border-slate-100">
            <form 
              onSubmit={handleSendMessage}
              className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-50 h-16 px-4 rounded-[2rem] border border-slate-100 focus-within:border-[#2286BE] focus-within:ring-4 focus-within:ring-[#2286BE]/5 transition-all"
            >
               <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-[#2286BE] hover:bg-white shrink-0">
                  <Paperclip size={20} />
               </Button>
               <Input 
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Type your message here..." 
                 className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none font-medium text-slate-700 h-full"
               />
               <Button type="button" variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-slate-400 hover:text-[#2286BE] hover:bg-white shrink-0">
                  <Smile size={20} />
               </Button>
               <Button 
                 type="submit" 
                 disabled={!newMessage.trim()}
                 className={`
                   rounded-full flex items-center justify-center p-0 h-10 w-10 shrink-0 transition-all
                   ${newMessage.trim() ? 'bg-[#2286BE] text-white shadow-lg shadow-primary/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                 `}
               >
                  <Send size={18} />
               </Button>
            </form>
         </footer>
      </main>

      {/* Right User Detail Panel (Desktop Only) */}
      <aside className="hidden lg:flex w-80 border-l border-slate-100 flex-col bg-white">
          <ScrollArea className="flex-1">
             <div className="p-8 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-slate-50 ring-2 ring-primary-soft">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback className="text-2xl font-bold">{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-black text-slate-900">{selectedContact.name}</h2>
                <p className="text-sm font-bold text-[#2286BE] mb-8">{selectedContact.role}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Orders</p>
                      <p className="font-black text-slate-900">12</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Spent</p>
                      <p className="font-black text-slate-900">৳8.4k</p>
                   </div>
                </div>

                <div className="space-y-4 text-left">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Shared Files</h4>
                   <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-slate-50 rounded-xl hover:bg-slate-50 cursor-pointer group">
                           <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Info size={18} />
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-800 truncate">contract_v{i}.pdf</p>
                              <p className="text-[10px] font-medium text-slate-400">1.2 MB • Jun 1{i}, 2024</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </ScrollArea>
          <div className="p-6 border-t border-slate-50">
             <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                Delete Conversation
             </Button>
          </div>
      </aside>
    </div>
  );
}
