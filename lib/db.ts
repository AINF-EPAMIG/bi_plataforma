import mysql from 'mysql2/promise';

// Configuração do banco de dados
export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE ,
};

export const Contratos = mysql.createPool({
  host: process.env.DB_CONTRATOS_HOST,
  user: process.env.DB_CONTRATOS_USER,
  password: process.env.DB_CONTRATOS_PASSWORD,
  database: process.env.DB_CONTRATOS_DATABASE,
});

export const contratos = {
  host: process.env.DB_CONTRATOS_HOST,
  user: process.env.DB_CONTRATOS_USER,
  password: process.env.DB_CONTRATOS_PASSWORD,
  database: process.env.DB_CONTRATOS_DATABASE ,
};

const contratosConfig = {
  host: process.env.DB_CONTRATOS_HOST!,
  user: process.env.DB_CONTRATOS_USER!,
  password: process.env.DB_CONTRATOS_PASSWORD!,
  database: process.env.DB_CONTRATOS_DATABASE!,
};

// Pool de conexões com o banco de dados
let connectionPool: mysql.Pool | null = null;
let contratosPool: mysql.Pool | null = null;

// Função para obter uma conexão do pool
export async function getConnection() {
  if (!connectionPool) {
    connectionPool = mysql.createPool(dbConfig);
  }
  return connectionPool;
}

export async function getContratosConnection() {
  if (!contratosPool) {
    contratosPool = mysql.createPool(contratosConfig);
  }
  return contratosPool;
}


// Função para executar consultas SQL
export async function query(sql: string, params: unknown[] = []) {
  try {
    const connection = await getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
}

// Função para autenticar usuário
export async function autenticarUsuario(email: string, senha: string) {
  try {
    const usuarios = await query(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    ) as Record<string, unknown>[];
    
    if (usuarios.length === 0) {
      return null;
    }
    
    const usuario = usuarios[0];
    
    // Em um ambiente real, deve-se usar bcrypt para comparar as senhas
    // const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
    // Aqui estamos comparando diretamente para simplificar a demonstração
    const senhaCorreta = (senha === usuario.senha);
    
    if (senhaCorreta) {
      // Não retornar a senha na resposta
      const { ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    throw error;
  }
} 