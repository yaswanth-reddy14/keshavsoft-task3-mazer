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

// Orchestrator: fetch the data, render the cards, and fail gracefully.
async function initDashboardStats() {
  try {
    const data = await fetchDashboardData(DASHBOARD_DATA_URL)
    renderStatCards(data.stats)
  } catch (error) {
    console.error("Unable to load dashboard statistics:", error)
    // Static HTML values are intentionally kept as a fallback.
  }
}

initDashboardStats()
