import '../css/app.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine

window.data = function () {
  return {
    isSideMenuOpen: false,
    toggleSideMenu() {
      this.isSideMenuOpen = !this.isSideMenuOpen
    },
    closeSideMenu() {
      this.isSideMenuOpen = false
    },
    isNotificationsMenuOpen: false,
    toggleNotificationsMenu() {
      this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen
    },
    closeNotificationsMenu() {
      this.isNotificationsMenuOpen = false
    },
    isProfileMenuOpen: false,
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen
    },
    closeProfileMenu() {
      this.isProfileMenuOpen = false
    },
    isPagesMenuOpen: {},
    togglePagesMenu(data) {
      if(!(data in this.isPagesMenuOpen)) {
        this.isPagesMenuOpen[data] = false
      }
      this.isPagesMenuOpen[data] = !this.isPagesMenuOpen[data]
    },
    isMonitoredsDropdownOPen: {},
    toggleMonitoredDropdown(data) {
      if(!(data in this.isMonitoredsDropdownOPen)) {
        this.isMonitoredsDropdownOPen[data] = false
      }
      console.log("testeeee")
      this.isMonitoredsDropdownOPen[data] = !this.isMonitoredsDropdownOPen[data]
      console.log(this.isMonitoredsDropdownOPen[data])
    },
    // Modal
    isModalOpen: false,
    trapCleanup: null,
    openModal() {
      this.isModalOpen = true
      this.trapCleanup = focusTrap(document.querySelector('#modal'))
    },
    closeModal() {
      this.isModalOpen = false
      this.trapCleanup()
    },
  }
}

Alpine.start()
