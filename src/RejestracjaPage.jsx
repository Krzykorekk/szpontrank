import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthScreen from './AuthScreen'
import ProfileSetup from './ProfileSetup'

export default function RejestracjaPage({ ladowanie, sesja, profil, onProfilGotowy }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!ladowanie && sesja && profil) {
      navigate('/panel', { replace: true })
    }
  }, [ladowanie, sesja, profil, navigate])

  return (
    <main className="content">
      {ladowanie && <p className="debug-status">Ładowanie...</p>}

      {!ladowanie && !sesja && <AuthScreen />}

      {!ladowanie && sesja && !profil && (
        <ProfileSetup
          userId={sesja.user.id}
          onGotowe={() => {
            onProfilGotowy()
            navigate('/panel', { replace: true })
          }}
        />
      )}
    </main>
  )
}
