import { reactive } from 'vue'
const screenInfo = reactive({ isMobile: false, width: 1080 })
function getInfo() {
  screenInfo.width = window.innerWidth
  screenInfo.isMobile = window.innerWidth < 768
}
window.addEventListener('DOMContentLoaded', getInfo)
window.addEventListener('resize', getInfo)
export default function getScreenInfo() {
  return screenInfo
}
