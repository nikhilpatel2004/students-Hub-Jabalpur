import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface SendMessageData {
  conversationId: string;
  senderId: string;
  content: string;
  messageType?: string;
}

export function useWebSocket(userId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${userId}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case "new_message":
              // Invalidate conversations to update last message
              queryClient.invalidateQueries({ 
                queryKey: ["/api/users", userId, "conversations"] 
              });
              
              // Invalidate messages for the specific conversation
              queryClient.invalidateQueries({ 
                queryKey: ["/api/conversations", message.message.conversationId, "messages"] 
              });
              break;
              
            case "message_sent":
              // Invalidate messages to show the sent message
              queryClient.invalidateQueries({ 
                queryKey: ["/api/conversations", message.message.conversationId, "messages"] 
              });
              break;
              
            default:
              console.log("Unknown message type:", message.type);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [userId, queryClient]);

  const sendMessage = useCallback((data: SendMessageData) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "send_message",
        ...data
      }));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  return {
    sendMessage,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN
  };
}
