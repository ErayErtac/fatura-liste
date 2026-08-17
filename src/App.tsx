import { NavLink, Route, Routes } from 'react-router-dom'
import FaturaListesiSayfasi from './pages/FaturaListesiSayfasi'
import YeniFaturaSayfasi from './pages/YeniFaturaSayfasi'
import styles from './App.module.scss'
import './App.css'


function App() {
  return (
    <div>
      <nav className={styles.nav}>
        <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          Fatura Listesi
        </NavLink>
        <NavLink to="/yeni-fatura" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          + Yeni Fatura
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<FaturaListesiSayfasi />} />
        <Route path="/yeni-fatura" element={<YeniFaturaSayfasi />} />
      </Routes>
      <Routes>
        <Route path="/" element={<FaturaListesiSayfasi />} />
        <Route path="/yeni-fatura" element={<YeniFaturaSayfasi />} />
        <Route path="/fatura-duzenle/:id" element={<YeniFaturaSayfasi />} />
      </Routes>
    </div>
  )
}

export default App