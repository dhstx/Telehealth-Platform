import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function EncounterPage() {
  const { id } = useParams()
  const [encounter, setEncounter] = useState(null)
  const [token, setToken] = useState('')
  const [note, setNote] = useState('')
  const [roomId] = useState(() => id)

  const localRef = useRef(null)
  const remoteRef = useRef(null)
  const pcRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    async function init() {
      // auth
      const { data } = await axios.post(`${API}/api/auth/login`, { email: 'physician@example.com', name: 'Sandbox Physician' })
      const t = data.token
      setToken(t)
      const enc = await axios.get(`${API}/api/encounter/${id}`, { headers: { Authorization: `Bearer ${t}` } })
      setEncounter(enc.data)
      setNote(enc.data.aiSummary || '')
      // socket
      const socket = io(API, { transports: ['websocket'] })
      socketRef.current = socket
      socket.emit('join-room', { roomId, userId: 'physician' })

      // webrtc
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
      pcRef.current = pc
      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit('candidate', { roomId, candidate: e.candidate, from: 'physician' })
      }
      pc.ontrack = (e) => {
        remoteRef.current.srcObject = e.streams[0]
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      localRef.current.srcObject = stream
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      socket.on('offer', async ({ offer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('answer', { roomId, answer, from: 'physician' })
      })
      socket.on('candidate', async ({ candidate }) => {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)) } catch {}
      })
    }
    init()

    return () => {
      socketRef.current?.emit('leave-room', { roomId, userId: 'physician' })
      socketRef.current?.disconnect()
      pcRef.current?.close()
    }
  }, [id, roomId])

  async function regenerate() {
    const { data: noteObj } = await axios.post(`${API}/api/encounter/${id}/summary`, {}, { headers: { Authorization: `Bearer ${token}` } })
    setNote(noteObj.summaryText)
  }

  if (!encounter) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white border rounded p-3">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <video ref={localRef} autoPlay muted playsInline className="w-full bg-black rounded" />
          <video ref={remoteRef} autoPlay playsInline className="w-full bg-black rounded" />
        </div>
        <div className="text-sm text-gray-600">Room ID: {roomId}</div>
      </div>
      <div className="space-y-3">
        <div className="bg-white border rounded p-3">
          <div className="font-semibold mb-1">SOAP</div>
          <pre className="text-sm whitespace-pre-wrap text-gray-800">{JSON.stringify(encounter.soap, null, 2)}</pre>
        </div>
        <div className="bg-white border rounded p-3">
          <div className="font-semibold mb-1">AI Summary</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{note}</div>
          <button onClick={regenerate} className="mt-2 px-3 py-1 bg-primary-600 text-white rounded">Regenerate</button>
        </div>
      </div>
    </div>
  )
}
