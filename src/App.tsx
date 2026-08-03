import { Link, Route, Routes } from 'react-router-dom'
import FaturaListesiSayfasi from './pages/FaturaListesiSayfasi'
import YeniFaturaSayfasi from './pages/YeniFaturaSayfasi'
import styles from './App.module.scss'
import './App.css'

function App() {
  return (
    <div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Fatura Listesi</Link>
        <Link to="/yeni-fatura" className={styles.navLink}>+ Yeni Fatura</Link>
      </nav>

      <Routes>
        <Route path="/" element={<FaturaListesiSayfasi />} />
        <Route path="/yeni-fatura" element={<YeniFaturaSayfasi />} />
      </Routes>
    </div>
  )
}

export default App