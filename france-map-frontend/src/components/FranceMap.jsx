import { useState, useEffect, useRef } from 'react'
import { latLng, divIcon } from 'leaflet'
import { MapContainer, GeoJSON, Marker, Tooltip, useMapEvents } from 'react-leaflet'
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

function ZoomWatcher({ onZoomChange, onMapReady }) {
  const map = useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
  })

  useEffect(() => {
    onMapReady(map)
  }, [map])

  return null
}

function FranceMap() {
  const [cities, setCities] = useState([
    { id: 1, position: [43.6047, 1.4442], oldName: 'Toulouse', newName: 'Saint-Gontan de la Rôse', lore: '', image: '', departement: '31', tier: 'prefecture' },
    { id: 2, position: [45.7640, 4.8357], oldName: 'Lyon', newName: 'Saint-Gontran le Gastronome', lore: '', image: '', departement: '69', tier: 'prefecture' },
    { id: 3, position: [47.0873, -1.2814], oldName: 'Clisson', newName: 'Saint-Ethis du Grand Métal', lore: '', image: '', departement: '44', tier: 'small' },
    { id: 4, position: [44.435, 2.515], oldName: 'Lieu_dit Montredon', newName: 'Saint-Gontran sur Créneaux', lore: '', image: '', departement: '12', tier: 'small' },
  ])

  const ZOOM_THRESHOLD = 7.5
  const [currentZoom, setCurrentZoom] = useState(6)
  const currentZoomRef = useRef(6)
  const isZoomedIn = currentZoom >= ZOOM_THRESHOLD
  const [regions, setRegions] = useState(null)
  const [departements, setDepartements] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [activeDepartement, setActiveDepartement] = useState(null)

  const mapRef = useRef(null)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson')
      .then(res => res.json())
      .then(data => setRegions(data))
  }, [])

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson')
      .then(res => res.json())
      .then(data => setDepartements(data))
  }, [])

  const franceBounds = [latLng(41.3, -5.0), latLng(51.1, 8.3)]

  function flyToLayer(layer, onClick) {
    layer.on('click', () => {
      mapRef.current.flyToBounds(layer.getBounds(), { padding: [20, 20], duration: 1, maxZoom: 9 })
      if (onClick) onClick()
    })
  }

  return (
    <div className='map-page'>
      <h1 className='map-title'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
      <div className='map-document'>
        <div className='map-frame'>
          <MapContainer className='map-container' bounds={franceBounds} zoomSnap={0.1} minZoom={6} maxZoom={12} maxBounds={franceBounds}>
            <ZoomWatcher
              onZoomChange={(zoom) => {
                setCurrentZoom(zoom)
                currentZoomRef.current = zoom
              }}
              onMapReady={(map) => { mapRef.current = map }}
            />
            {regions && (
              <GeoJSON
                key={`regions-${isZoomedIn}`}
                data={regions}
                style={{ color: '#6b46c1', weight: 1, fillColor: '#ead9b0', fillOpacity: isZoomedIn ? 0 : 1 }}
                interactive={!isZoomedIn}
                onEachFeature={(feature, layer) => {
                  layer.on('mouseover', () => layer.setStyle({ fillColor: '#ede9fe', fillOpacity: 0.6 }))
                  layer.on('mouseout', () => {
                    const opacity = currentZoomRef.current >= ZOOM_THRESHOLD ? 0 : 1
                    layer.setStyle({ fillColor: '#ead9b0', fillOpacity: opacity })
                  })
                  flyToLayer(layer, () => setActiveDepartement(null))
                }}
              />
            )}
            {departements && (
              <GeoJSON
                key={`departements-${isZoomedIn}`}
                data={departements}
                style={{ color: '#6b46c1', weight: 1, dashArray: '3', fillColor: '#ffffff', fillOpacity: 0, opacity: isZoomedIn ? 1 : 0}}
                interactive={isZoomedIn}
                onEachFeature={(feature, layer) => { 
                  flyToLayer(layer, () => setActiveDepartement(feature.properties.code)) }}
              />
            )}
            {cities
              .filter(city => city.tier === 'prefecture' || (isZoomedIn && city.departement === activeDepartement))
              .map(city => (
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
    </div>
  )
}

export default FranceMap