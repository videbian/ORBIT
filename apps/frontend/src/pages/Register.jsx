import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Usuário criado com sucesso! Redirecionando para login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erro ao criar usuário');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (role) => {
    const demoUsers = {
      admin: {
        email: 'admin@orbit.com',
        name: 'Administrador ORBIT',
        role: 'admin'
      },
      client: {
        email: 'cliente@orbit.com',
        name: 'Cliente Exemplo',
        role: 'client'
      },
      partner: {
        email: 'parceiro@orbit.com',
        name: 'Parceiro Estratégico',
        role: 'partner'
      },
      backoffice: {
        email: 'backoffice@orbit.com',
        name: 'Operador Backoffice',
        role: 'backoffice'
      }
    };

    setFormData({
      ...demoUsers[role],
      password: `${role}123`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">ORBIT IA</h2>
          <p className="mt-2 text-gray-600">Criar nova conta</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sua senha"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Perfil
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="client">Cliente</option>
                <option value="partner">Parceiro</option>
                <option value="admin">Administrador</option>
                <option value="backoffice">Backoffice</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Fazer login
              </a>
            </p>
          </div>
        </div>

        {/* Usuários de Demonstração */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usuários de Demonstração</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemoUser('admin')}
              className="p-3 text-left border border-purple-200 rounded-lg hover:bg-purple-50 transition duration-200"
            >
              <div className="font-medium text-purple-900">Administrador</div>
              <div className="text-sm text-purple-600">admin@orbit.com</div>
            </button>
            
            <button
              type="button"
              onClick={() => fillDemoUser('client')}
              className="p-3 text-left border border-blue-200 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              <div className="font-medium text-blue-900">Cliente</div>
              <div className="text-sm text-blue-600">cliente@orbit.com</div>
            </button>
            
            <button
              type="button"
              onClick={() => fillDemoUser('partner')}
              className="p-3 text-left border border-green-200 rounded-lg hover:bg-green-50 transition duration-200"
            >
              <div className="font-medium text-green-900">Parceiro</div>
              <div className="text-sm text-green-600">parceiro@orbit.com</div>
            </button>
            
            <button
              type="button"
              onClick={() => fillDemoUser('backoffice')}
              className="p-3 text-left border border-orange-200 rounded-lg hover:bg-orange-50 transition duration-200"
            >
              <div className="font-medium text-orange-900">Backoffice</div>
              <div className="text-sm text-orange-600">backoffice@orbit.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

