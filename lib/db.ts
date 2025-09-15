import mysql from 'mysql2/promise';

// Configuração do banco de dados
export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Pool de conexões com o banco de dados
let connectionPool: mysql.Pool | null = null;

// Função para obter uma conexão do pool
export async function getConnection() {
  if (!connectionPool) {
    connectionPool = mysql.createPool(dbConfig);
  }
  return connectionPool;
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
