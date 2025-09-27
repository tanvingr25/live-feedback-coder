import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit'

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void
  onSpeakResponse: (text: string) => void
  isListening?: boolean
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onTranscript,
  onSpeakResponse,
  isListening = false
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')

  const { speak, cancel, speaking } = useSpeechSynthesis({
    onEnd: () => setIsSpeaking(false)
  })

  const { listen, stop, supported } = useSpeechRecognition({
    onResult: (result: string) => {
      setTranscript(result)
      onTranscript(result)
    },
    onEnd: () => {
      setIsRecording(false)
    }
  })

  const handleStartRecording = useCallback(() => {
    if (!supported) {
      alert('Speech recognition is not supported in this browser')
      return
    }
    
    setIsRecording(true)
    setTranscript('')
    listen({ continuous: true })
  }, [listen, supported])

  const handleStopRecording = useCallback(() => {
    setIsRecording(false)
    stop()
  }, [stop])

  const handleSpeak = useCallback((text: string) => {
    if (speaking) {
      cancel()
    }
    setIsSpeaking(true)
    speak({ text, rate: 0.9, pitch: 1 })
    onSpeakResponse(text)
  }, [speak, cancel, speaking, onSpeakResponse])

  const handleStopSpeaking = useCallback(() => {
    cancel()
    setIsSpeaking(false)
  }, [cancel])

  return (
    <Card className="p-4 bg-card/50 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Voice Interface</h3>
        <div className="flex gap-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className="flex items-center gap-2"
            disabled={!supported}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? 'Stop' : 'Start'} Recording
          </Button>
          
          <Button
            variant={isSpeaking ? "destructive" : "outline"}
            size="sm"
            onClick={isSpeaking ? handleStopSpeaking : () => handleSpeak("Hello! I'm your AI interviewer. Let's begin the session.")}
            className="flex items-center gap-2"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? 'Stop' : 'Test'} Speech
          </Button>
        </div>
      </div>

      {transcript && (
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Your speech:</p>
          <p className="text-foreground">{transcript}</p>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 mt-3 text-sm text-primary">
          <div className="animate-pulse w-2 h-2 bg-primary rounded-full"></div>
          Listening...
        </div>
      )}

      {!supported && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            Speech recognition is not supported in this browser. Please use Chrome or Edge.
          </p>
        </div>
      )}
    </Card>
  )
}