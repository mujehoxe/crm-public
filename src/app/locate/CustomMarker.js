import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

export default function CustomMarker({ position, popupContent, children }) {
	const customIcon = L.divIcon({
		className: 'custom-component-marker',
		html: ReactDOMServer.renderToString(children),
		iconSize: [40, 40],
		iconAnchor: [20, 40],
		popupAnchor: [0, -40],
	});

	return (
		<Marker position={position} icon={customIcon}>
			{popupContent && <Popup>{popupContent}</Popup>}
		</Marker>
	);
};
