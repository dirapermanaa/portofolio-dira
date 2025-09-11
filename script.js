// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize all functionality
    initializeLoading()
    initializeNavigation()
    initializeScrollAnimations()
    initializePortfolioFilter()
    initializeMusicControls() // Initialize music controls
    initializeContactForm()
    initializeSmoothScroll()
    initializeModal() // Initialize modal functionality
})

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById("loading-screen")

    window.addEventListener("load", () => {
        setTimeout(() => {
            loadingScreen.classList.add("fade-out")
            setTimeout(() => {
                loadingScreen.style.display = "none"
            }, 500)
        }, 1000)
    })
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById("navbar")
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("nav-menu")
    const navLinks = document.querySelectorAll(".nav-link")

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled")
        } else {
            navbar.classList.remove("scrolled")
        }
    })

    // Mobile menu toggle
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active")
        navMenu.classList.toggle("active")
        navMenu.style.right = navMenu.classList.contains("active") ? "0" : "-100%"; // Slide in/out from right
    })

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active")
            navMenu.classList.remove("active")
            navMenu.style.right = "-100%"; // Ensure menu slides out
        })
    })

    // Close mobile menu when clicking outside the menu or hamburger
    document.addEventListener("click", (event) => {
        const isClickInsideMenu = navMenu.contains(event.target)
        const isClickOnHamburger = hamburger.contains(event.target)

        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains("active")) {
            hamburger.classList.remove("active")
            navMenu.classList.remove("active")
            navMenu.style.right = "-100%"
        }
    })

    // Active navigation link
    window.addEventListener("scroll", () => {
        let current = ""
        const sections = document.querySelectorAll("section")

        sections.forEach((section) => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute("id")
            }
        })

        navLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active")
            }
        })
    })
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible")
            }
        })
    }, observerOptions)

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll(".fade-in")
    fadeElements.forEach((element) => {
        observer.observe(element)
    })
}

// Portfolio Filter
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn")
    const portfolioItems = document.querySelectorAll(".portfolio-item")

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter")

            // Update active button
            filterButtons.forEach((btn) => btn.classList.remove("active"))
            this.classList.add("active")

            // Filter portfolio items
            portfolioItems.forEach((item) => {
                const category = item.getAttribute("data-category")

                if (filter === "all" || category === filter) {
                    item.classList.remove("hidden")
                    setTimeout(() => {
                        item.style.display = "block"
                    }, 10)
                } else {
                    item.classList.add("hidden")
                    setTimeout(() => {
                        if (item.classList.contains("hidden")) {
                            item.style.display = "none"
                        }
                    }, 300)
                }
            })
        })
    })
}

