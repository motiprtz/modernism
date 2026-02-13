import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { composers } from '../data/timeline'
import './ComposerMap.css'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// מיקומים גיאוגרפיים של ערים מרכזיות
const cityCoordinates = {
  'ברלין': [13.4050, 52.5200],
  'וינה': [16.3738, 48.2082],
  'פריז': [2.3522, 48.8566],
  'לייפציג': [12.3731, 51.3397],
  'המבורג': [9.9937, 53.5511],
  'מינכן': [11.5820, 48.1351],
  'דרזדן': [13.7373, 51.0504],
  'בודפשט': [19.0402, 47.4979],
  'פראג': [14.4378, 50.0755],
  'מוסקבה': [37.6173, 55.7558],
  'סנט פטרבורג': [30.3351, 59.9343],
  'לונדון': [-0.1278, 51.5074],
  'מילאנו': [9.1900, 45.4642],
  'רומא': [12.4964, 41.9028],
  'ונציה': [12.3155, 45.4408],
  'ניו יורק': [-74.0060, 40.7128],
  'אמסטרדם': [4.9041, 52.3676],
  'קופנהגן': [12.5683, 55.6761],
  'סטוקהולם': [18.0686, 59.3293],
  'מדריד': [-3.7038, 40.4168],
  'ברצלונה': [2.1734, 41.3851],
  'ליסבון': [-9.1393, 38.7223],
  'וורשה': [21.0122, 52.2297],
  'קרקוב': [19.9450, 50.0647],
  'בוקרשט': [26.1025, 44.4268],
  'אתונה': [23.7275, 37.9838],
  'איסטנבול': [28.9784, 41.0082],
  'ברגן': [5.3221, 60.3913],
  'לוקה': [10.5027, 43.8376],
  'פרנקפורט': [8.6821, 50.1109],
};

// פונקציה למצוא קואורדינטות של עיר
const getCityCoordinates = (cityName) => {
  if (!cityName) return null;
  
  // נסה למצוא התאמה מדויקת
  if (cityCoordinates[cityName]) {
    return cityCoordinates[cityName];
  }
  
  // נסה למצוא התאמה חלקית
  const cityKey = Object.keys(cityCoordinates).find(key => 
    cityName.includes(key) || key.includes(cityName)
  );
  
  return cityKey ? cityCoordinates[cityKey] : null;
};

function ComposerMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [timeFilter, setTimeFilter] = useState({ start: 1800, end: 1950 });

  // קבץ מלחינים לפי עיר
  const composersByCity = useMemo(() => {
    const cityMap = new Map();
    
    composers.forEach(composer => {
      if (!composer.birthPlace) return;
      
      const city = composer.birthPlace;
      const coordinates = getCityCoordinates(city);
      
      if (!coordinates) return;
      
      // סנן לפי ציר זמן
      const birthYear = composer.years ? parseInt(composer.years.split('-')[0]) : null;
      if (birthYear && (birthYear < timeFilter.start || birthYear > timeFilter.end)) {
        return;
      }
      
      if (!cityMap.has(city)) {
        cityMap.set(city, {
          city,
          coordinates,
          composers: []
        });
      }
      
      cityMap.get(city).composers.push(composer);
    });
    
    return Array.from(cityMap.values());
  }, [timeFilter]);

  const handleMarkerClick = (cityData) => {
    setSelectedCity(cityData);
    setSelectedComposer(null);
  };

  const handleComposerClick = (composer) => {
    setSelectedComposer(composer);
  };

  return (
    <div className="composer-map-container">
      <div className="map-header">
        <h2>מפת מלחינים בעולם</h2>
        <p>לחץ על סמנים במפה כדי לראות מלחינים לפי מיקום</p>
      </div>

      <div className="map-controls">
        <div className="time-filter">
          <label>סנן לפי תקופה:</label>
          <div className="time-inputs">
            <input
              type="number"
              min="1800"
              max="1950"
              value={timeFilter.start}
              onChange={(e) => setTimeFilter({ ...timeFilter, start: parseInt(e.target.value) })}
            />
            <span>-</span>
            <input
              type="number"
              min="1800"
              max="1950"
              value={timeFilter.end}
              onChange={(e) => setTimeFilter({ ...timeFilter, end: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div className="map-stats">
          <span className="stat-badge">{composersByCity.length} ערים</span>
          <span className="stat-badge">
            {composersByCity.reduce((sum, city) => sum + city.composers.length, 0)} מלחינים
          </span>
        </div>
      </div>

      <div className="map-content">
        <div className="map-wrapper">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 400,
              center: [15, 50]
            }}
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E8E8E8"
                      stroke="#D6D6D6"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#CFD8DC', outline: 'none' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {composersByCity.map((cityData, index) => (
                <Marker
                  key={index}
                  coordinates={cityData.coordinates}
                  onClick={() => handleMarkerClick(cityData)}
                >
                  <g
                    className="map-marker"
                    style={{
                      cursor: 'pointer',
                      transform: selectedCity?.city === cityData.city ? 'scale(1.5)' : 'scale(1)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <circle
                      r={6}
                      fill="#667eea"
                      stroke="#fff"
                      strokeWidth={2}
                      opacity={0.9}
                    />
                    <text
                      textAnchor="middle"
                      y={-12}
                      style={{
                        fontFamily: 'system-ui',
                        fontSize: '10px',
                        fill: '#2d3748',
                        fontWeight: 'bold',
                        pointerEvents: 'none'
                      }}
                    >
                      {cityData.composers.length}
                    </text>
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {selectedCity && (
          <div className="city-details">
            <div className="city-header">
              <h3>{selectedCity.city}</h3>
              <button onClick={() => setSelectedCity(null)} className="close-btn">✕</button>
            </div>
            <p className="city-count">{selectedCity.composers.length} מלחינים</p>
            
            <div className="composers-list">
              {selectedCity.composers
                .sort((a, b) => {
                  const yearA = parseInt(a.years?.split('-')[0] || '0');
                  const yearB = parseInt(b.years?.split('-')[0] || '0');
                  return yearA - yearB;
                })
                .map((composer, idx) => (
                  <div
                    key={idx}
                    className={`composer-item ${selectedComposer?.name === composer.name ? 'selected' : ''}`}
                    onClick={() => handleComposerClick(composer)}
                  >
                    <div className="composer-name">{composer.name}</div>
                    <div className="composer-years">{composer.years}</div>
                    {composer.style && (
                      <div className="composer-style">{composer.style}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {selectedComposer && (
          <div className="composer-details">
            <div className="composer-detail-header">
              <h3>{selectedComposer.name}</h3>
              <button onClick={() => setSelectedComposer(null)} className="close-btn">✕</button>
            </div>
            <div className="composer-info">
              <p><strong>שנים:</strong> {selectedComposer.years}</p>
              {selectedComposer.nationality && (
                <p><strong>לאום:</strong> {selectedComposer.nationality}</p>
              )}
              {selectedComposer.style && (
                <p><strong>סגנון:</strong> {selectedComposer.style}</p>
              )}
              {selectedComposer.importance && (
                <div className="composer-importance">
                  <strong>חשיבות:</strong>
                  <p>{selectedComposer.importance}</p>
                </div>
              )}
              {selectedComposer.works && selectedComposer.works.length > 0 && (
                <div className="composer-works-detail">
                  <strong>יצירות מרכזיות:</strong>
                  <ul>
                    {selectedComposer.works.map((work, idx) => (
                      <li key={idx}>{work}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComposerMap;

