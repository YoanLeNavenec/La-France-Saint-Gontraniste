import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import authFetch from '../utils/authFetch'

function AdminPanel() {
  const token = localStorage.getItem('accessToken')
  const navigate = useNavigate()
  const [cities, setCities] = useState(null)
  const [newCity, setNewCity] = useState({
    oldName: '', newName: '', lore: '', image: '', departement: '', tier: 'prefecture', lat: '', lng: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetch('http://localhost:5000/api/cities')
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
      oldName: newCity.oldName,
      newName: newCity.newName,
      lore: newCity.lore,
      image: newCity.image,
      departement: newCity.departement,
      tier: newCity.tier,
      position: [parseFloat(newCity.lat), parseFloat(newCity.lng)],
    }

    const res = await authFetch('http://localhost:5000/api/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const createdCity = await res.json()
      setCities(prev => [...prev, createdCity])
      setNewCity({ oldName: '', newName: '', lore: '', image: '', departement: '', tier: 'prefecture', lat: '', lng: '' })
    }
  }

  async function handleDelete(id) {
    const res = await authFetch(`http://localhost:5000/api/cities/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setCities(prev => prev.filter(city => city._id !== id))
    }
  }

  function handleEditClick(city) {
    setEditingId(city._id)
    setEditForm({
      oldName: city.oldName,
      newName: city.newName,
      lore: city.lore,
      image: city.image,
      departement: city.departement,
      tier: city.tier,
      lat: city.position[0],
      lng: city.position[1],
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(id) {
    const body = {
      oldName: editForm.oldName,
      newName: editForm.newName,
      lore: editForm.lore,
      image: editForm.image,
      departement: editForm.departement,
      tier: editForm.tier,
      position: [parseFloat(editForm.lat), parseFloat(editForm.lng)],
    }

    const res = await authFetch(`http://localhost:5000/api/cities/${id}`, {
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
    <div>
      <h1>Admin panel</h1>
      <button onClick={handleLogout}>Log out</button>

      {cities && (
        <ul>
          {cities.map(city =>
            editingId === city._id ? (
              <li key={city._id}>
                <input value={editForm.oldName} onChange={(e) => setEditForm({ ...editForm, oldName: e.target.value })} />
                <input value={editForm.newName} onChange={(e) => setEditForm({ ...editForm, newName: e.target.value })} />
                <input value={editForm.lore} onChange={(e) => setEditForm({ ...editForm, lore: e.target.value })} />
                <input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                <input value={editForm.departement} onChange={(e) => setEditForm({ ...editForm, departement: e.target.value })} />
                <select value={editForm.tier} onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}>
                  <option value="prefecture">Prefecture</option>
                  <option value="small">Small</option>
                </select>
                <input value={editForm.lat} onChange={(e) => setEditForm({ ...editForm, lat: e.target.value })} />
                <input value={editForm.lng} onChange={(e) => setEditForm({ ...editForm, lng: e.target.value })} />
                <button onClick={() => handleSaveEdit(city._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </li>
            ) : (
              <li key={city._id}>
                {city.newName}
                <button onClick={() => handleEditClick(city)}>Edit</button>
                <button onClick={() => handleDelete(city._id)}>Delete</button>
              </li>
            )
          )}
        </ul>
      )}

      <form onSubmit={handleAddCity}>
        <input placeholder="Old name" value={newCity.oldName} onChange={(e) => setNewCity({ ...newCity, oldName: e.target.value })} />
        <input placeholder="New name" value={newCity.newName} onChange={(e) => setNewCity({ ...newCity, newName: e.target.value })} />
        <input placeholder="Lore" value={newCity.lore} onChange={(e) => setNewCity({ ...newCity, lore: e.target.value })} />
        <input placeholder="Image URL" value={newCity.image} onChange={(e) => setNewCity({ ...newCity, image: e.target.value })} />
        <input placeholder="DÃ©partement code" value={newCity.departement} onChange={(e) => setNewCity({ ...newCity, departement: e.target.value })} />
        <select value={newCity.tier} onChange={(e) => setNewCity({ ...newCity, tier: e.target.value })}>
          <option value="prefecture">Prefecture</option>
          <option value="small">Small</option>
        </select>
        <input placeholder="Latitude" value={newCity.lat} onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })} />
        <input placeholder="Longitude" value={newCity.lng} onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })} />
        <button type="submit">Add city</button>
      </form>
    </div>
  )
}

export default AdminPanel
