const formatDate = (date: string) => {
  const d = new Date(date)
  const day = d.getDate()
  const year = d.getFullYear()
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ]
  const month = monthNames[d.getMonth()]
  // "12th May 2026" format

  // Format day with ordinal suffix
  function ordinal(n: number) {
    if (n > 3 && n < 21) return n + "th"
    switch (n % 10) {
      case 1:  return n + "st"
      case 2:  return n + "nd"
      case 3:  return n + "rd"
      default: return n + "th"
    }
  }

  return `${ordinal(day)} ${month} ${year}`
}

export { formatDate }