import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Video, Paperclip, Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Conversation, Message, User } from "@shared/schema";

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations } = useQuery<(Conversation & { otherUser: User })[]>({
    queryKey: ["/api/users", user?.id, "conversations"],
    enabled: !!user?.id
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    enabled: !!selectedConversation
  });

  const { sendMessage } = useWebSocket(user?.id);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation || !user) return;

    sendMessage({
      conversationId: selectedConversation,
      senderId: user.id,
      content: messageInput.trim(),
      messageType: "text"
    });

    setMessageInput("");
  };

  const filteredConversations = conversations?.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations?.find(conv => conv.id === selectedConversation);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md" data-testid="auth-required">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in to view messages</h3>
            <p className="text-muted-foreground mb-4">
              Connect with room owners and tiffin providers
            </p>
            <Button data-testid="button-sign-in">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Connect with room owners and tiffin providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1" data-testid="conversations-list">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
                <Badge variant="secondary">{conversations?.length || 0}</Badge>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-conversations"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {filteredConversations?.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground" data-testid="no-conversations">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations?.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/30 cursor-pointer transition-colors ${
                        selectedConversation === conversation.id ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                      data-testid={`conversation-${conversation.id}`}
                    >
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarImage src={conversation.otherUser.profileImage || ""} />
                          <AvatarFallback>
                            {conversation.otherUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">
                              {conversation.otherUser.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.lastMessageAt!).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            Last message preview...
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2" data-testid="chat-window">
            {selectedConv ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={selectedConv.otherUser.profileImage || ""} />
                      <AvatarFallback>
                        {selectedConv.otherUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedConv.otherUser.name}</h3>
                      <p className="text-sm text-accent">Online</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" data-testid="button-voice-call">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" data-testid="button-video-call">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80" data-testid="messages-container">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-2 ${
                          message.senderId === user.id
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-muted text-foreground rounded-tl-sm'
                        }`}
                        data-testid={`message-${message.id}`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className={`text-xs ${
                          message.senderId === user.id ? 'opacity-70' : 'text-muted-foreground'
                        }`}>
                          {new Date(message.createdAt!).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" data-testid="button-attach-file">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                      data-testid="input-message"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      data-testid="button-send-message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center" data-testid="no-conversation-selected">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
