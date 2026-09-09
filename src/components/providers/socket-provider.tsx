'use client'

import { socket } from '@//socket'
import { useEffect } from 'react'

export function Socket() {
  useEffect(() => {

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [])

  return null
}
