// js/auth.js
import { supabase } from './config.js'

export const auth = {
  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      window.location.href = '/login.html'
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  },

  // Registro
  async signUp(email, password, fullName, role = 'teacher') {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })
      if (authError) throw authError

      // Criar registro na tabela eng_students
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('eng_students')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            email: email,
            current_level: 'A1'
          })
        
        if (dbError) throw dbError
      }

      return authData
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  },

  // Verificar sessão
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
      return null
    }
  },

  // Proteger rota
  async requireAuth(redirectUrl = '/login.html') {
    const session = await this.getSession()
    if (!session) {
      window.location.href = redirectUrl
      return null
    }
    return session
  },

  // Obter usuário atual
  async getCurrentUser() {
    const session = await this.getSession()
    if (!session) return null
    
    try {
      const { data, error } = await supabase
        .from('eng_students')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }
}
