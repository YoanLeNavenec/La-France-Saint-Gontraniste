import { latLng } from 'leaflet';
import {MapContainer, TileLayer} from 'react-leaflet'

function FranceMap(){
  const franceBounds = [latLng(41.0, -5.5),latLng(51.5,9.7)]
  return(
<MapContainer style={{height:'100vh', width:'100%'}} center={[46.6, 2.4]} zoom={6} minZoom={5} maxZoom={12} maxBounds={franceBounds}>
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    attribution="&copy; OpenStreetMap contributors &copy; CARTO"
  />
</MapContainer>
  );
}
export default FranceMap;