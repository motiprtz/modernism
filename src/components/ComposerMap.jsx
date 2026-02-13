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
  'לונדון': [0.1278, 51.5074],
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
  'קהיר': [31.2357, 30.0444],
  'ירושלים': [35.2137, 31.7683],
  'תל אביב': [34.7818, 32.0853],
  'בגדד': [44.3661, 33.3152],
  'טהרן': [51.3890, 35.6892],
  'דלהי': [77.1025, 28.7041],
  'בייג\'ינג': [116.4074, 39.9042],
  'טוקיו': [139.6503, 35.6762],
  'סיאול': [126.9780, 37.5665],
  'סידני': [151.2093, -33.8688],
  'ריו דה ז\'נרו': [-43.1729, -22.9068],
  'בואנוס איירס': [-58.3816, -34.6037],
  'מקסיקו סיטי': [-99.1332, 19.4326],
  'טורונטו': [-79.3832, 43.6532],
  'מונטריאול': [-73.5673, 45.5017],
  'שיקגו': [-87.6298, 41.8781],
  'לוס אנג\'לס': [-118.2437, 34.0522],
  'סן פרנסיסקו': [-122.4194, 37.7749],
  'בוסטון': [-71.0589, 42.3601],
  'פילדלפיה': [-75.1652, 39.9526],
  'וושינגטון': [-77.0369, 38.9072],
  'מיאמי': [-80.1918, 25.7617],
  'ניו אורלינס': [-90.0715, 29.9511],
  'סיאטל': [-122.3321, 47.6062],
  'דנוור': [-104.9903, 39.7392],
  'אוסטין': [-97.7431, 30.2672],
  'נאשוויל': [-86.7816, 36.1627],
  'אטלנטה': [-84.3880, 33.7490],
  'דטרויט': [-83.0458, 42.3314],
  'מינאפוליס': [-93.2650, 44.9778],
  'קנזס סיטי': [-94.5786, 39.0997],
  'דאלאס': [-96.7970, 32.7767],
  'יוסטון': [-95.3698, 29.7604],
  'פיניקס': [-112.0740, 33.4484],
  'לאס וגאס': [-115.1398, 36.1699],
  'סן דייגו': [-117.1611, 32.7157],
  'פורטלנד': [-122.6765, 45.5152],
  'סולט לייק סיטי': [-111.8910, 40.7608],
  'אלבקרקי': [-106.6504, 35.0844],
  'טוקסון': [-110.9747, 32.2226],
  'אל פאסו': [-106.4850, 31.7619],
  'אוקלהומה סיטי': [-97.5164, 35.4676],
  'ממפיס': [-90.0490, 35.1495],
  'לואיוויל': [-85.7585, 38.2527],
  'מילווקי': [-87.9065, 43.0389],
  'אינדיאנפוליס': [-86.1581, 39.7684],
  'קולומבוס': [-82.9988, 39.9612],
  'קליבלנד': [-81.6944, 41.4993],
  'צ\'ינסינטי': [-84.5120, 39.1031],
  'פיטסבורג': [-79.9959, 40.4406],
  'בפלו': [-78.8784, 42.8864],
  'רוצ\'סטר': [-77.6088, 43.1566],
  'אלבני': [-73.7562, 42.6526],
  'סיראקיוז': [-76.1474, 43.0481],
  'ניוארק': [-74.1724, 40.7357],
  'ג\'רזי סיטי': [-74.0776, 40.7178],
  'פטרסון': [-74.1718, 40.9168],
  'אליזבת': [-74.2107, 40.6640],
  'אדיסון': [-74.4121, 40.5187],
  'וודברידג\'': [-74.2846, 40.5576],
  'טרנטון': [-74.7429, 40.2206],
  'קמדן': [-75.1196, 39.9259],
  'פסאיק': [-74.1285, 40.8568],
  'יוניון סיטי': [-74.0235, 40.6976],
  'בייון': [-74.1141, 40.6687],
  'איסט אורנג\'': [-74.2049, 40.7673],
  'ברגנפילד': [-73.9976, 40.9276],
  'פרת\' אמבוי': [-74.2654, 40.5087],
  'ליידן': [-73.9990, 40.8651],
  'ניו ברונסוויק': [-74.4519, 40.4862],
  'פלנפילד': [-74.4074, 40.6337],
  'סאמרוויל': [-74.6099, 40.5687],
  'וויהוקן': [-74.0196, 40.7690],
  'הובוקן': [-74.0321, 40.7439],
  'גוטנברג': [-74.0099, 40.7926],
  'ווסט ניו יורק': [-74.0143, 40.7879],
  'נורת\' ברגן': [-74.0121, 40.8043],
  'פיירוויו': [-73.9982, 40.8126],
  'קליפסייד פארק': [-73.9876, 40.8215],
  'אדג\'ווטר': [-73.9757, 40.8276],
  'פורט לי': [-73.9701, 40.8509],
  'לאודון': [11.5820, 48.1351], // ברירת מחדל למיקומים לא ידועים
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

