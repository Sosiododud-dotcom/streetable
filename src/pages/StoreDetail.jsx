import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TABS = ['홈', '메뉴', '리뷰', '위치']

function StoreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [store, setStore] = useState(null)
  const [menus, setMenus] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('홈')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStore()
    fetchMenus()
    fetchReviews()
  }, [id])

  async function fetchStore() {
    const { data } = await supabase.from('stores').select('*').eq('id', id).single()
    setStore(data)
    setLoading(false)
  }

  async function fetchMenus() {
    const { data } = await supabase.from('menus').select('*').eq('store_id', id)
    setMenus(data || [])
  }

  async function fetchReviews() {
    const { data } = await supabase.from('reviews').select('*').eq('store_id', id)
    setReviews(data || [])
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>불러오는 중...</div>
  if (!store) return <div style={{ padding: '40px', textAlign: 'center' }}>가게를 찾을 수 없어요</div>

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', minHeight: '100vh', background: '#fff' }}>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px', borderBottom: '1px solid #eee',
        position: 'sticky', top: 0, background: '#fff', zIndex: 10
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>{store.name}</span>
        <span style={{ fontSize: '14px', color: '#666' }}>공유</span>
      </div>

      <div style={{
        width: '100%', height: '220px', background: '#e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: '48px' }}>🚚</span>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700' }}>{store.name}</h1>
          <span style={{ fontSize: '12px', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', color: '#666' }}>
            {store.sub_category}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ color: '#facc15', fontSize: '16px' }}>★</span>
          <span style={{ fontWeight: '600' }}>4.0</span>
          <span style={{ color: '#999', fontSize: '13px' }}>리뷰 {reviews.length}개</span>
          <span style={{
            marginLeft: 'auto', fontSize: '12px', fontWeight: '600',
            color: store.is_open ? '#0a8a0a' : '#999',
            background: store.is_open ? '#e6f4ea' : '#f5f5f5',
            padding: '4px 10px', borderRadius: '6px'
          }}>
            {store.is_open ? '영업중' : '영업종료'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[
            { icon: '📌', label: '핀하기' },
            { icon: '✍️', label: '리뷰쓰기' },
            { icon: '📞', label: '전화걸기' },
            { icon: '🗺️', label: '길찾기' },
          ].map(btn => (
            <button key={btn.label} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px', padding: '10px 4px',
              background: '#f8f8f8', border: '1px solid #eee',
              borderRadius: '8px', cursor: 'pointer', fontSize: '11px', color: '#333'
            }}>
              <span style={{ fontSize: '18px' }}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{store.description}</p>
      </div>

      <div style={{
        display: 'flex', borderBottom: '1px solid #eee',
        position: 'sticky', top: '53px', background: '#fff', zIndex: 9
      }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '14px 0', border: 'none', background: 'none',
            fontSize: '14px', fontWeight: activeTab === tab ? '700' : '400',
            color: activeTab === tab ? '#1a73e8' : '#666', cursor: 'pointer',
            borderBottom: activeTab === tab ? '2px solid #1a73e8' : '2px solid transparent'
          }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {activeTab === '홈' && (
          <div>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              📍 {store.address}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {store.tags && store.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '12px', background: '#e8f0fe',
                  color: '#1a73e8', padding: '4px 10px', borderRadius: '12px'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === '메뉴' && (
          <div>
            {menus.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>등록된 메뉴가 없어요</p>
            ) : (
              menus.map(menu => (
                <div key={menu.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '14px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div>
                    {menu.is_recommended && (
                      <span style={{
                        fontSize: '11px', background: '#fff0f0',
                        color: '#e53e3e', padding: '2px 6px',
                        borderRadius: '4px', marginRight: '6px'
                      }}>추천</span>
                    )}
                    <span style={{ fontWeight: '500' }}>{menu.name}</span>
                  </div>
                  <span style={{ color: '#333', fontWeight: '600' }}>
                    {menu.price && menu.price.toLocaleString()}원
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === '리뷰' && (
          <div>
            <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid #eee', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', color: '#facc15', marginBottom: '4px' }}>★★★★★</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>4.0</div>
            </div>
            {reviews.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>아직 리뷰가 없어요</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>익명</span>
                    <span style={{ color: '#facc15' }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{review.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === '위치' && (
          <div>
            <p style={{ fontSize: '14px', color: '#333', marginBottom: '16px' }}>
              📍 {store.address}
            </p>
            <div style={{
              width: '100%', height: '200px', background: '#f0f0f0',
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
            }}>
              <span style={{ color: '#999', fontSize: '13px' }}>지도 영역</span>
            </div>
            <a
              href={'https://map.kakao.com/link/to/' + store.name + ',' + store.lat + ',' + store.lng}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block', width: '100%', padding: '14px',
                background: '#1a73e8', color: '#fff', border: 'none',
                borderRadius: '10px', textAlign: 'center',
                fontWeight: '700', fontSize: '15px', textDecoration: 'none'
              }}
            >
              길찾기
            </a>
          </div>
        )}

      </div>
    </div>
  )
}

export default StoreDetail
