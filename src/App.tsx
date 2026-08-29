import { NavLink, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FaturaListesiSayfasi from './pages/FaturaListesiSayfasi'
import YeniFaturaSayfasi from './pages/YeniFaturaSayfasi'
import MusterilerSayfasi from './pages/MusterilerSayfasi'
import DashboardSayfasi from './pages/DashboardSayfasi'
import TumFaturalarSayfasi from './pages/TumFaturalarSayfasi'
import styles from './App.module.scss'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()

  function dilDegistir() {
    const yeniDil = i18n.language === 'tr' ? 'en' : 'tr'
    i18n.changeLanguage(yeniDil)
  }

  return (
    <div>
      <nav className={styles.nav}>
        <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          {t('nav.faturaListesi')}
        </NavLink>
        <NavLink to="/yeni-fatura" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          {t('nav.yeniFatura')}
        </NavLink>
        <NavLink to="/musteriler" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          {t('nav.musteriler')}
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/tum-faturalar" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
          Tüm Faturalar
        </NavLink>
        <button type="button" className={styles.dilButon} onClick={dilDegistir}>
          {i18n.language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<FaturaListesiSayfasi />} />
        <Route path="/yeni-fatura" element={<YeniFaturaSayfasi />} />
        <Route path="/fatura-duzenle/:id" element={<YeniFaturaSayfasi />} />
        <Route path="/musteriler" element={<MusterilerSayfasi />} />
        <Route path="/dashboard" element={<DashboardSayfasi />} />
        <Route path="/tum-faturalar" element={<TumFaturalarSayfasi />} />
      </Routes>
    </div>
  )
}

export default App