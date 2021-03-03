import { useState, useEffect, useRef } from 'react';

import { host } from '../config';

const useWebSocket = () => {
  const [ws, setWs] = useState<WebSocket>(null);
  const [error, setError] = useState<ApiError>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageServer[]>([]);
  const [user, setUser] = useState<User>(null);
  const [game, setGame] = useState<Game>(null);
  const messagesRef = useRef<ChatMessageServer[]>();
  messagesRef.current = messages;

  useEffect(() => {
    setWs(new WebSocket(`ws://${host}:5002`));
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = (event) => {
        console.debug('WebSocket connected');
        const id = localStorage.getItem('id');
        const secret = localStorage.getItem('secret');

        if (id && secret) {
          console.debug('Using existing credentials');
          setUser({
            id: parseInt(id, 10),
            secret,
          });

          ws.send(
            JSON.stringify({
              type: 'reconnect',
              payload: { user: { id, secret } },
            })
          );
        }
      };

      ws.onmessage = (event) => {
        const m = JSON.parse(event.data);
        const { type, payload } = m;

        console.debug(`Received message\n${type}:`, payload);

        switch (type) {
          case 'chatMessages': {
            setMessages(payload as ChatMessageServer[]);
            break;
          }
          case 'chatMessage': {
            setMessages([...messagesRef.current, payload as ChatMessageServer]);
            break;
          }
          case 'user': {
            if (!payload) {
              setUser(null);
              localStorage.clear();
              break;
            }

            setUser(payload);
            localStorage.setItem('id', payload.id);
            localStorage.setItem('secret', payload.secret);
            setError(null);
            break;
          }
          case 'game': {
            if (!payload) {
              setGame(null);
              break;
            }
            setGame(payload as Game);
            setMessages(payload.chat);
            setError(null);
            break;
          }
          case 'error': {
            setError(payload as ApiError);
            break;
          }
          default: {
            console.error('Received unexpected message type:', type);
            setError({
              type: 'UNEXPECTED_MESSAGE_TYPE',
              string: 'Received unexpected message type',
            });
          }
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error observed:', event);
        setError({
          type: 'WEBSOCKET_ERROR',
          string: `WebSocket error observed: ${event}`,
        });
      };

      ws.onclose = () => {
        console.debug('WebSocket disconnected');
        setError({
          type: 'WEBSOCKET_DISCONNECTED',
          string: 'WebSocket disconnected',
        });
      };

      // Clean up function
      return () => {
        ws.close();
      };
    }
  }, [ws]);

  return [ws, user, game, error, loading, messages];
};

export default useWebSocket;
