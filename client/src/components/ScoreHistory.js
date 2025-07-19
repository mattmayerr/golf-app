import React, { useState, useMemo } from 'react';
import html2canvas from 'html2canvas';

function convertRoundsToCSV(rounds) {
  if (!rounds.length) return '';
  const headers = [
    'Course Name', 'Date', 'Scores', 'Pars', 'Total Score', 'Total Par', 'Over/Under Par'
  ];
  const rows = rounds.map(round => {
    const totalScore = round.scores.reduce((a, b) => a + b, 0);
    const totalPar = round.pars ? round.pars.reduce((a, b) => a + b, 0) : 72;
    const overUnder = round.pars ? totalScore - totalPar : '';
    return [
      round.courseName,
      round.date,
      round.scores.join(' '),
      round.pars ? round.pars.join(' ') : '',
      totalScore,
      round.pars ? totalPar : '',
      round.pars ? (overUnder > 0 ? '+' + overUnder : overUnder) : ''
    ];
  });
  return [headers, ...rows].map(row => row.map(String).map(cell => '"' + cell.replace(/"/g, '""') + '"').join(',')).join('\n');
}

const ScoreHistory = ({ rounds, onDeleteRound, onImportRounds }) => {
  const [filters, setFilters] = useState({
    courseName: '',
    startDate: '',
    endDate: ''
  });

  // Get unique course names for the dropdown
  const courseNames = useMemo(() => {
    const names = [...new Set(rounds.map(round => round.courseName))];
    return names.sort();
  }, [rounds]);

  // Filter rounds based on current filters
  const filteredRounds = useMemo(() => {
    return rounds.filter(round => {
      // Course name filter
      if (filters.courseName && !round.courseName.toLowerCase().includes(filters.courseName.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (filters.startDate && round.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && round.date > filters.endDate) {
        return false;
      }
      
      return true;
    });
  }, [rounds, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      courseName: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleDelete = (roundId) => {
    if (onDeleteRound) {
      onDeleteRound(roundId);
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const csv = convertRoundsToCSV(rounds);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'golf-rounds.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(rounds, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'golf-rounds.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import handler
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedRounds = JSON.parse(event.target.result);
        if (Array.isArray(importedRounds)) {
          if (onImportRounds) onImportRounds(importedRounds);
          else alert('Import successful! (But no import handler provided)');
        } else {
          alert('Invalid file format.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!rounds.length) return <div>No rounds logged yet.</div>;
  
  return (
    <div className="score-history">
      <h3>Score History</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={handleExportCSV} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #007bff', background: '#007bff', color: 'white', cursor: 'pointer' }}>Export CSV</button>
        <button onClick={handleExportJSON} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #28a745', background: '#28a745', color: 'white', cursor: 'pointer' }}>Export JSON</button>
        <label style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ffc107', background: '#ffc107', color: '#333', cursor: 'pointer', marginBottom: 0 }}>
          Import JSON
          <input type="file" accept="application/json" onChange={handleImportJSON} style={{ display: 'none' }} />
        </label>
      </div>
      
      {/* Filters */}
      <div className="filters-section">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
              Course Name
            </label>
            <input
              type="text"
              placeholder="Filter by course name..."
              value={filters.courseName}
              onChange={(e) => handleFilterChange('courseName', e.target.value)}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          
          <div>
            <button
              onClick={clearFilters}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🗑️ Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
        📊 Showing {filteredRounds.length} of {rounds.length} rounds
      </div>
      
      {/* Rounds list */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredRounds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            🔍 No rounds match your filters. Try adjusting your search criteria.
          </div>
        ) : (
          filteredRounds.map((round, idx) => {
            const totalScore = round.scores.reduce((a, b) => a + b, 0);
            const totalPar = round.pars ? round.pars.reduce((a, b) => a + b, 0) : 72;
            const overUnder = round.pars ? totalScore - totalPar : null;
            const averageScore = (totalScore / 18).toFixed(1);
            
            // Share handler
            const handleShare = async () => {
              const cardId = `round-card-${idx}`;
              const card = document.getElementById(cardId);
              if (!card) return;
              try {
                const canvas = await html2canvas(card, { backgroundColor: null });
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'scorecard.png', { type: 'image/png' })] })) {
                  const file = new File([blob], 'scorecard.png', { type: 'image/png' });
                  await navigator.share({ files: [file], title: 'My Golf Scorecard', text: 'Check out my golf round!' });
                } else {
                  // Fallback: download image
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'scorecard.png';
                  a.click();
                  URL.revokeObjectURL(url);
                  alert('Image downloaded! You can now share it manually.');
                }
              } catch (err) {
                alert('Failed to generate image for sharing.');
              }
            };

            return (
              <div 
                key={round._id || idx} 
                className="round-card"
                id={`round-card-${idx}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>🏌️ {round.courseName}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#666' }}>📅 {round.date}</span>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(round._id)}
                      className="delete-btn"
                      title="Delete this round"
                    >
                      ×
                    </button>
                    {/* Share button */}
                    <button
                      onClick={handleShare}
                      title="Share this scorecard"
                      style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      📤 Share
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '1rem', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🎯</span>
                    <div>
                      <strong>Total Score:</strong> {totalScore}
                      {round.pars && (
                        <span style={{ marginLeft: '0.5rem', color: '#007bff', fontWeight: 500 }}>
                          (Par {totalPar}, {overUnder > 0 ? '+' : ''}{overUnder} over/under)
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📈</span>
                    <div>
                      <strong>Average:</strong> {averageScore} per hole
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.9rem', 
                  color: '#666',
                  backgroundColor: '#f8f9fa',
                  padding: '0.5rem',
                  borderRadius: '6px'
                }}>
                  <strong style={{ color: '#000' }}>Hole Scores:</strong> {round.scores.join(', ')}
                  {round.pars && (
                    <div style={{ marginTop: '0.25rem', color: '#333' }}>
                      <strong>Pars:</strong> {round.pars.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ScoreHistory; 