// Music Controls
function initializeMusicControls() {
    const playButtons = document.querySelectorAll(".play-btn")
    let currentAudio = null
    let currentButton = null

    // Map of song data attributes to actual file names
    const songMap = {
        'line-with-a-hook': 'music/Line With a Hook.mp3',
        'one-direct': 'music/night changes.mp3',
        'blue-yungkai': 'music/blue yungkai.mp3',
        'talking-to-the-moon': 'music/Talking To The Moon.mp3',
        'it-will-rain': 'music/It Will Rain.mp3',
        'december': 'music/december.mp3',
        'to-the-bone': 'music/to the bone.mp3',
        'mangu': 'music/Mangu.mp3',
        'untuk-perempuan' : 'music/Untuk Perempuan.mp3',
        'bergema-selamanya' : 'music/bergema sampai selamanya.mp3',
        'monolog' : 'music/Monolog.mp3',
        'sempurna' : 'music/Sempurna.mp3',
    }

    playButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const songKey = this.getAttribute("data-song")
            const icon = this.querySelector("i")

            if (!songKey || !songMap[songKey]) {
                showNotification("Music file not found for this song.", "error")
                return
            }

            // If clicking the same button that's currently playing
            if (currentAudio && currentButton === this) {
                if (currentAudio.paused) {
                    currentAudio.play()
                    this.classList.add("playing")
                    if (icon) {
                        icon.classList.remove("fa-play")
                        icon.classList.add("fa-pause")
                    }
                } else {
                    currentAudio.pause()
                    this.classList.remove("playing")
                    if (icon) {
                        icon.classList.remove("fa-pause")
                        icon.classList.add("fa-play")
                    }
                }
                return
            }

            // Stop current audio if playing
            if (currentAudio) {
                currentAudio.pause()
                currentAudio.currentTime = 0
                if (currentButton) {
                    currentButton.classList.remove("playing")
                    const currentIcon = currentButton.querySelector("i")
                    if (currentIcon) {
                        currentIcon.classList.remove("fa-pause")
                        currentIcon.classList.add("fa-play")
                    }
                }
            }

            // Create new audio element
            currentAudio = new Audio(songMap[songKey])
            currentButton = this

            // Set icon immediately
            button.classList.add("playing")
            if (icon) {
                icon.classList.remove("fa-play")
                icon.classList.add("fa-pause")
            }

            // Handle audio load error
            currentAudio.addEventListener("error", function() {
                showNotification("Error loading music file. Please check if the file exists.", "error")
                currentAudio = null
                currentButton = null
                button.classList.remove("playing")
                if (icon) {
                    icon.classList.remove("fa-pause")
                    icon.classList.add("fa-play")
                }
            })

            // Handle successful load and play
            currentAudio.addEventListener("canplaythrough", function() {
                currentAudio.play()
                // Icon already set
            })

            // Handle audio end
            currentAudio.addEventListener("ended", function () {
                button.classList.remove("playing")
                if (icon) {
                    icon.classList.remove("fa-pause")
                    icon.classList.add("fa-play")
                }
                currentAudio = null
                currentButton = null
            })

            // Load the audio
            currentAudio.load()
        })
    })
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById("image-modal")
    const modalImage = document.getElementById("modal-image")
    const closeModal = document.getElementById("close-modal")
    const body = document.body

    // Ensure modal is hidden on page load
    modal.style.display = "none"

    // Open modal on "View Project" button click
    const portfolioLinks = document.querySelectorAll(".portfolio-link")
    portfolioLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault()
            const imageSrc = this.getAttribute("data-image")
            modalImage.src = imageSrc
            modal.style.display = "block"
            body.style.overflow = "hidden" // Disable scroll on body when modal is open
            // Prevent page jump by removing focus from link
            this.blur()
        })
    })

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none"
        body.style.overflow = "" // Enable scroll on body when modal is closed
    })

    // Close modal when clicking outside the image
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none"
            body.style.overflow = "" // Enable scroll on body when modal is closed
        }
    })
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById("contact-form")

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault()

        // Get form data
        const formData = new FormData(this)
        const name = formData.get("nama")
        const email = formData.get("email")
        const subject = formData.get("subject")
        const message = formData.get("message")

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification("Please fill in all fields.", "error")
            return
        }

        if (!isValidEmail(email)) {
            showNotification("Please enter a valid email address.", "error")
            return
        }

        // Send data to Google Sheets via fetch
        const submitButton = this.querySelector(".submit-button")
        const originalText = submitButton.textContent

        submitButton.textContent = "Sending..."
        submitButton.disabled = true

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                showNotification("Thank you! Pesan Anda Telah Berhasil Di Kirim. Kami akan segera menghubungi Anda.", "success")
                contactForm.reset()
            } else {
                showNotification("Failed to send message. Please try again later.", "error")
            }
            submitButton.textContent = originalText
            submitButton.disabled = false
        })
        .catch(() => {
            showNotification("Failed to send message. Please check your internet connection.", "error")
            submitButton.textContent = originalText
            submitButton.disabled = false
        })
    })
}

function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault()

            const targetId = this.getAttribute("href")
            const targetSection = document.querySelector(targetId)

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                })
            }
        })
    })

    // Prevent automatic scroll on page load if URL has hash
    if (window.location.hash) {
        // Scroll to top on load to prevent jumping to section
        window.scrollTo(0, 0)

        // Remove hash from URL to prevent browser default scroll
        history.replaceState(null, document.title, window.location.pathname + window.location.search)
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`

    // Add icon based on type
    const icon = document.createElement("span")
    icon.className = "notification-icon"
    icon.innerHTML = type === "success" ? "&#10004;" : "&#9888;" // checkmark or warning symbol
    notification.appendChild(icon)

    // Add message text
    const messageSpan = document.createElement("span")
    messageSpan.className = "notification-message"
    messageSpan.textContent = message
    notification.appendChild(messageSpan)

    // Style the notification
    notification.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translate(-50%, -100%);
          background-color: ${type === "success" ? "#28a745" : "#dc3545"};
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          min-width: 250px;
          max-width: 350px;
      `

    // Icon style
    icon.style.cssText = `
        font-size: 1.5rem;
        line-height: 1;
    `

    // Message style
    messageSpan.style.cssText = `
        flex: 1;
        font-size: 1rem;
    `

    // Append to body
    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
        notification.style.transform = "translate(-50%, 0)"
    }, 50)

    // Remove on click
    notification.addEventListener("click", () => {
        notification.style.transform = "translate(-50%, -100%)"
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 300)
    })

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = "translate(-50%, -100%)"
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 300)
    }, 4000)
}

// Parallax Effect for Hero Section (Optional)
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero")
    const rate = scrolled * -0.5

    if (hero) {
        hero.style.transform = `translateY(${rate}px)`
    }
})

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}


// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-dependent functions can be called here
}, 16) // ~60fps

window.addEventListener("scroll", throttledScrollHandler)

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        // Close mobile menu if open
        const hamburger = document.getElementById("hamburger")
        const navMenu = document.getElementById("nav-menu")

        if (navMenu.classList.contains("active")) {
            hamburger.classList.remove("active")
            navMenu.classList.remove("active")
        }
    }
})

// Focus management for accessibility
document.addEventListener("DOMContentLoaded", () => {
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    )

    focusableElements.forEach((element) => {
        element.addEventListener("focus", function () {
            this.style.outline = "2px solid #007BFF"
            this.style.outlineOffset = "2px"
        })

        element.addEventListener("blur", function () {
            this.style.outline = ""
            this.style.outlineOffset = ""
        })
    })
})


