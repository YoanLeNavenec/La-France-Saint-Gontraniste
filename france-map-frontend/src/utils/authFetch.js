async function authFetch(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken')

  let res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${accessToken}`},
  })

  if (res.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')
    const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/api/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (refreshRes.ok) {
      const data = await refreshRes.json()
      localStorage.setItem('accessToken', data.accessToken)

      res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${data.accessToken}`},
      })
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  }

  return res
}

export default authFetch