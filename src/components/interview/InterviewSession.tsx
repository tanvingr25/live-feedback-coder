import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Brain, Code, MessageSquare, Lightbulb, Award } from 'lucide-react'
import { VoiceInterface } from '../voice/VoiceInterface'
import { PythonCompiler } from '../compiler/PythonCompiler'
import { useToast } from '@/hooks/use-toast'
import type { ResumeAnalysis } from '../resume/ResumeUpload'

interface InterviewQuestion {
  id: string
  type: 'coding' | 'theory' | 'dsa'
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  followUpQuestions?: string[]
  codeTemplate?: string
}

interface InterviewSessionProps {
  resumeAnalysis?: ResumeAnalysis
  onSessionComplete: (results: InterviewResults) => void
}

export interface InterviewResults {
  totalQuestions: number
  correctAnswers: number
  hintsUsed: number
  totalTime: number
  performance: {
    coding: number
    theory: number
    communication: number
  }
  feedback: string
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({
  resumeAnalysis,
  onSessionComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions] = useState<InterviewQuestion[]>([
    {
      id: '1',
      type: 'theory',
      question: 'Explain the difference between a stack and a queue. When would you use each?',
      difficulty: 'easy',
      hints: [
        'Think about the order of insertion and removal',
        'Consider real-world analogies like plates or a line of people'
      ],
      followUpQuestions: [
        'How would you implement a queue using two stacks?',
        'What are the time complexities for stack and queue operations?'
      ]
    },
    {
      id: '2',
      type: 'coding',
      question: 'Write a function to find the maximum element in a binary tree.',
      difficulty: 'medium',
      hints: [
        'Consider using recursion',
        'Think about comparing left and right subtree maximums',
        'Don\'t forget the base case for empty nodes'
      ],
      codeTemplate: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def find_max_in_tree(root):
    # Your code here
    pass

# Test your function
# root = TreeNode(10)
# root.left = TreeNode(5)
# root.right = TreeNode(15)
# print(find_max_in_tree(root))  # Should return 15`
    },
    {
      id: '3',
      type: 'dsa',
      question: 'Given an array of integers, find two numbers that add up to a specific target. Return their indices.',
      difficulty: 'medium',
      hints: [
        'Consider using a hash map to store values and indices',
        'Think about the complement of each number',
        'You can solve this in O(n) time complexity'
      ],
      codeTemplate: `def two_sum(nums, target):
    # Your code here
    pass

# Test cases
# nums = [2, 7, 11, 15], target = 9
# Expected output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)`
    }
  ])
  
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({})
  const [hintsUsed, setHintsUsed] = useState<Record<string, number>>({})
  const [currentHint, setCurrentHint] = useState(0)
  const [startTime] = useState(Date.now())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isInterviewActive, setIsInterviewActive] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isInterviewActive) return
    
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, isInterviewActive])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleVoiceTranscript = (text: string) => {
    const questionId = questions[currentQuestion].id
    setAnswers(prev => ({ ...prev, [questionId]: text }))
  }

  const handleVoiceResponse = (text: string) => {
    // Voice response handling - could integrate with ElevenLabs here
    console.log('AI Response:', text)
  }

  const useHint = () => {
    const questionId = questions[currentQuestion].id
    const question = questions[currentQuestion]
    const hintsForQuestion = hintsUsed[questionId] || 0
    
    if (hintsForQuestion < question.hints.length) {
      setHintsUsed(prev => ({ ...prev, [questionId]: hintsForQuestion + 1 }))
      setCurrentHint(hintsForQuestion)
      
      toast({
        title: "Hint revealed",
        description: question.hints[hintsForQuestion]
      })
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setCurrentHint(0)
    } else {
      finishInterview()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setCurrentHint(0)
    }
  }

  const finishInterview = () => {
    setIsInterviewActive(false)
    
    // Calculate performance metrics
    const totalHints = Object.values(hintsUsed).reduce((sum, hints) => sum + hints, 0)
    const results: InterviewResults = {
      totalQuestions: questions.length,
      correctAnswers: Math.floor(questions.length * 0.7), // Mock scoring
      hintsUsed: totalHints,
      totalTime: timeElapsed,
      performance: {
        coding: 75,
        theory: 80,
        communication: 85
      },
      feedback: `Great job! You demonstrated solid problem-solving skills. ${totalHints > 3 ? 'Consider practicing more to reduce hint dependency.' : 'Excellent independent thinking!'}`
    }
    
    onSessionComplete(results)
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Header with progress and timer */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeElapsed)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={useHint} disabled={!question.hints.length}>
              <Lightbulb className="h-4 w-4 mr-1" />
              Hint ({(hintsUsed[question.id] || 0)}/{question.hints.length})
            </Button>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {question.type === 'coding' && <Code className="h-5 w-5 text-blue-500" />}
          {question.type === 'theory' && <MessageSquare className="h-5 w-5 text-green-500" />}
          {question.type === 'dsa' && <Brain className="h-5 w-5 text-purple-500" />}
          
          <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
            {question.difficulty}
          </Badge>
          <Badge variant="outline">
            {question.type.toUpperCase()}
          </Badge>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {question.question}
        </h2>

        <Tabs defaultValue="answer" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="answer">Answer</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="answer" className="space-y-4">
            <textarea
              className="w-full min-h-[200px] p-4 border border-input rounded-md bg-background resize-none"
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            />
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <PythonCompiler
              initialCode={question.codeTemplate || '# Write your code here'}
              onCodeChange={(code) => setCodeAnswers(prev => ({ ...prev, [question.id]: code }))}
            />
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4">
            <VoiceInterface
              onTranscript={handleVoiceTranscript}
              onSpeakResponse={handleVoiceResponse}
            />
          </TabsContent>
        </Tabs>

        {/* Show current hint if any */}
        {hintsUsed[question.id] && hintsUsed[question.id]! > 0 && (
          <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Hint:</p>
                <p className="text-blue-600 dark:text-blue-200">
                  {question.hints[(hintsUsed[question.id]! || 1) - 1]}
                </p>
              </div>
            </div>
          </Card>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button variant="destructive" onClick={finishInterview}>
            <Award className="h-4 w-4 mr-1" />
            Finish Interview
          </Button>
          <Button onClick={nextQuestion}>
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}