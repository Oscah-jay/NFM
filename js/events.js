document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const sidebar = document.querySelector(".sidebar")
    const mobileToggle = document.querySelector(".mobile-toggle")
  
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active")
      })
    }
  
    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (event) => {
      const isClickInsideSidebar = sidebar.contains(event.target)
      const isClickOnToggle = mobileToggle.contains(event.target)
  
      if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active")
      }
    })
  
    // View toggle (Grid/Calendar)
    const viewBtns = document.querySelectorAll(".view-btn")
    const gridView = document.getElementById("grid-view")
    const calendarView = document.getElementById("calendar-view")
  
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        viewBtns.forEach((b) => b.classList.remove("active"))
  
        // Add active class to clicked button
        this.classList.add("active")
  
        const view = this.getAttribute("data-view")
  
        if (view === "grid") {
          gridView.style.display = "grid"
          calendarView.style.display = "none"
        } else if (view === "calendar") {
          gridView.style.display = "none"
          calendarView.style.display = "block"
  
          // Initialize calendar if it's not already
          if (!calendarView.classList.contains("initialized")) {
            initializeCalendar()
            calendarView.classList.add("initialized")
          }
        }
      })
    })
  
    // Event filtering
    const categoryFilter = document.getElementById("category-filter")
    const monthFilter = document.getElementById("month-filter")
    const eventSearch = document.getElementById("event-search")
    const eventCards = document.querySelectorAll(".event-card")
  
    function filterEvents() {
      const selectedCategory = categoryFilter.value
      const selectedMonth = monthFilter.value
      const searchTerm = eventSearch.value.toLowerCase()
  
      eventCards.forEach((card) => {
        const category = card.getAttribute("data-category")
        const month = card.getAttribute("data-month")
        const title = card.querySelector(".event-title").textContent.toLowerCase()
        const excerpt = card.querySelector(".event-excerpt").textContent.toLowerCase()
  
        const categoryMatch = selectedCategory === "all" || category === selectedCategory
        const monthMatch = selectedMonth === "all" || month === selectedMonth
        const searchMatch = searchTerm === "" || title.includes(searchTerm) || excerpt.includes(searchTerm)
  
        if (categoryMatch && monthMatch && searchMatch) {
          card.style.display = "flex"
        } else {
          card.style.display = "none"
        }
      })
    }
  
    if (categoryFilter) categoryFilter.addEventListener("change", filterEvents)
    if (monthFilter) monthFilter.addEventListener("change", filterEvents)
    if (eventSearch) {
      eventSearch.addEventListener("input", filterEvents)
  
      // Prevent form submission on enter key
      eventSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          return false
        }
      })
    }
  
    // Calendar functionality
    function initializeCalendar() {
      const calendarDates = document.querySelector(".calendar-dates")
      const currentMonthElement = document.querySelector(".current-month")
      const prevMonthBtn = document.querySelector(".prev-month")
      const nextMonthBtn = document.querySelector(".next-month")
  
      // Get current date
      const currentDate = new Date()
      let currentMonth = currentDate.getMonth()
      let currentYear = currentDate.getFullYear()
  
      // Event data (this would typically come from an API or database)
      const events = [
        { date: new Date(2023, 9, 15), title: "Youth Sunday Service", time: "10:30 AM", location: "Main Sanctuary" },
        { date: new Date(2023, 9, 22), title: "Community Outreach", time: "9:00 AM", location: "Community Center" },
        { date: new Date(2023, 9, 29), title: "Prayer & Worship Night", time: "6:30 PM", location: "Prayer Chapel" },
        {
          date: new Date(2023, 10, 5),
          title: "Volunteer Appreciation Dinner",
          time: "6:00 PM",
          location: "Fellowship Hall",
        },
        {
          date: new Date(2023, 10, 12),
          title: "Children's Ministry Fun Day",
          time: "10:00 AM",
          location: "Children's Building",
        },
        { date: new Date(2023, 10, 19), title: "Youth Game Night", time: "7:00 PM", location: "Youth Center" },
        {
          date: new Date(2023, 10, 24),
          title: "Annual Church Conference",
          time: "9:00 AM",
          location: "Main Church Auditorium",
        },
      ]
  
      // Function to generate calendar
      function generateCalendar(month, year) {
        // Clear previous calendar
        calendarDates.innerHTML = ""
  
        // Update month/year display
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
        currentMonthElement.textContent = `${monthNames[month]} ${year}`
  
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
  
        // Get days from previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate()
  
        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
          const dayCell = document.createElement("div")
          dayCell.classList.add("date-cell", "other-month")
          dayCell.textContent = daysInPrevMonth - i
          calendarDates.appendChild(dayCell)
        }
  
        // Add days for current month
        const today = new Date()
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
  
        for (let i = 1; i <= daysInMonth; i++) {
          const dayCell = document.createElement("div")
          dayCell.classList.add("date-cell")
          dayCell.textContent = i
  
          // Check if this is today
          if (isCurrentMonth && i === today.getDate()) {
            dayCell.classList.add("today")
          }
  
          // Check if this date has events
          const currentDateObj = new Date(year, month, i)
          const hasEvents = events.some(
            (event) =>
              event.date.getDate() === currentDateObj.getDate() &&
              event.date.getMonth() === currentDateObj.getMonth() &&
              event.date.getFullYear() === currentDateObj.getFullYear(),
          )
  
          if (hasEvents) {
            dayCell.classList.add("has-event")
  
            // Add click event to show events for this day
            dayCell.addEventListener("click", () => {
              showEventsForDate(currentDateObj)
            })
          }
  
          calendarDates.appendChild(dayCell)
        }
  
        // Calculate how many days from next month to show
        const totalCells = 42 // 6 rows of 7 days
        const remainingCells = totalCells - (firstDay + daysInMonth)
  
        // Add days from next month
        for (let i = 1; i <= remainingCells; i++) {
          const dayCell = document.createElement("div")
          dayCell.classList.add("date-cell", "other-month")
          dayCell.textContent = i
          calendarDates.appendChild(dayCell)
        }
      }
  
      // Function to show events for a specific date
      function showEventsForDate(date) {
        const eventsContainer = document.querySelector(".calendar-events")
        const eventsDate = document.querySelector(".events-date")
        const eventsList = document.querySelector(".calendar-event-list")
  
        // Format date
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        eventsDate.textContent = date.toLocaleDateString("en-US", options)
  
        // Clear previous events
        eventsList.innerHTML = ""
  
        // Filter events for this date
        const dateEvents = events.filter(
          (event) =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear(),
        )
  
        // Add events to list
        if (dateEvents.length > 0) {
          dateEvents.forEach((event) => {
            const eventItem = document.createElement("div")
            eventItem.classList.add("calendar-event-item")
            eventItem.innerHTML = `
                          <div class="event-time">${event.time}</div>
                          <div class="event-content">
                              <h5 class="event-title">${event.title}</h5>
                              <div class="event-location">${event.location}</div>
                          </div>
                          <a href="#" class="calendar-event-link">Details</a>
                      `
            eventsList.appendChild(eventItem)
          })
        } else {
          eventsList.innerHTML = "<p>No events scheduled for this date.</p>"
        }
      }
  
      // Initialize calendar with current month
      generateCalendar(currentMonth, currentYear)
  
      // Add event listeners for month navigation
      prevMonthBtn.addEventListener("click", () => {
        currentMonth--
        if (currentMonth < 0) {
          currentMonth = 11
          currentYear--
        }
        generateCalendar(currentMonth, currentYear)
      })
  
      nextMonthBtn.addEventListener("click", () => {
        currentMonth++
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
        generateCalendar(currentMonth, currentYear)
      })
  
      // Show events for today initially
      const today = new Date()
      showEventsForDate(today)
    }
  
    // Load more events button
    const loadMoreBtn = document.getElementById("load-more-btn")
  
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        // This would typically load more events from an API
        // For demo purposes, we'll just show a message
        this.textContent = "Loading..."
  
        setTimeout(() => {
          this.textContent = "No More Events"
          this.disabled = true
        }, 1500)
      })
    }
  
    // Registration form submission
    const registrationForm = document.querySelector(".registration-form")
  
    if (registrationForm) {
      registrationForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        // Simulate form submission
        const submitBtn = this.querySelector(".submit-btn")
        const originalText = submitBtn.textContent
  
        submitBtn.textContent = "Submitting..."
        submitBtn.disabled = true
  
        // Simulate API call with timeout
        setTimeout(() => {
          // Reset form
          registrationForm.reset()
  
          // Show success message
          const registrationContent = document.querySelector(".registration-content")
          const successMessage = document.createElement("div")
          successMessage.classList.add("success-message")
          successMessage.innerHTML = `
                      <h3>Registration Successful!</h3>
                      <p>Thank you for registering. We've sent a confirmation email with all the details.</p>
                      <p>If you have any questions, please contact our events team.</p>
                  `
  
          registrationContent.innerHTML = ""
          registrationContent.appendChild(successMessage)
        }, 1500)
      })
    }
  
    // Animate elements on scroll
    const fadeElements = document.querySelectorAll(".fade-in")
  
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )
  
    fadeElements.forEach((element) => {
      fadeObserver.observe(element)
    })
  })
  
  