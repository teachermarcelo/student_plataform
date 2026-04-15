// js/config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// SUBSTITUA PELAS SUAS CREDENCIAIS DO SUPABASE
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key-here'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Configurações do sistema
export const CONFIG = {
  LEVELS: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  SUBLEVELS: ['1', '2'],
  SKILLS: ['reading', 'writing', 'listening', 'speaking'],
  STATUS_OPTIONS: ['todo', 'in_progress', 'review', 'done'],
  PRIORITY_OPTIONS: ['low', 'medium', 'high'],
  PERFORMANCE_OPTIONS: ['excellent', 'good', 'average', 'needs_improvement']
}

// Helper para gerar module_code (ex: A1.1-READING-001)
export function generateModuleCode(level, sublevel, skill, order) {
  const skillShort = skill.substring(0, 3).toUpperCase()
  return `${level}${sublevel}-${skillShort}-${String(order).padStart(3, '0')}`
}
