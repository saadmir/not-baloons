import { useRef, useState, useEffect, useCallback } from 'react';

export default function useApi() {
  const [loonStates, setLoonStates] = useState<tLoonMap<tLoon>>({})
  const [endOfRound, setEndOfRound] = useState(false)
  const [counter, setCounter] = useState<number>(0)

  const ws = useRef<WebSocket| null>(null)

  useEffect(() => {
    if (counter > 1) {
      setEndOfRound(true)
      disconnect();
      setCounter(0)
    }
  }, [counter]);

  const disconnect = useCallback(() => {
    ws?.current?.close && ws.current.close()
    ws.current = null;
  }, []);

  const messageHandler = useCallback((json: any) => {
    if (json?.msg?.msg?.includes('No loons left')) {
      return setCounter(prev => prev + 1)
    }

    if (json?.loonState && JSON.stringify(loonStates) !== JSON.stringify(json?.loonState)) {
      setLoonStates(json.loonState)
    }
  }, [endOfRound])

  const send = useCallback((payload: any) => {
    ws?.current?.send && ws.current.send(JSON.stringify(payload))
  }, []);

  const subscribe = useCallback((subscribe: string) => send({ subscribe }), [send]);

  const connect = useCallback(() => {
    ws?.current?.close && ws.current.close()
    ws.current = new WebSocket('wss://pronto-challenge.ngrok.app/saadmir@gmail.com/ws')
    ws.current.onopen = () => {
      subscribe('msg')
      subscribe('loonState')
    }
    ws.current.onmessage = (event: MessageEvent) => messageHandler(JSON.parse(event.data))
  }, [subscribe]);

  const popLoon = (loonId: string) => {
    send({
      publish: {
        popLoon: {
          loonId
        }
      }    
    })
  }

  const startRound = useCallback(() => {
    connect()
    setEndOfRound(false)
  }, [])

  return { loonStates, popLoon, startRound, endOfRound } 
}