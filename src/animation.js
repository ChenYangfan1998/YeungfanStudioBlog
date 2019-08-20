const checkbox = document.getElementById('disable-animation-checkbox')
let isAnimationModeOff = localStorage.getItem('isAnimationModeOff') === 'true' ? true : false
checkbox.checked = isAnimationModeOff

checkbox.addEventListener('click', () => {
    isAnimationModeOff = checkbox.checked
    localStorage.setItem('isAnimationModeOff', isAnimationModeOff.toString())
})

if (!isAnimationModeOff) {
    const animationSection = document.getElementsByClassName("full-screen")[0]
    animationSection.classList.add('animation-on')
} else {

}