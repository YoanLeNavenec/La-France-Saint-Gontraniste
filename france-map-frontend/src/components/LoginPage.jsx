import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminPanel.css'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError('Identifiants invalides')
        return
      }

      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate('/admin')
    } catch (err) {
      setError('Une erreur est survenue')
    }
  }

  return (
    <div className='admin-page'>
      <h1 className='admin-title'>Connexion Administrateur</h1>
      <div className='paper-sheet'>
        <h2>Se connecter</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className='btn btn-primary'>Se connecter</button>
          {error && <p className='login-error'>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginPage