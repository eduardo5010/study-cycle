import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Send, MessageCircle, Users, Search, MoreVertical, Smile, Paperclip, Mic } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  studyGroupId?: string;
}

interface ChatGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: Message;
  avatar?: string;
  isStudyGroup: boolean;
}

export default function ChatsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch chat groups from API
  const { data: chatGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["/api/chat-groups"],
    queryFn: async () => {
      const response = await fetch('/api/chat-groups');
      if (!response.ok) {
        throw new Error('Failed to fetch chat groups');
      }
      return await response.json();
    }
  });

  // Fetch messages for selected group
  const { data: fetchedMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat-groups", selectedGroup?.id, "messages"],
    queryFn: async () => {
      if (!selectedGroup) return [];
      const response = await fetch(`/api/chat-groups/${selectedGroup.id}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      // Convert timestamp strings to Date objects
      return data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    },
    enabled: !!selectedGroup
  });

  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setMessages(fetchedMessages);
      scrollToBottom();
    }
  }, [fetchedMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup || !user) return;

    try {
      const response = await fetch(`/api/chat-groups/${selectedGroup.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          type: 'text'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const sentMessage = await response.json();
      // Convert timestamp string to Date object
      const message: Message = {
        ...sentMessage,
        timestamp: new Date(sentMessage.timestamp)
      };

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      // For now, still add to local state as fallback
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.name.charAt(0),
        content: newMessage,
        timestamp: new Date(),
        type: "text",
        studyGroupId: selectedGroup.id
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      scrollToBottom();
    }
  };

  const filteredGroups = chatGroups.filter((group: ChatGroup) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <MessageCircle className="h-8 w-8" />
          Study Chats
        </h1>
        <p className="text-muted-foreground">
          Connect with fellow learners and discuss study topics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chat Groups Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Study Groups
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-1 p-4">
                  {filteredGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-accent ${
                        selectedGroup?.id === group.id ? 'bg-accent ring-1 ring-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                          {group.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm truncate">{group.name}</h3>
                            {group.isStudyGroup && (
                              <Badge variant="secondary" className="text-xs">Study</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {group.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {group.memberCount} members
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedGroup ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                      {selectedGroup.avatar}
                    </div>
                    <div>
                      <h2 className="font-semibold">{selectedGroup.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedGroup.memberCount} members online
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-20rem)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.senderId === user?.id ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback className="text-xs">
                            {message.senderAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${message.senderId === user?.id ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{message.senderName}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div
                            className={`inline-block p-3 rounded-lg max-w-[70%] ${
                              message.senderId === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a chat group</h3>
                <p className="text-muted-foreground">
                  Choose a study group from the sidebar to start chatting
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
