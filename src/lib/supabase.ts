import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyawxhnbpcqbmphfcvvk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YXd4aG5icGNxYm1waGZjdnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzQzMTMsImV4cCI6MjA3NDU1MDMxM30.wdUw9SODLTYO2fekCL1u2XGnKgekpndBi1riWw8qzdg'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Interview {
  id: string
  user_id: string
  title: string
  type: 'coding' | 'theory' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'pending' | 'in_progress' | 'completed'
  resume_content?: string
  questions: Question[]
  responses: Response[]
  performance_score?: number
  feedback?: string
  created_at: string
  completed_at?: string
}

export interface Question {
  id: string
  interview_id: string
  type: 'coding' | 'theory' | 'dsa'
  question_text: string
  difficulty: string
  expected_answer?: string
  code_template?: string
  test_cases?: TestCase[]
  order_index: number
}

export interface Response {
  id: string
  question_id: string
  answer_text?: string
  code_solution?: string
  execution_time?: number
  is_correct?: boolean
  hints_used: number
  created_at: string
}

export interface TestCase {
  input: string
  expected_output: string
  is_hidden: boolean
}

export interface User {
  id: string
  email: string
  full_name?: string
  experience_level?: string
  preferred_languages?: string[]
  created_at: string
}