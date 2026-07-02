import { useEffect, useRef, useState } from 'react'

function KakaoMap({ stores, onMarkerClick }) {
  const mapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=bacd162c82c5e8263ddba9cccacaa9d1&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => setLoaded(true))
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return

    // 지도 최초 1회만 생성
    if (!mapInstance.current) {
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5635, 127.1780),
        level: 4
      })
    }

    const map = mapInstance.current

    // stores 바뀔 때마다 마커 새로 찍기
    // 기존 마커 제거용 배열
    const markers = []

    stores.forEach(store => {
      if (!store.lat || !store.lng) return

      const position = new window.kakao.maps.LatLng(store.lat, store.lng)
      const marker = new window.kakao.maps.Marker({ map, position, title: store.name })

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:13px;font-weight:600;white-space:nowrap">${store.name}</div>`
      })

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker)
        // 상세 페이지 이동
        if (onMarkerClick) onMarkerClick(store.id)
      })

      markers.push(marker)
    })

    // cleanup: 다음 렌더 때 이전 마커 제거
    return () => {
      markers.forEach(marker => marker.setMap(null))
    }
  }, [loaded, stores, onMarkerClick])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '300px', borderRadius: '12px', background: '#e8e8e8' }}
    />
  )
}

export default KakaoMap