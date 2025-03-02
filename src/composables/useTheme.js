const theme = ref(localStorage.getItem('theme') || 'light');

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    updateTheme();
  };

  const updateTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme
  updateTheme();

  // Watch for system theme changes
  watch(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    (isDark) => {
      if (!localStorage.getItem('theme')) {
        theme.value = isDark ? 'dark' : 'light';
        updateTheme();
      }
    },
    { immediate: true }
  );

  return {
    theme,
    toggleTheme,
  };
}
