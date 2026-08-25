  import { useState, useEffect } from 'react'
  import { Navigate, useNavigate } from 'react-router-dom'

  function AdminPanel() {
    const token = localStorage.getItem('accessToken')
    const navigate = useNavigate()
    const [cities, setCities] = useState(null)
    const [newCity, setNewCity] = useState({
      oldName: '', newName: '', lore: '', image: '', departement: '', tier: 'prefecture', lat: '', lng: '',
    })

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

      const res = await fetch('http://localhost:5000/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const createdCity = await res.json()
        setCities(prev => [...prev, createdCity])
        setNewCity({ oldName: '', newName: '', lore: '', image: '', departement: '', tier: 'prefecture', lat: '', lng: '' })
      }
    }

    async function handleDelete(id) {
      const res = await fetch(`http://localhost:5000/api/cities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setCities(prev => prev.filter(city => city._id !== id))
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
            {cities.map(city => (
              <li key={city._id}>
                {city.newName}
                <button onClick={() => handleDelete(city._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddCity}>
          <input
            placeholder="Old name"
            value={newCity.oldName}
            onChange={(e) => setNewCity({ ...newCity, oldName: e.target.value })}
          />
          <input
            placeholder="New name"
            value={newCity.newName}
            onChange={(e) => setNewCity({ ...newCity, newName: e.target.value })}
          />
          <input
            placeholder="Lore"
            value={newCity.lore}
            onChange={(e) => setNewCity({ ...newCity, lore: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={newCity.image}
            onChange={(e) => setNewCity({ ...newCity, image: e.target.value })}
          />
          <input
            placeholder="Département code"
            value={newCity.departement}
            onChange={(e) => setNewCity({ ...newCity, departement: e.target.value })}
          />
          <select
            value={newCity.tier}
            onChange={(e) => setNewCity({ ...newCity, tier: e.target.value })}
          >
            <option value="prefecture">Prefecture</option>
            <option value="small">Small</option>
          </select>
          <input
            placeholder="Latitude"
            value={newCity.lat}
            onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })}
          />
          <input
            placeholder="Longitude"
            value={newCity.lng}
            onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })}
          />
          <button type="submit">Add city</button>
        </form>
      </div>
    )
  }

  export default AdminPanel
