import { useState, useMemo } from 'react'
import { concepts } from '../data/concepts'
import './Flashcards.css'

function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [masteredCards, setMasteredCards] = useState(new Set())
  const [studyMode, setStudyMode] = useState('all') // 'all', 'unmastered', 'mastered'

  // Filter concepts based on search and study mode
  const filteredConcepts = useMemo(() => {
    let filtered = concepts.filter(concept => {
      const matchesSearch = searchTerm === '' || 
        concept.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    if (studyMode === 'unmastered') {
      filtered = filtered.filter((_, idx) => !masteredCards.has(idx));
    } else if (studyMode === 'mastered') {
      filtered = filtered.filter((_, idx) => masteredCards.has(idx));
    }

    return filtered;
  }, [searchTerm, studyMode, masteredCards]);

  const currentConcept = filteredConcepts[currentIndex] || concepts[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredConcepts.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredConcepts.length) % filteredConcepts.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    const originalIndex = concepts.indexOf(currentConcept);
    const newMastered = new Set(masteredCards);
    
    if (newMastered.has(originalIndex)) {
      newMastered.delete(originalIndex);
    } else {
      newMastered.add(originalIndex);
    }
    
    setMasteredCards(newMastered);
  };

  const handleShuffle = () => {
    setCurrentIndex(Math.floor(Math.random() * filteredConcepts.length));
    setIsFlipped(false);
  };

  const progress = filteredConcepts.length > 0 
    ? ((currentIndex + 1) / filteredConcepts.length) * 100 
    : 0;

  const masteredCount = masteredCards.size;
  const totalCount = concepts.length;

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h2>כרטיסיות מושגים</h2>
        <p>למד את המושגים החשובים למבחן</p>
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-value">{masteredCount}</span>
            <span className="stat-label">מושגים שנשלטו</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalCount - masteredCount}</span>
            <span className="stat-label">נותרו ללימוד</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">סה"כ מושגים</span>
          </div>
        </div>
      </div>

      <div className="flashcards-controls">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="חיפוש מושג..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mode-buttons">
          <button 
            className={studyMode === 'all' ? 'active' : ''}
            onClick={() => {
              setStudyMode('all');
              setCurrentIndex(0);
            }}
          >
            כל המושגים ({totalCount})
          </button>
          <button 
            className={studyMode === 'unmastered' ? 'active' : ''}
            onClick={() => {
              setStudyMode('unmastered');
              setCurrentIndex(0);
            }}
          >
            טרם נשלטו ({totalCount - masteredCount})
          </button>
          <button 
            className={studyMode === 'mastered' ? 'active' : ''}
            onClick={() => {
              setStudyMode('mastered');
              setCurrentIndex(0);
            }}
          >
            נשלטו ({masteredCount})
          </button>
        </div>

        <button 
          className="view-toggle"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? '📇 תצוגת כרטיסיה' : '📋 תצוגת רשימה'}
        </button>
      </div>

      {!showAll ? (
        <div className="flashcard-view">
          {filteredConcepts.length > 0 ? (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="card-counter">
                כרטיסיה {currentIndex + 1} מתוך {filteredConcepts.length}
              </div>

              <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-front">
                    <div className="card-label">מושג</div>
                    <div className="card-content">
                      <h3>{currentConcept.term}</h3>
                    </div>
                    <div className="flip-hint">לחץ להיפוך ⤵️</div>
                  </div>
                  <div className="flashcard-back">
                    <div className="card-label">הגדרה</div>
                    <div className="card-content">
                      <div className="definition-section">
                        <strong>הגדרה קצרה:</strong>
                        <p>{currentConcept.definition}</p>
                      </div>
                      {currentConcept.description && (
                        <div className="description-section">
                          <strong>הרחבה:</strong>
                          <p>{currentConcept.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flip-hint">לחץ לחזרה ⤴️</div>
                  </div>
                </div>
              </div>

              <div className="flashcard-actions">
                <button onClick={handlePrevious} className="nav-button">
                  ⏮️ הקודם
                </button>
                <button 
                  onClick={handleMastered}
                  className={`mastered-button ${masteredCards.has(concepts.indexOf(currentConcept)) ? 'active' : ''}`}
                >
                  {masteredCards.has(concepts.indexOf(currentConcept)) ? '✅ נשלט' : '⭐ סמן כנשלט'}
                </button>
                <button onClick={handleShuffle} className="shuffle-button">
                  🔀 ערבב
                </button>
                <button onClick={handleNext} className="nav-button">
                  הבא ⏭️
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>לא נמצאו מושגים עבור החיפוש שלך</p>
            </div>
          )}
        </div>
      ) : (
        <div className="list-view">
          <div className="concepts-grid">
            {filteredConcepts.map((concept, index) => {
              const originalIndex = concepts.indexOf(concept);
              const isMastered = masteredCards.has(originalIndex);
              
              return (
                <div 
                  key={index} 
                  className={`concept-card ${isMastered ? 'mastered' : ''}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowAll(false);
                    setIsFlipped(false);
                  }}
                >
                  <div className="concept-header">
                    <h4>{concept.term}</h4>
                    <button
                      className="mastered-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newMastered = new Set(masteredCards);
                        if (newMastered.has(originalIndex)) {
                          newMastered.delete(originalIndex);
                        } else {
                          newMastered.add(originalIndex);
                        }
                        setMasteredCards(newMastered);
                      }}
                    >
                      {isMastered ? '✅' : '⭐'}
                    </button>
                  </div>
                  <div className="concept-definition">
                    <strong>הגדרה:</strong>
                    <p>{concept.definition}</p>
                  </div>
                  {concept.description && (
                    <div className="concept-description">
                      <strong>הרחבה:</strong>
                      <p>{concept.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Flashcards;

