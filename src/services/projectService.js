
const API_BASE = import.meta.env.VITE_API_BASE;// || "http://10.13.227.253:8000";

export async function changeUserPassword({ userId, currentPassword, newPassword }) {
  const response = await fetch(
    `${API_BASE}/changeuserpw`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userId, currentPassword, newPassword })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to change password: ${response.status} ${text}`)
  }

  return await response.json()
}

export async function getCommonData(payload) {
  const response = await fetch(
    `${API_BASE}/lms/commondata`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `Failed to load data: ${response.status} ${text}`
    )
  }

  return await response.json()
}

export async function updateUserPermission(payload) {
  const response = await fetch(
    `${API_BASE}/permission/grantaccess`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `Failed to load data: ${response.status} ${text}`
    )
  }

  return await response.json()
}


