import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/Header'
import { ResumeUpload, type ResumeAnalysis } from '@/components/resume/ResumeUpload'
import { InterviewSession, type InterviewResults } from '@/components/interview/InterviewSession'
import { Brain, FileText, Play, Award, BarChart3 } from 'lucide-react'
import heroImage from '@/assets/hero-bg.jpg'

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'upload' | 'interview' | 'results'>('welcome')
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null)
  const [interviewResults, setInterviewResults] = useState<InterviewResults | null>(null)

  const startInterview = () => {
    if (resumeAnalysis) {
      setCurrentStep('interview')
    } else {
      setCurrentStep('upload')
    }
  }

  const handleResumeAnalyzed = (analysis: ResumeAnalysis) => {
    setResumeAnalysis(analysis)
    setCurrentStep('interview')
  }

  const handleSessionComplete = (results: InterviewResults) => {
    setInterviewResults(results)
    setCurrentStep('results')
  }

  const resetInterview = () => {
    setCurrentStep('welcome')
    setResumeAnalysis(null)
    setInterviewResults(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {currentStep === 'welcome' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
              <div className="relative px-8 py-16 lg:px-16 lg:py-24">
                <div className="max-w-2xl">
                  <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    Master Your Next Interview with AI
                  </h1>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
                    CodeSage provides personalized coding interviews, real-time feedback, 
                    and adaptive questioning to prepare you for success.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      onClick={startInterview}
                      className="flex items-center gap-2 shadow-lg"
                    >
                      <Play className="h-5 w-5" />
                      Start Interview
                    </Button>
                    <Button variant="outline" size="lg" className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Upload Resume First
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Questions</h3>
                <p className="text-muted-foreground">
                  Adaptive questions based on your resume and skill level
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Resume Analysis</h3>
                <p className="text-muted-foreground">
                  Upload your PDF resume for personalized interview experience
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Performance Reports</h3>
                <p className="text-muted-foreground">
                  Detailed feedback and improvement suggestions
                </p>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-primary">Upload Your Resume</h2>
              <p className="text-muted-foreground">
                Help me tailor the interview questions to your background
              </p>
            </div>
            <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
          </div>
        )}

        {currentStep === 'interview' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-primary">Live Interview Session</h2>
              <p className="text-muted-foreground">
                Answer questions using voice, text, or code. Good luck!
              </p>
            </div>
            <InterviewSession 
              resumeAnalysis={resumeAnalysis || undefined}
              onSessionComplete={handleSessionComplete}
            />
          </div>
        )}

        {currentStep === 'results' && interviewResults && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Award className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-primary">Interview Complete!</h2>
              <p className="text-muted-foreground">Here's your performance summary</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Questions Answered:</span>
                    <span className="font-semibold">{interviewResults.correctAnswers}/{interviewResults.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hints Used:</span>
                    <span className="font-semibold">{interviewResults.hintsUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Time:</span>
                    <span className="font-semibold">{Math.floor(interviewResults.totalTime / 60000)}m {Math.floor((interviewResults.totalTime % 60000) / 1000)}s</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Skill Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Coding</span>
                      <span>{interviewResults.performance.coding}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: `${interviewResults.performance.coding}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Theory</span>
                      <span>{interviewResults.performance.theory}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: `${interviewResults.performance.theory}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Communication</span>
                      <span>{interviewResults.performance.communication}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: `${interviewResults.performance.communication}%`}}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Feedback & Recommendations</h3>
              <p className="text-muted-foreground mb-4">{interviewResults.feedback}</p>
            </Card>

            <div className="text-center">
              <Button onClick={resetInterview} size="lg" className="mr-4">
                Start New Interview
              </Button>
              <Button variant="outline" size="lg">
                Download Report
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Index;
