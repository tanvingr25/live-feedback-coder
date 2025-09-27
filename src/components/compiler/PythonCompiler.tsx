import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Play, Square, Copy, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PythonCompilerProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  readOnly?: boolean
}

export const PythonCompiler: React.FC<PythonCompilerProps> = ({
  initialCode = '# Write your Python code here\nprint("Hello, CodeSage!")',
  onCodeChange,
  readOnly = false
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  // Mock Python execution - In production, this would call a backend service
  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to execute",
        description: "Please write some Python code first.",
        variant: "destructive"
      })
      return
    }

    setIsRunning(true)
    setError('')
    setOutput('')

    try {
      // Simulate API call to Python executor
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock output based on code patterns
      let mockOutput = ''
      if (code.includes('print')) {
        const printStatements = code.match(/print\((.*?)\)/g)
        if (printStatements) {
          mockOutput = printStatements.map(stmt => {
            const content = stmt.match(/print\((.*?)\)/)?.[1] || ''
            return content.replace(/['"]/g, '')
          }).join('\n')
        }
      } else {
        mockOutput = 'Code executed successfully (no output)'
      }
      
      // Add some realistic execution details
      mockOutput += `\n\n--- Execution completed in 0.${Math.floor(Math.random() * 900 + 100)}s ---`
      
      setOutput(mockOutput)
      
      toast({
        title: "Code executed successfully!",
        description: "Check the output below."
      })
    } catch (err) {
      const errorMsg = 'Execution failed. Please check your code for syntax errors.'
      setError(errorMsg)
      toast({
        title: "Execution Error",
        description: errorMsg,
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }

  const stopExecution = () => {
    setIsRunning(false)
    toast({
      title: "Execution stopped",
      description: "Code execution has been terminated."
    })
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied!",
      description: "Code has been copied to clipboard."
    })
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'solution.py'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Code downloaded!",
      description: "solution.py has been downloaded."
    })
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Python Code Editor</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCode}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={isRunning ? stopExecution : executeCode}
              className="flex items-center gap-2"
              disabled={readOnly}
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run
                </>
              )}
            </Button>
          </div>
        </div>

        <Textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Write your Python code here..."
          className="font-mono text-sm min-h-[300px] bg-muted/30"
          readOnly={readOnly}
        />
      </Card>

      {(output || error || isRunning) && (
        <Card className="p-4">
          <h4 className="text-md font-semibold mb-3 text-primary">Output</h4>
          {isRunning ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
              Executing code...
            </div>
          ) : (
            <div className="bg-muted/30 p-3 rounded-lg font-mono text-sm">
              {error ? (
                <div className="text-destructive">{error}</div>
              ) : (
                <div className="text-foreground whitespace-pre-line">{output}</div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}