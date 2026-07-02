import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import KakaoMap from './components/KakaoMap'
import StoreDetail from './pages/StoreDetail'
import './App.css'

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'foodtruck', label: '푸드트럭' },
  { key: 'nightmarket', label: '야시장' },
  { key: 'festival', label: '축제' },
  { key: 'fiveday', label: '5일장' },
]

function Home() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [activeCategory, setActiveCategory] = useState('all')
  const navigate = useNavigate()

  useEffect(() => { fetchStores() }, [])

  async function fetchStores() {
    const { data } = await supabase.from('stores').select('*')
    if (data) setStores(data)
    setLoading(false)
  }

  const filtered = activeCategory === 'all'
    ? stores
    : stores.filter(s => s.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: '80px' }}>

      {/* 헤더 */}
      <div style={{
        background: '#fff', padding: '16px',
        borderBottom: '1px solid #eee',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700' }}>🚚 스트릿테이블</h1>
          <span style={{ fontSize: '20px' }}>🔍</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
              padding: '6px 14px', borderRadius: '20px', border: 'none',
              background: activeCategory === cat.key ? '#1a73e8' : '#f0f0f0',
              color: activeCategory === cat.key ? '#fff' : '#333',
              fontSize: '13px', fontWeight: '500',
              whiteSpace: 'nowrap', cursor: 'pointer'
            }}>{cat.label}</button>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div style={{ padding: '16px 16px 0' }}>
        <KakaoMap stores={stores} onMarkerClick={(id) => navigate(`/store/${id}`)} />
      </div>

      {/* 목록 */}
      <div style={{ padding: '16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>불러오는 중...</p>
        ) : filtered.map(store => (
          <div key={store.id}
            onClick={() => navigate(`/store/${store.id}`)}
            style={{
              background: '#fff', borderRadius: '12px', padding: '16px',
              marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700' }}>{store.name}</span>
                  <span style={{
                    fontSize: '11px', background: '#f0f0f0',
                    padding: '2px 6px', borderRadius: '4px', color: '#666'
                  }}>{store.sub_category}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>{store.address}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {store.tags?.map(tag => (
                    <span key={tag} style={{
                      fontSize: '11px', background: '#e8f0fe',
                      color: '#1a73e8', padding: '2px 8px', borderRadius: '10px'
                    }}>#{tag}</span>
                  ))}
                </div>
              </div>
              <span style={{
                fontSize: '12px', fontWeight: '600',
                color: store.is_open ? '#0a8a0a' : '#999',
                background: store.is_open ? '#e6f4ea' : '#f5f5f5',
                padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap'
              }}>
                {store.is_open ? '🟢 영업중' : '영업종료'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 탭바 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px', background: '#fff',
        borderTop: '1px solid #eee', display: 'flex',
        justifyContent: 'space-around', padding: '10px 0', zIndex: 10
      }}>
        {[
          { key: 'home', icon: '🏠', label: '홈' },
          { key: 'chat', icon: '💬', label: '커뮤니티' },
          { key: 'map', icon: '📍', label: '지도' },
          { key: 'bell', icon: '🔔', label: '알림' },
          { key: 'profile', icon: '👤', label: '프로필' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '2px', background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab.key ? '#1a73e8' : '#999'
          }}>
            <span style={{ fontSize: '22px' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:id" element={<StoreDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App