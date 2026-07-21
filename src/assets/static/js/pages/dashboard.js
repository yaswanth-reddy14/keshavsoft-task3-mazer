var optionsProfileVisit = {
  annotations: {
    position: "back",
  },
  dataLabels: {
    enabled: false,
  },
  chart: {
    type: "bar",
    height: 300,
  },
  fill: {
    opacity: 1,
  },
  plotOptions: {},
  series: [
    {
      name: "sales",
      data: [9, 20, 30, 20, 10, 20, 30, 20, 10, 20, 30, 20],
    },
  ],
  colors: "#435ebe",
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
}
let optionsVisitorsProfile = {
  series: [70, 30],
  labels: ["Male", "Female"],
  colors: ["#435ebe", "#55c6e8"],
  chart: {
    type: "donut",
    width: "100%",
    height: "350px",
  },
  legend: {
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "30%",
      },
    },
  },
}

var optionsEurope = {
  series: [
    {
      name: "series1",
      data: [310, 800, 600, 430, 540, 340, 605, 805, 430, 540, 340, 605],
    },
  ],
  chart: {
    height: 80,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  colors: ["#5350e9"],
  stroke: {
    width: 2,
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z",
      "2018-09-19T07:30:00.000Z",
      "2018-09-19T08:30:00.000Z",
      "2018-09-19T09:30:00.000Z",
      "2018-09-19T10:30:00.000Z",
      "2018-09-19T11:30:00.000Z",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  show: false,
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
}

let optionsAmerica = {
  ...optionsEurope,
  colors: ["#008b75"],
}
let optionsIndia = {
  ...optionsEurope,
  colors: ["#ffc434"],
}
let optionsIndonesia = {
  ...optionsEurope,
  colors: ["#dc3545"],
}

var chartProfileVisit = new ApexCharts(
  document.querySelector("#chart-profile-visit"),
  optionsProfileVisit
)
var chartVisitorsProfile = new ApexCharts(
  document.getElementById("chart-visitors-profile"),
  optionsVisitorsProfile
)
var chartEurope = new ApexCharts(
  document.querySelector("#chart-europe"),
  optionsEurope
)
var chartAmerica = new ApexCharts(
  document.querySelector("#chart-america"),
  optionsAmerica
)
var chartIndia = new ApexCharts(
  document.querySelector("#chart-india"),
  optionsIndia
)
var chartIndonesia = new ApexCharts(
  document.querySelector("#chart-indonesia"),
  optionsIndonesia
)

chartIndonesia.render()
chartAmerica.render()
chartIndia.render()
chartEurope.render()
chartProfileVisit.render()
chartVisitorsProfile.render()

// ---------------------------------------------------------------------------
// Statistics cards — dynamic data binding
// Loads dashboard-data.json and updates the existing stat cards in place.
// Progressive enhancement: if the fetch fails, the static HTML values remain.
// ---------------------------------------------------------------------------

const DASHBOARD_DATA_URL = "assets/static/data/dashboard-data.json"
const statsNumberFormatter = new Intl.NumberFormat("de-DE")

// Fetch and parse the dashboard data; throws on a non-OK response.
async function fetchDashboardData(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

// Format a raw number with locale-aware thousands separators.
const formatStatValue = (value) => statsNumberFormatter.format(value)

// Update a single stat card, matched by its data-stat-id.
function updateStatCard(stat) {
  const card = document.querySelector(`#statistics-cards [data-stat-id="${stat.id}"]`)
  if (!card) return

  const iconEl = card.querySelector("[data-stat-icon]")
  const glyphEl = card.querySelector("[data-stat-glyph]")
  const labelEl = card.querySelector("[data-stat-label]")
  const valueEl = card.querySelector("[data-stat-value]")

  if (iconEl) {
    iconEl.classList.remove("purple", "blue", "green", "red")
    iconEl.classList.add(stat.variant)
  }

  if (glyphEl) glyphEl.className = stat.icon
  if (labelEl) labelEl.textContent = stat.label
  if (valueEl) valueEl.textContent = formatStatValue(stat.value)
}

// Render every stat card from the stats array.
const renderStatCards = (stats) => stats.forEach(updateStatCard)

// ---------------------------------------------------------------------------
// Latest comments — dynamic table rendering
// Rebuilds the comments table body from the already-loaded dashboard data.
// ---------------------------------------------------------------------------

// Small helper: create an element with an optional class name.
function createEl(tag, className) {
  const el = document.createElement(tag)
  if (className) el.className = className
  return el
}

// Build one <tr> for a single comment record.
function buildCommentRow(comment) {
  const row = document.createElement("tr")

  const nameCell = createEl("td", "col-3")
  const person = createEl("div", "d-flex align-items-center")
  const avatar = createEl("div", "avatar avatar-md")
  const image = document.createElement("img")
  image.src = comment.avatar
  image.alt = comment.name
  avatar.appendChild(image)
  const name = createEl("p", "font-bold ms-3 mb-0")
  name.textContent = comment.name
  person.append(avatar, name)
  nameCell.appendChild(person)

  const messageCell = createEl("td", "col-auto")
  const message = createEl("p", "mb-0")
  message.textContent = comment.message
  messageCell.appendChild(message)

  row.append(nameCell, messageCell)
  return row
}

// Build the fallback row shown when there are no comments.
function buildEmptyCommentsRow() {
  const row = document.createElement("tr")
  const cell = createEl("td", "text-center text-muted")
  cell.colSpan = 2
  cell.textContent = "No comments available."
  row.appendChild(cell)
  return row
}

// Replace the comments table body with rows built from the data.
function renderComments(comments) {
  const tableBody = document.querySelector("#comments-table tbody")
  if (!tableBody) return

  tableBody.textContent = "" // clear existing rows without using innerHTML

  if (!Array.isArray(comments) || comments.length === 0) {
    tableBody.appendChild(buildEmptyCommentsRow())
    return
  }

  const fragment = document.createDocumentFragment()
  comments.forEach((comment) => fragment.appendChild(buildCommentRow(comment)))
  tableBody.appendChild(fragment)
}

// ---------------------------------------------------------------------------
// Recent messages — dynamic list rendering
// Rebuilds the recent-messages list from the already-loaded dashboard data.
// ---------------------------------------------------------------------------

// Build one list item for a single recent-message record.
function buildMessageItem(message) {
  const item = createEl("div", "recent-message d-flex px-4 py-3")

  const avatar = createEl("div", "avatar avatar-lg")
  const image = document.createElement("img")
  image.src = message.avatar
  image.alt = message.name
  avatar.appendChild(image)

  const details = createEl("div", "name ms-4")
  const name = createEl("h5", "mb-1")
  name.textContent = message.name
  const username = createEl("h6", "text-muted mb-0")
  username.textContent = message.username
  details.append(name, username)

  item.append(avatar, details)
  return item
}

// Build the fallback item shown when there are no recent messages.
function buildEmptyMessagesItem() {
  const item = createEl("div", "px-4 py-3 text-center text-muted")
  item.textContent = "No recent messages."
  return item
}

// Replace the recent-messages list with items built from the data.
function renderRecentMessages(messages) {
  const container = document.querySelector("#recent-messages")
  if (!container) return

  container.textContent = ""

  if (!Array.isArray(messages) || messages.length === 0) {
    container.appendChild(buildEmptyMessagesItem())
    return
  }

  const fragment = document.createDocumentFragment()
  messages.forEach((message) => fragment.appendChild(buildMessageItem(message)))
  container.appendChild(fragment)
}

// ---------------------------------------------------------------------------
// Profile card — single-instance data binding
// Updates the profile avatar, name and username in place.
// ---------------------------------------------------------------------------

// Update the profile card fields from the profile object.
function renderProfile(profile) {
  if (!profile) return

  const avatar = document.querySelector("[data-profile-avatar]")
  const name = document.querySelector("[data-profile-name]")
  const username = document.querySelector("[data-profile-username]")

  if (avatar) {
    avatar.src = profile.avatar
    avatar.alt = profile.name
  }
  if (name) name.textContent = profile.name
  if (username) username.textContent = profile.username
}

// ---------------------------------------------------------------------------
// Charts — dynamic data binding
// Updates the already-rendered ApexCharts instances from the dashboard data
// using updateOptions()/updateSeries(), so chart type, height, colors and
// animations are preserved (charts are never rebuilt).
// ---------------------------------------------------------------------------

// Map region ids to their existing chart instances.
const regionCharts = {
  europe: chartEurope,
  america: chartAmerica,
  india: chartIndia,
  indonesia: chartIndonesia,
}

// Update every chart from data.charts; missing data leaves a chart untouched.
function renderCharts(charts) {
  if (!charts) return

  if (charts.profileVisit) {
    const { series, categories } = charts.profileVisit
    if (categories) chartProfileVisit.updateOptions({ xaxis: { categories } })
    if (series) chartProfileVisit.updateSeries(series)
  }

  if (charts.visitorsProfile) {
    const { series, labels } = charts.visitorsProfile
    if (labels) chartVisitorsProfile.updateOptions({ labels })
    if (series) chartVisitorsProfile.updateSeries(series)
  }

  if (Array.isArray(charts.regions)) {
    charts.regions.forEach((region) => {
      const chart = regionCharts[region.id]
      if (chart && region.sparkline) {
        chart.updateSeries([{ name: region.label, data: region.sparkline }])
      }
    })
  }
}

// Orchestrator: fetch once, render every data-driven section, fail gracefully.
async function initDashboardStats() {
  try {
    const data = await fetchDashboardData(DASHBOARD_DATA_URL)
    renderProfile(data.profile)
    renderStatCards(data.stats)
    renderComments(data.comments)
    renderRecentMessages(data.recentMessages)
    renderCharts(data.charts)
  } catch (error) {
    console.error("Unable to load dashboard data:", error)
    // Static HTML values are intentionally kept as a fallback.
  }
}

initDashboardStats()
