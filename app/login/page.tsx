import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Exemplo de Conexão MySQL',
  description: 'Exemplo de autenticação usando MySQL com Next.js',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Sistema de Demonstração
          </h1>
          <p className="text-gray-600">
            Acesse com suas credenciais
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Demonstração de conexão MySQL com Next.js
          </p>
        </div>
      </div>
    </div>
  );
} 