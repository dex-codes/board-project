import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Default dark theme inspired by Hybrix template
const defaultDarkTheme = {
  name: "Hybrix Dark",
  mode: "dark",
  colors: {
    // Background colors (inspired by Hybrix)
    primary: "#0f172a", // Deep slate background
    secondary: "#1e293b", // Slate 800
    tertiary: "#334155", // Slate 700

    // Surface colors
    surface: "#1e293b",
    surfaceHover: "#334155",
    card: "#1e293b",
    cardHover: "#334155",

    // Text colors (Hybrix-inspired)
    textPrimary: "#f8fafc", // Slate 50
    textSecondary: "#cbd5e1", // Slate 300
    textMuted: "#94a3b8", // Slate 400

    // Accent colors (Hybrix brand colors)
    accent: "#3b82f6", // Blue 500
    accentHover: "#2563eb", // Blue 600
    success: "#10b981", // Emerald 500
    warning: "#f59e0b", // Amber 500
    error: "#ef4444", // Red 500

    // Border colors
    border: "#334155", // Slate 700
    borderHover: "#475569", // Slate 600

    // Status column colors (Hybrix-inspired)
    statusTodo: "#64748b", // Slate 500
    statusInProgress: "#f59e0b", // Amber 500
    statusReview: "#8b5cf6", // Violet 500
    statusDone: "#10b981", // Emerald 500

    // Sidebar colors (matching Hybrix)
    sidebarBg: "#0f172a", // Slate 900
    sidebarText: "#e2e8f0", // Slate 200
    sidebarAccent: "#3b82f6", // Blue 500

    // Modal colors
    modalBg: "#1e293b", // Slate 800
    modalOverlay: "rgba(15, 23, 42, 0.8)", // Slate 900 with opacity
  },
};

// Light theme inspired by Hybrix template
const defaultLightTheme = {
  name: "Hybrix Light",
  mode: "light",
  colors: {
    // Background colors (Hybrix-inspired)
    primary: "#f8fafc", // Slate 50
    secondary: "#ffffff", // Pure white
    tertiary: "#f1f5f9", // Slate 100

    // Surface colors
    surface: "#ffffff",
    surfaceHover: "#f8fafc",
    card: "#ffffff",
    cardHover: "#f8fafc",

    // Text colors (Hybrix hierarchy)
    textPrimary: "#0f172a", // Slate 900
    textSecondary: "#334155", // Slate 700
    textMuted: "#64748b", // Slate 500

    // Accent colors (matching Hybrix)
    accent: "#3b82f6", // Blue 500
    accentHover: "#2563eb", // Blue 600
    success: "#10b981", // Emerald 500
    warning: "#f59e0b", // Amber 500
    error: "#ef4444", // Red 500

    // Border colors
    border: "#e2e8f0", // Slate 200
    borderHover: "#cbd5e1", // Slate 300

    // Status column colors (Hybrix-inspired)
    statusTodo: "#e2e8f0", // Slate 200
    statusInProgress: "#fbbf24", // Amber 400
    statusReview: "#a78bfa", // Violet 400
    statusDone: "#34d399", // Emerald 400

    // Sidebar colors (matching Hybrix light)
    sidebarBg: "#ffffff", // Pure white
    sidebarText: "#334155", // Slate 700
    sidebarAccent: "#3b82f6", // Blue 500

    // Modal colors
    modalBg: "#ffffff",
    modalOverlay: "rgba(15, 23, 42, 0.5)", // Slate 900 with opacity
  },
};

// Predefined themes
export const predefinedThemes = {
  dark: defaultDarkTheme,
  light: defaultLightTheme,
  blue: {
    name: "Ocean Blue",
    mode: "dark",
    colors: {
      ...defaultDarkTheme.colors,
      primary: "#0f172a",
      secondary: "#1e293b",
      tertiary: "#334155",
      surface: "#1e293b",
      card: "#334155",
      accent: "#0ea5e9",
      accentHover: "#0284c7",
      sidebarBg: "#0f172a",
    },
  },
  purple: {
    name: "Purple Night",
    mode: "dark",
    colors: {
      ...defaultDarkTheme.colors,
      primary: "#1e1b4b",
      secondary: "#312e81",
      tertiary: "#3730a3",
      surface: "#312e81",
      card: "#3730a3",
      accent: "#8b5cf6",
      accentHover: "#7c3aed",
      sidebarBg: "#1e1b4b",
    },
  },
  green: {
    name: "Forest Green",
    mode: "dark",
    colors: {
      ...defaultDarkTheme.colors,
      primary: "#064e3b",
      secondary: "#065f46",
      tertiary: "#047857",
      surface: "#065f46",
      card: "#047857",
      accent: "#10b981",
      accentHover: "#059669",
      sidebarBg: "#064e3b",
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultDarkTheme);
  const [customThemes, setCustomThemes] = useState({});

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("taskManagerTheme");
    const savedCustomThemes = localStorage.getItem("taskManagerCustomThemes");

    if (savedCustomThemes) {
      try {
        setCustomThemes(JSON.parse(savedCustomThemes));
      } catch (error) {
        console.error("Failed to parse custom themes:", error);
      }
    }

    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentTheme(theme);
      } catch (error) {
        console.error("Failed to parse saved theme:", error);
      }
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Apply all color variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply mode class
    root.className = currentTheme.mode;

    // Save theme to localStorage
    localStorage.setItem("taskManagerTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const changeTheme = (themeKey) => {
    const allThemes = { ...predefinedThemes, ...customThemes };
    if (allThemes[themeKey]) {
      setCurrentTheme(allThemes[themeKey]);
    }
  };

  const createCustomTheme = (name, baseTheme, customColors) => {
    const customTheme = {
      name,
      mode: baseTheme.mode,
      colors: {
        ...baseTheme.colors,
        ...customColors,
      },
    };

    const themeKey = name.toLowerCase().replace(/\s+/g, "-");
    const updatedCustomThemes = {
      ...customThemes,
      [themeKey]: customTheme,
    };

    setCustomThemes(updatedCustomThemes);
    localStorage.setItem(
      "taskManagerCustomThemes",
      JSON.stringify(updatedCustomThemes)
    );

    return themeKey;
  };

  const deleteCustomTheme = (themeKey) => {
    const updatedCustomThemes = { ...customThemes };
    delete updatedCustomThemes[themeKey];

    setCustomThemes(updatedCustomThemes);
    localStorage.setItem(
      "taskManagerCustomThemes",
      JSON.stringify(updatedCustomThemes)
    );

    // If current theme is being deleted, switch to default
    if (currentTheme.name === customThemes[themeKey]?.name) {
      setCurrentTheme(defaultDarkTheme);
    }
  };

  const value = {
    currentTheme,
    predefinedThemes,
    customThemes,
    changeTheme,
    createCustomTheme,
    deleteCustomTheme,
    setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
