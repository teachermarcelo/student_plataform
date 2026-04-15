// js/storage.js
import { supabase } from './config.js'

export const storage = {
  // Upload de arquivo
  async uploadFile(file, folder, studentId = null) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${folder}${studentId ? `/${studentId}` : ''}/${fileName}`

      const { data, error } = await supabase.storage
        .from('english-platform-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('english-platform-uploads')
        .getPublicUrl(filePath)

      return { filePath, publicUrl }
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    }
  },

  // Upload múltiplo
  async uploadMultipleFiles(files, folder, studentId = null) {
    const uploads = []
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, folder, studentId)
        uploads.push(result)
      } catch (error) {
        console.error(`Erro ao upload ${file.name}:`, error)
      }
    }
    return uploads
  },

  // Deletar arquivo
  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from('english-platform-uploads')
        .remove([filePath])
      
      if (error) throw error
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      throw error
    }
  },

  // Listar arquivos de um aluno
  async listStudentFiles(studentId, folder = null) {
    try {
      let query = supabase.storage
        .from('english-platform-uploads')
        .list(`${folder || ''}${studentId}`)

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao listar arquivos:', error)
      throw error
    }
  }
}
