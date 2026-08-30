"use client";

import React, { useState } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Check, 
  CheckCheck,
  Edit,
  Smile
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dummy Contacts Data
const contactsData = [
  {
    id: 1,
    name: "Ravi Sharma (Parent)",
    role: "Parent of Aarav",
    avatar: "RS",
    lastMessage: "Thank you for the update!",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Anita Desai",
    role: "Principal",
    avatar: "AD",
    lastMessage: "Please submit the marks by EOD.",
    time: "09:15 AM",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Student - 10th A",
    avatar: "PP",
    lastMessage: "Sir, I have a doubt in chapter 4.",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Staff Group",
    role: "Group (12 Members)",
    avatar: "SG",
    lastMessage: "Tomorrow is a holiday.",
    time: "Yesterday",
    unread: 0,
    online: false,
    isGroup: true,
  },
  {
    id: 5,
    name: "Vikram Singh (Parent)",
    role: "Parent of Rohan",
    avatar: "VS",
    lastMessage: "He is sick today, won't attend.",
    time: "Monday",
    unread: 0,
    online: false,
  },
];

// Dummy Chat History
const chatHistory = [
  { id: 1, senderId: 1, text: "Good morning sir, how is Aarav doing in maths?", time: "10:15 AM", isMe: false },
  { id: 2, senderId: 'me', text: "Good morning Ravi! Aarav is doing well, but he needs to focus a bit more on algebra.", time: "10:20 AM", isMe: true, status: 'read' },
  { id: 3, senderId: 1, text: "Okay, I will make sure he practices at home.", time: "10:25 AM", isMe: false },
  { id: 4, senderId: 1, text: "Can you suggest some reference books?", time: "10:26 AM", isMe: false },
  { id: 5, senderId: 'me', text: "Sure, RD Sharma is great for practice. Also, NCERT exemplar problems.", time: "10:28 AM", isMe: true, status: 'delivered' },
  { id: 6, senderId: 1, text: "Thank you for the update!", time: "10:30 AM", isMe: false },
];

export default function MessagesPage() {
  const [activeContactId, setActiveContactId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const activeContact = contactsData.find(c => c.id === activeContactId);

  const filteredContacts = contactsData.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 pt-6 h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Messages
          </h2>
          <p className="text-muted-foreground mt-1">
            Communicate with students, parents, and staff.
          </p>
        </div>
        <Button className="hidden sm:flex bg-cyan-600 hover:bg-cyan-700">
          <Edit className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Main Chat Layout */}
      <Card className="flex-1 flex overflow-hidden border-border/50 shadow-lg bg-card/80 backdrop-blur-sm rounded-2xl min-h-0">
        
        {/* Sidebar (Contacts) */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border/50 flex flex-col bg-background/30 hidden md:flex shrink-0">
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9 bg-background/50 border-muted focus-visible:ring-cyan-500 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={cn(
                  "p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 border-l-4",
                  activeContactId === contact.id 
                    ? "bg-cyan-500/10 border-cyan-500" 
                    : "border-transparent hover:bg-muted/50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border border-primary/10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.avatar}`} />
                    <AvatarFallback className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                      {contact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-sm truncate pr-2">{contact.name}</h4>
                    <span className={cn(
                      "text-[10px] whitespace-nowrap",
                      contact.unread > 0 ? "text-cyan-600 font-bold dark:text-cyan-400" : "text-muted-foreground"
                    )}>
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={cn(
                      "text-xs truncate max-w-[180px]",
                      contact.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-cyan-500 text-white shadow-sm border-0">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/10">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/10 hidden md:block">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeContact?.avatar}`} />
                <AvatarFallback className="bg-cyan-100 text-cyan-700">{activeContact?.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm md:text-base leading-none">{activeContact?.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  {activeContact?.online ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</>
                  ) : (
                    <>{activeContact?.role}</>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-cyan-600 rounded-full">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-cyan-600 rounded-full">
                <Video className="h-5 w-5" />
              </Button>
              <div className="w-px h-6 bg-border mx-1"></div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full uppercase tracking-wider">
                Today
              </span>
            </div>
            
            {chatHistory.map((msg, index) => {
              const showAvatar = !msg.isMe && (index === 0 || chatHistory[index - 1].isMe);
              return (
                <div key={msg.id} className={cn("flex w-full", msg.isMe ? "justify-end" : "justify-start")}>
                  <div className={cn("flex gap-2 max-w-[75%]", msg.isMe ? "flex-row-reverse" : "flex-row")}>
                    
                    {/* Receiver Avatar */}
                    {!msg.isMe && (
                      <div className="w-8 shrink-0 flex items-end">
                        {showAvatar ? (
                          <Avatar className="h-8 w-8 border border-primary/10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeContact?.avatar}`} />
                            <AvatarFallback className="text-xs bg-cyan-100 text-cyan-700">{activeContact?.avatar}</AvatarFallback>
                          </Avatar>
                        ) : <div className="w-8" />}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={cn(
                      "flex flex-col",
                      msg.isMe ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                        msg.isMe 
                          ? "bg-cyan-600 text-white rounded-br-sm" 
                          : "bg-muted text-foreground rounded-bl-sm border border-border/50"
                      )}>
                        {msg.text}
                      </div>
                      
                      {/* Meta Info (Time & Status) */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground px-1">
                        <span>{msg.time}</span>
                        {msg.isMe && (
                          msg.status === 'read' ? (
                            <CheckCheck className="h-3 w-3 text-cyan-500" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border/50 bg-card/40 backdrop-blur-md shrink-0">
            <div className="flex items-end gap-2 bg-background border border-border/60 p-2 rounded-2xl shadow-sm focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
              <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 rounded-full text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 rounded-full text-muted-foreground hover:text-cyan-600 hover:bg-cyan-500/10">
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <textarea 
                className="flex-1 bg-transparent border-0 focus:ring-0 resize-none min-h-[36px] max-h-[120px] text-sm py-2 px-2 overflow-y-auto"
                placeholder="Type a message..."
                rows={1}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              
              <Button 
                size="icon" 
                className="shrink-0 h-10 w-10 rounded-full bg-cyan-600 hover:bg-cyan-700 shadow-md text-white transition-transform active:scale-95"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
