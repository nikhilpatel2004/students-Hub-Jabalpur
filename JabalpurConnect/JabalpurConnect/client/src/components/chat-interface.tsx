import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, Paperclip, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ChatInterface() {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const [selectedConversation, setSelectedConversation] = useState("maa-ki-rasoi");

  // Mock conversations for demo
  const mockConversations = [
    {
      id: "maa-ki-rasoi",
      name: "Maa Ki Rasoi",
      avatar: "MK",
      lastMessage: "Great! When can you start the tiffin service?",
      time: "2m",
      unread: true,
      type: "tiffin"
    },
    {
      id: "comfort-pg",
      name: "Comfort PG",
      avatar: "CP",
      lastMessage: "Room is available for immediate joining",
      time: "1h",
      unread: false,
      type: "room"
    },
    {
      id: "zaika-express",
      name: "Zaika Express",
      avatar: "ZE",
      lastMessage: "We have both veg and non-veg options",
      time: "3h",
      unread: false,
      type: "tiffin"
    }
  ];

  const mockMessages = [
    {
      id: "1",
      senderId: user?.id || "user",
      content: "Hi! I'm interested in your tiffin service. Can you provide more details about the monthly plan?",
      timestamp: "10:30 AM",
      isOwn: true
    },
    {
      id: "2",
      senderId: "provider",
      content: "Hello! Yes, our monthly plan includes lunch and dinner for ₹2,800. We provide fresh home-cooked vegetarian meals with free delivery in Wright Town area.",
      timestamp: "10:32 AM",
      isOwn: false
    },
    {
      id: "3",
      senderId: user?.id || "user",
      content: "That sounds perfect! Can I start from next Monday?",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: "4",
      senderId: "provider",
      content: "Absolutely! I'll prepare everything for Monday. Please share your address for delivery.",
      timestamp: "10:37 AM",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In real implementation, this would send via WebSocket
    setMessageInput("");
  };

  const selectedConv = mockConversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]" data-testid="chat-interface">
      {/* Conversations List */}
      <Card className="lg:col-span-1" data-testid="conversations-list">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Messages</span>
            <Badge variant="secondary">{mockConversations.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {mockConversations.map((conversation) => (
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
                    <AvatarFallback className={
                      conversation.type === "tiffin" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                    }>
                      {conversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {conversation.name}
                      </p>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
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
                  <AvatarFallback className={
                    selectedConv.type === "tiffin" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                  }>
                    {selectedConv.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConv.name}</h3>
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
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      message.isOwn
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    }`}
                    data-testid={`message-${message.id}`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className={`text-xs ${
                      message.isOwn ? 'opacity-70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp}
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
  );
}
