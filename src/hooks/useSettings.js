import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, updateSettings } from '../services/settingsService';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const update = async (newSettings) => {
    try {
      await updateSettings(newSettings);
      await loadSettings();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { settings, loading, error, loadSettings, update };
};