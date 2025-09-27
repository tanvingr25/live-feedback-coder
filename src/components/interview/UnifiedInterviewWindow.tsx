import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Upload, FileText, Mic, MicOff, Volume2, VolumeX, Play, Square, Brain, MessageSquare, Code, Lightbulb, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit'
import { PythonCompiler } from '../compiler/PythonCompiler'

interface Question {
  id: string
  type: 'theory' | 'dsa' | 'coding'
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  codeTemplate?: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export const UnifiedInterviewWindow: React.FC = () => {
  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false)
  const [resumeSkills, setResumeSkills] = useState<string[]>([])
  
  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [interviewStarted, setInterviewStarted] = useState(false)
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // Code state
  const [currentCode, setCurrentCode] = useState('')
  
  const { toast } = useToast()

  // Voice synthesis
  const { speak, cancel, speaking } = useSpeechSynthesis({
    onEnd: () => setIsSpeaking(false)
  })

  // Voice recognition
  const { listen, stop, supported } = useSpeechRecognition({
    onResult: (result: string) => {
      setCurrentMessage(result)
    },
    onEnd: () => {
      setIsRecording(false)
    }
  })

  // Resume upload and analysis
  const handleResumeUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      })
      return
    }

    setResumeFile(file)
    
    // Mock resume analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockSkills = ['Python', 'JavaScript', 'React', 'Data Structures', 'Algorithms', 'SQL']
    setResumeSkills(mockSkills)
    setResumeAnalyzed(true)
    
    // Generate questions based on resume
    const generatedQuestions: Question[] = [
      {
        id: '1',
        type: 'theory',
        question: `I see you have experience with ${mockSkills[0]}. Can you explain the difference between lists and tuples in Python?`,
        difficulty: 'easy',
        hints: ['Think about mutability', 'Consider performance differences', 'Think about use cases']
      },
      {
        id: '2',
        type: 'dsa',
        question: 'Given your algorithm background, implement a function to reverse a linked list.',
        difficulty: 'medium',
        hints: ['Think about iterative vs recursive approach', 'Consider the pointers you need to track'],
        codeTemplate: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    # Your code here
    pass`
      },
      {
        id: '3',
        type: 'theory',
        question: `You mentioned ${mockSkills[2]} experience. How does the Virtual DOM work in React?`,
        difficulty: 'medium',
        hints: ['Think about reconciliation', 'Consider performance benefits', 'Think about the diffing algorithm']
      }
    ]
    
    setQuestions(generatedQuestions)
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello! I've analyzed your resume and see you have experience with ${mockSkills.join(', ')}. I've prepared some personalized questions for you. Let's start with the first one. Are you ready?`,
      timestamp: new Date()
    }
    
    setChatMessages([welcomeMessage])
    speakMessage(welcomeMessage.content)
    
    toast({
      title: "Resume analyzed!",
      description: "I've prepared personalized questions based on your background."
    })
  }

  const speakMessage = (text: string) => {
    if (speaking) cancel()
    setIsSpeaking(true)
    speak({ text, rate: 0.9, pitch: 1 })
  }

  const startRecording = () => {
    if (!supported) {
      toast({
        title: "Speech not supported",
        description: "Please use Chrome or Edge for voice features.",
        variant: "destructive"
      })
      return
    }
    
    setIsRecording(true)
    setCurrentMessage('')
    listen({ continuous: true })
  }

  const stopRecording = () => {
    setIsRecording(false)
    stop()
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    
    // Generate AI response
    setTimeout(() => {
      let aiResponse = ''
      
      if (!interviewStarted) {
        setInterviewStarted(true)
        aiResponse = questions.length > 0 ? questions[0].question : "Let's start with your first question."
      } else {
        // Mock AI responses based on context
        const responses = [
          "That's a good answer! Let me ask you a follow-up question.",
          "Interesting approach. Can you elaborate on that?",
          "Good thinking! Now let's move to a coding challenge.",
          "Great explanation! Let's dive deeper into the technical details."
        ]
        aiResponse = responses[Math.floor(Math.random() * responses.length)]
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, aiMessage])
      speakMessage(aiResponse)
    }, 1000)
    
    setCurrentMessage('')
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      const nextQ = questions[currentQuestion + 1]
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: nextQ.question,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, aiMessage])
      speakMessage(nextQ.question)
    }
  }

  const useHint = () => {
    if (questions[currentQuestion]?.hints) {
      const hint = questions[currentQuestion].hints[0]
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Here's a hint: ${hint}`,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, aiMessage])
      speakMessage(`Here's a hint: ${hint}`)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">CodeSage Interview</h1>
            {resumeAnalyzed && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Resume Analyzed
              </Badge>
            )}
          </div>
          {questions.length > 0 && (
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Chat & Resume */}
        <div className="w-1/2 border-r border-border flex flex-col">
          {/* Resume Upload Section */}
          {!resumeAnalyzed && (
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold mb-3">Upload Your Resume</h3>
              <div 
                className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                <p className="text-sm text-muted-foreground">
                  Drop PDF here or click to upload
                </p>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'ai' && <Brain className="h-4 w-4 mt-0.5 text-primary" />}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="flex items-center gap-1"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isRecording ? 'Stop' : 'Voice'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? () => cancel() : () => {}}
                  disabled={!speaking}
                  className="flex items-center gap-1"
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isSpeaking ? 'Stop' : 'Speaker'}
                </Button>
                {questions.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" onClick={useHint}>
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Hint
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextQuestion}>
                      Next Q
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your answer or use voice..."
                  className="flex-1"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor & Questions */}
        <div className="w-1/2 flex flex-col">
          {questions.length > 0 && (
            <Tabs defaultValue="question" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                <TabsTrigger value="question">Current Question</TabsTrigger>
                <TabsTrigger value="code">Python Compiler</TabsTrigger>
              </TabsList>
              
              <TabsContent value="question" className="flex-1 p-4">
                <Card className="h-full p-4">
                  {questions[currentQuestion] && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {questions[currentQuestion].type === 'theory' && <MessageSquare className="h-5 w-5 text-green-500" />}
                        {questions[currentQuestion].type === 'dsa' && <Brain className="h-5 w-5 text-purple-500" />}
                        {questions[currentQuestion].type === 'coding' && <Code className="h-5 w-5 text-blue-500" />}
                        <Badge variant="outline">
                          {questions[currentQuestion].type.toUpperCase()}
                        </Badge>
                        <Badge variant={questions[currentQuestion].difficulty === 'easy' ? 'default' : 
                                      questions[currentQuestion].difficulty === 'medium' ? 'secondary' : 'destructive'}>
                          {questions[currentQuestion].difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-4">
                        {questions[currentQuestion].question}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Use the chat on the left to answer, or switch to the Code tab for coding questions.
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="flex-1 p-4">
                <PythonCompiler
                  initialCode={questions[currentQuestion]?.codeTemplate || '# Write your Python code here\nprint("Hello, CodeSage!")'}
                  onCodeChange={setCurrentCode}
                />
              </TabsContent>
            </Tabs>
          )}
          
          {questions.length === 0 && resumeAnalyzed && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-primary/60" />
                <h3 className="text-xl font-semibold mb-2">Preparing Your Interview</h3>
                <p className="text-muted-foreground">
                  Questions are being generated based on your resume...
                </p>
              </div>
            </div>
          )}
          
          {!resumeAnalyzed && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-primary/60" />
                <h3 className="text-xl font-semibold mb-2">Welcome to CodeSage</h3>
                <p className="text-muted-foreground">
                  Upload your resume to get started with personalized interview questions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}