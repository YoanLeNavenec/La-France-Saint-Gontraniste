import { useState } from 'react'
import { latLng } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'

function FranceMap() {
  const [cities, setCities] = useState([
    { id: 1, position: [43.6047, 1.4442], oldName: 'Toulouse', newName: 'Saint-Gontan de la Rôse', lore: '', image:'' },
    { id: 2, position: [45.7640, 4.8357], oldName: 'Lyon', newName: 'Saint-Gontran le Gastronome', lore: '', image:'' },
    { id: 3, position: [47.0873, -1.2814], oldName: 'Clisson', newName: 'Saint-Ethis du Grand Métal', lore: '', image:'' },
  ])

  const franceBounds = [latLng(41.3, -5.0), latLng(51.1, 8.3)]

  return (
    <MapContainer style={{ height: '100vh', width: '100%' }} bounds={franceBounds} minZoom={6} maxZoom={12} maxBounds={franceBounds}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
      />
      {cities.map(city => (
        <Marker key={city.id} position={city.position}>
          <Tooltip>{city.newName}</Tooltip>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '4px 0' }}>{city.newName}</h3>
              <p style={{ fontStyle: 'italic', color: '#666', margin: '0 0 8px' }}>
                Anciennement {city.oldName}
              </p>
              {city.image && (
                <img src={city.image} alt={city.newName} style={{ width: '100%', borderRadius: '4px' }} />
              )}
              <p>{city.lore}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default FranceMap