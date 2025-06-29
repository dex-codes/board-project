import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeCustomizer = ({ onClose }) => {
  const { 
    currentTheme, 
    predefinedThemes, 
    customThemes, 
    changeTheme, 
    createCustomTheme,
    deleteCustomTheme 
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState('presets');
  const [customName, setCustomName] = useState('');
  const [baseTheme, setBaseTheme] = useState('dark');
  const [customColors, setCustomColors] = useState({});

  const allThemes = { ...predefinedThemes, ...customThemes };

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleCreateTheme = () => {
    if (!customName.trim()) {
      alert('Please enter a theme name');
      return;
    }
    
    const themeKey = createCustomTheme(
      customName.trim(),
      predefinedThemes[baseTheme],
      customColors
    );
    
    changeTheme(themeKey);
    setCustomName('');
    setCustomColors({});
    setActiveTab('presets');
  };

  const colorCategories = [
    {
      name: 'Background Colors',
      colors: [
        { key: 'primary', label: 'Primary Background' },
        { key: 'secondary', label: 'Secondary Background' },
        { key: 'surface', label: 'Surface' },
        { key: 'card', label: 'Card Background' }
      ]
    },
    {
      name: 'Text Colors',
      colors: [
        { key: 'textPrimary', label: 'Primary Text' },
        { key: 'textSecondary', label: 'Secondary Text' },
        { key: 'textMuted', label: 'Muted Text' }
      ]
    },
    {
      name: 'Accent Colors',
      colors: [
        { key: 'accent', label: 'Primary Accent' },
        { key: 'success', label: 'Success' },
        { key: 'warning', label: 'Warning' },
        { key: 'error', label: 'Error' }
      ]
    },
    {
      name: 'Status Colors',
      colors: [
        { key: 'statusTodo', label: 'To Do' },
        { key: 'statusInProgress', label: 'In Progress' },
        { key: 'statusReview', label: 'Review' },
        { key: 'statusDone', label: 'Done' }
      ]
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal theme-customizer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎨 Theme Customizer</h3>
          <button onClick={onClose} className="btn btn-ghost">×</button>
        </div>
        
        <div className="theme-customizer-content">
          <div className="theme-tabs">
            <button
              className={`theme-tab ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              🎭 Presets
            </button>
            <button
              className={`theme-tab ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              🎨 Custom
            </button>
          </div>

          {activeTab === 'presets' && (
            <div className="presets-tab">
              <div className="current-theme">
                <h4>Current Theme: {currentTheme.name}</h4>
                <div className="theme-preview">
                  <div 
                    className="preview-card"
                    style={{
                      backgroundColor: currentTheme.colors.card,
                      color: currentTheme.colors.textPrimary,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="preview-header" style={{ color: currentTheme.colors.accent }}>
                      Sample Task Card
                    </div>
                    <div style={{ color: currentTheme.colors.textSecondary }}>
                      This is how your tasks will look
                    </div>
                  </div>
                </div>
              </div>

              <div className="theme-grid">
                <h4>Available Themes</h4>
                {Object.entries(allThemes).map(([key, theme]) => (
                  <div key={key} className="theme-option">
                    <div 
                      className="theme-card"
                      style={{
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border
                      }}
                      onClick={() => changeTheme(key)}
                    >
                      <div className="theme-colors">
                        <div 
                          className="color-dot" 
                          style={{ backgroundColor: theme.colors.primary }}
                        ></div>
                        <div 
                          className="color-dot" 
                          style={{ backgroundColor: theme.colors.accent }}
                        ></div>
                        <div 
                          className="color-dot" 
                          style={{ backgroundColor: theme.colors.success }}
                        ></div>
                      </div>
                      <div 
                        className="theme-name"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {theme.name}
                      </div>
                      {customThemes[key] && (
                        <button
                          className="delete-theme"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this custom theme?')) {
                              deleteCustomTheme(key);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="custom-tab">
              <div className="custom-theme-form">
                <div className="form-group">
                  <label>Theme Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="My Custom Theme"
                    className="theme-input"
                  />
                </div>

                <div className="form-group">
                  <label>Base Theme</label>
                  <select
                    value={baseTheme}
                    onChange={(e) => setBaseTheme(e.target.value)}
                    className="theme-select"
                  >
                    {Object.entries(predefinedThemes).map(([key, theme]) => (
                      <option key={key} value={key}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="color-customization">
                  <h4>Customize Colors</h4>
                  {colorCategories.map(category => (
                    <div key={category.name} className="color-category">
                      <h5>{category.name}</h5>
                      <div className="color-inputs">
                        {category.colors.map(({ key, label }) => (
                          <div key={key} className="color-input-group">
                            <label>{label}</label>
                            <div className="color-input-wrapper">
                              <input
                                type="color"
                                value={customColors[key] || predefinedThemes[baseTheme].colors[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="color-picker-input"
                              />
                              <input
                                type="text"
                                value={customColors[key] || predefinedThemes[baseTheme].colors[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="color-text-input"
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="custom-theme-actions">
                  <button onClick={handleCreateTheme} className="btn btn-primary">
                    Create Theme
                  </button>
                  <button 
                    onClick={() => {
                      setCustomName('');
                      setCustomColors({});
                    }}
                    className="btn btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
