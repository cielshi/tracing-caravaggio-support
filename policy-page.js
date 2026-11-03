// One document works offline in the app and as a standalone public policy page.
const embedded = window.parent !== window
// Runs before the stylesheet, so the native safe-area mode is set before paint.
document.documentElement.classList.toggle('in-app-document', embedded)

function initializeDocumentControls() {
  const close = document.querySelector('.close')
  if (close) {
    close.hidden = !embedded
    const dismiss = () => {
      if (close.dataset.returnTo) {
        window.location.assign(close.dataset.returnTo)
        return
      }
      window.parent.postMessage(close.dataset.closeMessage || 'close-privacy', '*')
    }
    close.addEventListener('click', dismiss)
    if (embedded) {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') dismiss()
        if (event.key !== 'Tab') return
        const items = [...document.querySelectorAll('button:not([hidden]), a[href]')].filter((item) => !item.closest('[hidden]'))
        const first = items[0], last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      })
    }
  }
  document.querySelectorAll('[data-web-only]').forEach((item) => { item.hidden = embedded })
  if (embedded) {
    document.querySelectorAll('[data-in-app-privacy]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        window.parent.postMessage('open-privacy', '*')
      })
    })
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDocumentControls, { once: true })
} else {
  initializeDocumentControls()
}
