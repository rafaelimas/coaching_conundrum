const baseUrl = import.meta.env.VITE_API_URL

export enum Available {
  Available,
  Unavailable,
  Booked
}

export type AvailabilitySlot = {
  time: Date,
  available: Available
  availabilityId: string,
}

export type UserType = "coaches" | "students"

function isAvailable(slot) {
  if(slot.id == null) return Available.Unavailable;

  if(slot.studentId) return Available.Booked;

  return Available.Available;
}

function constructAvailability(data): AvailabilitySlot[] {
  const availability : AvailabilitySlot[] = data.map((slot) => {
    return {
      time: new Date(slot.time),
      available: isAvailable(slot),
      availabilityId: slot.id
    }
  })

  return availability
}

export async function getAvailability(coachId: string, date: Date) : Promise<AvailabilitySlot[]> {
  try {
    const baseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const formattedDate = baseDate.toLocaleString('en-us', {timeZoneName: "short", hour12: false})
    const response = await fetch(`${baseUrl}/coaches/${coachId}/availability?date=${formattedDate}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()

    return constructAvailability(data.availability)
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return []
}

export async function updateAvailability(coachId: string, availability: AvailabilitySlot[]) {
  try {
    const response = await fetch(
      `${baseUrl}/coaches/${coachId}/availability`,
      { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availability.map((slot) => {
          return {
            time: slot.time.toLocaleString('en-us', {timeZoneName: "short", hour12: false}),
            available: Available[slot.available]
          }
        })),
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

export async function createBooking(availabilityId: string, studentId: string) {
  const response = await fetch(
    `${baseUrl}/coaches/bookings`,
    { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({availabilityId, studentId}),
    }
  )
  const data = await response.json()

  if(response.status != 200) {
    if(data.error) {
      throw new Error(`Error: ${data.error}`)
    }
    else {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  }
}

export async function getUsers(userType: UserType) {
  try {
    const response = await fetch(`${baseUrl}/${userType}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()

    return data[userType]
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return []
}

export async function getCoaches() {
  return getUsers("coaches")
}

export async function getStudents() {
  return getUsers("students")
}

export async function getBookings(userType: UserType, userId: string) {
  try {
    const response = await fetch(`${baseUrl}/${userType}/${userId}/bookings`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()

    return data.bookings
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return []
}
