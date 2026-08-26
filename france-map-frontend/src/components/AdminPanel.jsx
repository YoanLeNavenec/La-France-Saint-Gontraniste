import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import authFetch from '../utils/authFetch'
import './AdminPanel.css'

function AdminPanel() {
  const token = localStorage.getItem('accessToken')
  const navigate = useNavigate()
  const [cities, setCities] = useState(null)
  const [newCity, setNewCity] = useState({
    oldName: '', newName: '', lore: '', image: '', departement: '', tier: 'region', lat: '', lng: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cities`)
      .then(res => res.json())
      .then(data => setCities(data))
  }, [])

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  async function handleAddCity(e) {
    e.preventDefault()
    const body = {
      oldName: newCity.oldName, newName: newCity.newName, lore: newCity.lore, image: newCity.image,
      departement: newCity.departement, tier: newCity.tier,
      position: [parseFloat(newCity.lat), parseFloat(newCity.lng)],
    }
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const createdCity = await res.json()
      setCities(prev => [...prev, createdCity])
      setNewCity({ oldName: '', newName: '', lore: '', image: '', departement: '', tier: 'region', lat: '', lng: '' })
    }
  }

  async function handleDelete(id) {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cities/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCities(prev => prev.filter(city => city._id !== id))
    }
  }

  function handleEditClick(city) {
    setEditingId(city._id)
    setEditForm({
      oldName: city.oldName, newName: city.newName, lore: city.lore, image: city.image,
      departement: city.departement, tier: city.tier, lat: city.position[0], lng: city.position[1],
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(id) {
    const body = {
      oldName: editForm.oldName, newName: editForm.newName, lore: editForm.lore, image: editForm.image,
      departement: editForm.departement, tier: editForm.tier,
      position: [parseFloat(editForm.lat), parseFloat(editForm.lng)],
    }
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const updatedCity = await res.json()
      setCities(prev => prev.map(city => (city._id === id ? updatedCity : city)))
      setEditingId(null)
    }
  }

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className='admin-page'>
      <h1 className='admin-title'>Panneau d'administration</h1>
      <button className='btn btn-secondary logout-btn' onClick={handleLogout}>Se déconnecter</button>

      <div className='paper-sheet'>
        <h2>Villes existantes</h2>
        {cities && (
          <ul className='city-list'>
            {cities.map(city =>
              editingId === city._id ? (
                <li key={city._id} className='editing'>
                  <input value={editForm.oldName} onChange={(e) => setEditForm({ ...editForm, oldName: e.target.value })} />
                  <input value={editForm.newName} onChange={(e) => setEditForm({ ...editForm, newName: e.target.value })} />
                  <input value={editForm.lore} onChange={(e) => setEditForm({ ...editForm, lore: e.target.value })} />
                  <input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                  <input value={editForm.departement} onChange={(e) => setEditForm({ ...editForm, departement: e.target.value })} />
                  <select value={editForm.tier} onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}>
                    <option value="region">Région</option>
                    <option value="small">Small</option>
                  </select>
                  <input value={editForm.lat} onChange={(e) => setEditForm({ ...editForm, lat: e.target.value })} />
                  <input value={editForm.lng} onChange={(e) => setEditForm({ ...editForm, lng: e.target.value })} />
                  <div className='btn-row'>
                    <button className='btn btn-primary' onClick={() => handleSaveEdit(city._id)}>Sauvegarder</button>
                    <button className='btn btn-secondary' onClick={handleCancelEdit}>Annuler</button>
                  </div>
                </li>
              ) : (
                <li key={city._id}>
                  <span>{city.newName}</span>
                  <div className='btn-row'>
                    <button className='btn btn-secondary' onClick={() => handleEditClick(city)}>Modifier</button>
                    <button className='btn btn-danger' onClick={() => handleDelete(city._id)}>Supprimer</button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <div className='paper-sheet'>
        <h2>Ajouter une ville</h2>
        <form onSubmit={handleAddCity}>
          <input placeholder="Ancien nom" value={newCity.oldName} onChange={(e) => setNewCity({ ...newCity, oldName: e.target.value })} />
          <input placeholder="Nouveau nom" value={newCity.newName} onChange={(e) => setNewCity({ ...newCity, newName: e.target.value })} />
          <input placeholder="Lore" value={newCity.lore} onChange={(e) => setNewCity({ ...newCity, lore: e.target.value })} />
          <input placeholder="URL de l'image" value={newCity.image} onChange={(e) => setNewCity({ ...newCity, image: e.target.value })} />
          <input placeholder="Code département" value={newCity.departement} onChange={(e) => setNewCity({ ...newCity, departement: e.target.value })} />
          <select value={newCity.tier} onChange={(e) => setNewCity({ ...newCity, tier: e.target.value })}>
            <option value="region">Région</option>
            <option value="small">Small</option>
          </select>
          <input placeholder="Latitude" value={newCity.lat} onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })} />
          <input placeholder="Longitude" value={newCity.lng} onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })} />
          <button type="submit" className='btn btn-primary'>Ajouter la ville</button>
        </form>
      </div>
    </div>
  )
}

export default AdminPanel