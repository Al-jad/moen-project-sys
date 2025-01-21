import { ref, onMounted, watch } from 'vue'

const useTheme = () => {
  const theme = ref('light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  })

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    theme.value = savedTheme
  })

  return {
    theme,
    toggleTheme
  }
}

export default useTheme 