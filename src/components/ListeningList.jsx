import { useState, useMemo } from 'react'
import { compositions } from '../data/compositions'
import './ListeningList.css'

function ListeningList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComposer, setSelectedComposer] = useState('all')
  const [sortBy, setSortBy] = useState('composer') // 'composer', 'title', 'chronological'
  const [expandedItems, setExpandedItems] = useState(new Set())

  // קבץ יצירות לפי מלחין
  const compositionsByComposer = useMemo(() => {
    const composerMap = new Map()
    
    compositions.forEach(composition => {
      if (!composerMap.has(composition.composer)) {
        composerMap.set(composition.composer, [])
      }
      composerMap.get(composition.composer).push(composition)
    })
    
    // מיין מלחינים לפי סדר אלפביתי
    return Array.from(composerMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0], 'he'))
      .map(([composer, works]) => ({
        composer,
        works: works.sort((a, b) => a.title.localeCompare(b.title, 'he'))
      }))
  }, [])

  // סנן ומיין יצירות
  const filteredCompositions = useMemo(() => {
    let filtered = compositions

    // סינון לפי חיפוש
    if (searchTerm) {
      filtered = filtered.filter(comp =>
        comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.composer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.genre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // סינון לפי מלחין
    if (selectedComposer !== 'all') {
      filtered = filtered.filter(comp => comp.composer === selectedComposer)
    }

    // מיון
    switch (sortBy) {
      case 'composer':
        return filtered.sort((a, b) => {
          const composerCompare = a.composer.localeCompare(b.composer, 'he')
          if (composerCompare !== 0) return composerCompare
          return a.title.localeCompare(b.title, 'he')
        })
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title, 'he'))
      case 'chronological':
        // מיון כרונולוגי (אם יש מידע על שנה)
        return filtered.sort((a, b) => {
          const yearA = a.year || 9999
          const yearB = b.year || 9999
          return yearA - yearB
        })
      default:
        return filtered
    }
  }, [searchTerm, selectedComposer, sortBy])

  // רשימת מלחינים ייחודיים
  const composers = useMemo(() => {
    return [...new Set(compositions.map(c => c.composer))].sort((a, b) => 
      a.localeCompare(b, 'he')
    )
  }, [])

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const expandAll = () => {
    if (sortBy === 'composer') {
      setExpandedItems(new Set(compositionsByComposer.map((_, idx) => idx)))
    } else {
      setExpandedItems(new Set(filteredCompositions.map((_, idx) => idx)))
    }
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  return (
    <div className="listening-list-container">
      <div className="listening-header">
        <h2>רשימת האזנה</h2>
        <p>כל היצירות ממוינות לפי מלחין עם פירוט מלא</p>
        <div className="listening-stats">
          <div className="stat">
            <span className="stat-value">{compositions.length}</span>
            <span className="stat-label">יצירות</span>
          </div>
          <div className="stat">
            <span className="stat-value">{composers.length}</span>
            <span className="stat-label">מלחינים</span>
          </div>
        </div>
      </div>

      <div className="listening-controls">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="חיפוש יצירה, מלחין או ז'אנר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>מלחין:</label>
            <select 
              value={selectedComposer} 
              onChange={(e) => setSelectedComposer(e.target.value)}
            >
              <option value="all">כל המלחינים</option>
              {composers.map((composer, idx) => (
                <option key={idx} value={composer}>{composer}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>מיון:</label>
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value)
                setExpandedItems(new Set())
              }}
            >
              <option value="composer">לפי מלחין</option>
              <option value="title">לפי שם יצירה</option>
              <option value="chronological">כרונולוגי</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={expandAll}>➕ הרחב הכל</button>
          <button onClick={collapseAll}>➖ כווץ הכל</button>
        </div>
      </div>

      <div className="listening-content">
        {sortBy === 'composer' ? (
          // תצוגה מקובצת לפי מלחין
          <div className="composer-groups">
            {compositionsByComposer
              .filter(({ composer }) => 
                selectedComposer === 'all' || composer === selectedComposer
              )
              .filter(({ composer, works }) =>
                searchTerm === '' || 
                composer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                works.some(w => 
                  w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  w.genre.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((group, groupIdx) => {
                const isExpanded = expandedItems.has(groupIdx)
                const filteredWorks = searchTerm 
                  ? group.works.filter(w =>
                      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      w.genre.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  : group.works

                return (
                  <div key={groupIdx} className="composer-group">
                    <div 
                      className="composer-group-header"
                      onClick={() => toggleExpanded(groupIdx)}
                    >
                      <div className="composer-info">
                        <h3>{group.composer}</h3>
                        <span className="works-count">{filteredWorks.length} יצירות</span>
                      </div>
                      <button className="expand-icon">
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="works-list">
                        {filteredWorks.map((work, workIdx) => (
                          <div key={workIdx} className="work-item">
                            <div className="work-header">
                              <h4>{work.title}</h4>
                              <span className="work-genre">{work.genre}</span>
                            </div>
                            {work.structure && (
                              <div className="work-structure">
                                <strong>מבנה:</strong>
                                <p>{work.structure}</p>
                              </div>
                            )}
                            {work.movements && work.movements.length > 0 && (
                              <div className="work-movements">
                                <strong>פרקים:</strong>
                                <div className="movements-grid">
                                  {work.movements.map((movement, mvtIdx) => (
                                    <div key={mvtIdx} className="movement-item">
                                      <span className="movement-number">פרק {mvtIdx + 1}</span>
                                      {movement.title && (
                                        <span className="movement-title">{movement.title}</span>
                                      )}
                                      {movement.description && (
                                        <p className="movement-desc">{movement.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        ) : (
          // תצוגה רגילה (לפי כותרת או כרונולוגי)
          <div className="works-grid">
            {filteredCompositions.map((work, idx) => {
              const isExpanded = expandedItems.has(idx)
              
              return (
                <div key={idx} className="work-card">
                  <div 
                    className="work-card-header"
                    onClick={() => toggleExpanded(idx)}
                  >
                    <div className="work-main-info">
                      <h3>{work.title}</h3>
                      <div className="work-meta">
                        <span className="composer-name">🎼 {work.composer}</span>
                        <span className="genre-name">🎭 {work.genre}</span>
                      </div>
                    </div>
                    <button className="expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="work-card-details">
                      {work.structure && (
                        <div className="work-structure">
                          <strong>מבנה:</strong>
                          <p>{work.structure}</p>
                        </div>
                      )}
                      {work.movements && work.movements.length > 0 && (
                        <div className="work-movements">
                          <strong>פרקים:</strong>
                          <div className="movements-grid">
                            {work.movements.map((movement, mvtIdx) => (
                              <div key={mvtIdx} className="movement-item">
                                <span className="movement-number">פרק {mvtIdx + 1}</span>
                                {movement.title && (
                                  <span className="movement-title">{movement.title}</span>
                                )}
                                {movement.description && (
                                  <p className="movement-desc">{movement.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {filteredCompositions.length === 0 && (
          <div className="no-results">
            <p>לא נמצאו יצירות עבור החיפוש שלך</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListeningList

