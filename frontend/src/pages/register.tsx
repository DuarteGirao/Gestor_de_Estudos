import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerService } from '../services/authService';
import { Link } from 'react-router-dom';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
        await registerService(nome, email, password);
        setSuccessMessage('Registro realizado com sucesso!');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    } catch (err) {
      setError('Erro ao registrar usuário.');
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h1>Registo</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      <button type="submit">Registar</button>
    </form>
    <p>Já tens conta? <Link to="/login">Faz login aqui</Link></p>
    </>
  );
}

export default Register;