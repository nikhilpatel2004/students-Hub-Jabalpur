import { queryClient } from "./queryClient";

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface SendMessageData {
  conversationId: string;
  senderId: string;
  content: string;
  messageType?: string;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  connect(userId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    this.userId = userId;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${userId}`;

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.scheduleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.startHeartbeat();
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      this.stopHeartbeat();
      
      // Don't reconnect if it was a normal closure
      if (event.code !== 1000 && this.userId) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "new_message":
        // Invalidate conversations to update last message
        queryClient.invalidateQueries({ 
          queryKey: ["/api/users", this.userId, "conversations"] 
        });
        
        // Invalidate messages for the specific conversation
        if (message.message?.conversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ["/api/conversations", message.message.conversationId, "messages"] 
          });
        }
        break;
        
      case "message_sent":
        // Invalidate messages to show the sent message
        if (message.message?.conversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ["/api/conversations", message.message.conversationId, "messages"] 
          });
        }
        break;

      case "user_status_changed":
        // Handle user online/offline status changes
        queryClient.invalidateQueries({ 
          queryKey: ["/api/users", this.userId, "conversations"] 
        });
        break;

      case "pong":
        // Heartbeat response
        break;
        
      default:
        console.log("Unknown message type:", message.type);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  sendMessage(data: WebSocketMessage | SendMessageData): void {
    const message = 'conversationId' in data ? {
      type: "send_message",
      ...data
    } : data;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue the message for when connection is restored
      this.messageQueue.push(message);
      console.warn("WebSocket not connected, message queued");
    }
  }

  disconnect(): void {
    this.userId = null;
    this.stopHeartbeat();
    this.messageQueue = [];
    
    if (this.ws) {
      this.ws.close(1000, "User disconnected");
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return "DISCONNECTED";
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "CONNECTED";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "DISCONNECTED";
      default:
        return "UNKNOWN";
    }
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();

// Helper hook for React components
export const useWebSocketConnection = (userId?: string) => {
  const connect = () => {
    if (userId) {
      wsClient.connect(userId);
    }
  };

  const disconnect = () => {
    wsClient.disconnect();
  };

  const sendMessage = (data: SendMessageData) => {
    wsClient.sendMessage(data);
  };

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected: wsClient.isConnected(),
    connectionState: wsClient.getConnectionState()
  };
};
