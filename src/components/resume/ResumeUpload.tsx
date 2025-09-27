import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, X, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ResumeUploadProps {
  onResumeAnalyzed: (analysis: ResumeAnalysis) => void
}

export interface ResumeAnalysis {
  skills: string[]
  experience: string
  education: string[]
  projects: string[]
  suggested_questions: string[]
  difficulty_level: 'junior' | 'mid' | 'senior'
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeAnalyzed }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      })
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)
    analyzeResume(selectedFile)
  }

  const analyzeResume = async (resumeFile: File) => {
    setIsAnalyzing(true)
    
    try {
      // Mock resume analysis - In production, this would use AI to parse the PDF
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock analysis based on filename or simulate AI parsing
      const mockAnalysis: ResumeAnalysis = {
        skills: [
          'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git',
          'Data Structures', 'Algorithms', 'System Design'
        ],
        experience: '3+ years in software development',
        education: ['Computer Science Degree', 'Relevant Certifications'],
        projects: [
          'E-commerce Web Application',
          'Data Analysis Dashboard', 
          'Mobile App with React Native'
        ],
        suggested_questions: [
          'Implement a binary search algorithm',
          'Design a URL shortener system',
          'Explain the difference between SQL and NoSQL databases',
          'How would you optimize a slow-performing web application?'
        ],
        difficulty_level: 'mid'
      }
      
      setAnalysis(mockAnalysis)
      onResumeAnalyzed(mockAnalysis)
      
      toast({
        title: "Resume analyzed successfully!",
        description: "I've tailored the interview questions based on your background."
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze the resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setAnalysis(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">Upload Your Resume</h3>
        
        {!file ? (
          <div
            className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <p className="text-lg font-medium mb-2">Drop your resume here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files (PDF only, max 5MB)
            </p>
            <Button variant="outline">Choose File</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {analysis && <Check className="h-5 w-5 text-green-500" />}
              <Button
                variant="outline"
                size="sm"
                onClick={removeFile}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {isAnalyzing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-primary">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Analyzing your resume...
          </div>
        )}
      </Card>

      {analysis && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 text-primary">Resume Analysis</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Skills Identified</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Experience Level</h5>
              <p className="text-sm text-muted-foreground">{analysis.experience}</p>
            </div>

            <div>
              <h5 className="font-medium mb-2">Suggested Interview Focus</h5>
              <ul className="space-y-1">
                {analysis.suggested_questions.slice(0, 3).map((question, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}