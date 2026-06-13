export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#071015',
        panel: '#0d1820',
        panel2: '#111f2a',
        line: '#263c4a',
        cyanBio: '#47d4ff',
        amberBio: '#f3c969',
        greenBio: '#7ee787',
        roseBio: '#ff7b93'
      },
      boxShadow: {
        glow: '0 0 32px rgba(71, 212, 255, 0.16)'
      }
    }
  },
  plugins: []
};
