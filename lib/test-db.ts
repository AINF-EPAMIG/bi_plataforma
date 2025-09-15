import { query } from '@/lib/db';

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    // Testar se a conexão funciona
    const tables = await query('SHOW TABLES');
    console.log('✅ Conexão bem-sucedida!');
    console.log('📋 Tabelas encontradas:', tables);
    
    // Verificar estrutura da tabela usuarios
    const usuariosStructure = await query('DESCRIBE usuarios');
    console.log('👤 Estrutura da tabela usuarios:', usuariosStructure);
    
    // Contar registros
    const count = await query('SELECT COUNT(*) as total FROM usuarios');
    console.log('📊 Total de usuários:', count);
    
    // Verificar tipos de usuário
    const tipos = await query('SELECT tipo, COUNT(*) as quantidade FROM usuarios WHERE status = 1 GROUP BY tipo');
    console.log('📈 Usuários por tipo:', tipos);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  }
}

export { testDatabase };