import { useState, useEffect } from 'react'
import { latLng, divIcon } from 'leaflet'
import { MapContainer, GeoJSON, Marker, Tooltip } from 'react-leaflet'
import './FranceMap.css'

const purpleIcon = divIcon({
  className: 'shield-marker',
  html: `<svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" fill="#7F2EDC" stroke="#fff" stroke-width="1.5"/>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

const selectedIcon = divIcon({
  className: 'shield-marker shield-marker-selected',
  html: `<svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" fill="#f6c945" stroke="#fff" stroke-width="1.5"/>
  </svg>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
})

function FranceMap() {
  const [cities, setCities] = useState([
    { id: 1, position: [43.6047, 1.4442], oldName: 'Toulouse', newName: 'Saint-Gontan de la Rôse', lore: '', image: '' },
    { id: 2, position: [45.7640, 4.8357], oldName: 'Lyon', newName: 'Saint-Gontran le Gastronome', lore: '', image: '' },
    { id: 3, position: [47.0873, -1.2814], oldName: 'Clisson', newName: 'Saint-Ethis du Grand Métal', lore: '', image: '' },
  ])

  const [regions, setRegions] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson')
      .then(res => res.json())
      .then(data => setRegions(data))
  }, [])

  const franceBounds = [latLng(41.3, -5.0), latLng(51.1, 8.3)]

  return (
    <div className='map-page'>
      <div className='map-frame'>
        <MapContainer className='map-container' bounds={franceBounds} zoomSnap={0.1} minZoom={6} maxZoom={12} maxBounds={franceBounds}>
          {regions && (
            <GeoJSON
              data={regions}
              style={{ color: '#6b46c1', weight: 1, fillColor: '#ffffff', fillOpacity: 1 }}
              onEachFeature={(feature, layer) => {
                layer.on('mouseover', () => layer.setStyle({ fillColor: '#ede9fe', fillOpacity: 0.6 }))
                layer.on('mouseout', () => layer.setStyle({ fillColor: '#ffffff', fillOpacity: 1 }))
              }}
            />
          )}
          {cities.map(city => (
            <Marker
              key={city.id}
              position={city.position}
              icon={selectedCity?.id === city.id ? selectedIcon : purpleIcon}
              eventHandlers={{ click: () => setSelectedCity(city) }}
            >
              <Tooltip>{city.newName}</Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className='info-panel'>
        {selectedCity ? (
          <div className='map-popup'>
            <h3 className='popup-title'>{selectedCity.newName}</h3>
            <p className='popup-subtitle'>Anciennement {selectedCity.oldName}</p>
            {selectedCity.image && (
              <img src={selectedCity.image} alt={selectedCity.newName} className='popup-image' />
            )}
            <p>{selectedCity.lore}</p>
          </div>
        ) : (
          <p className='info-placeholder'>Cliquez sur une ville pour voir son histoire.</p>
        )}
      </div>
    </div>
  )
}

export default FranceMap