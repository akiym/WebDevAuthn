;(function () {
  'use strict'
  let Browser = typeof chrome !== 'undefined' ? chrome : browser
  let analyser = {
    domain: Browser.runtime.getURL('pages'),
    createPath: '/credential-creation.html',
    getPath: '/credential-get.html',
  }

  // If this is an extension page (Chrome: chrome-extension:, Firefox: moz-extension:)
  if (window.location.protocol.endsWith('-extension:')) return
  let ready = false
  let loaded = false
  let options = false

  let getBoolean = function (item) {
    return options[item] ? true : false
  }

  let fireLoad = function () {
    if (loaded) return
    ready = true
    if (!options) return
    loaded = true
    // If turned off disable
    if (!getBoolean('option@development')) return

    // Load CBOR library before webauthn-dev.js
    let cbor = document.createElement('script')
    cbor.setAttribute('type', 'text/javascript')
    cbor.setAttribute('src', Browser.runtime.getURL('pages/js/vendor/cbor.js'))
    cbor.async = false
    document.head.appendChild(cbor)

    // Prepare script
    let script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', Browser.runtime.getURL('webauthn-dev.js'))
    script.async = false
    // Parameters
    script.setAttribute('dev-domain', analyser.domain)
    script.setAttribute('development', getBoolean('option@development'))
    script.setAttribute('virtual', getBoolean('option@virtual'))
    script.setAttribute('pause-with-alert', getBoolean('option@pause-with-alert'))
    script.setAttribute('instance-of-pub-key', getBoolean('option@instance-of-pub-key'))
    script.setAttribute('debugger', getBoolean('option@debugger'))
    script.setAttribute(
      'platform-authenticator-available',
      getBoolean('option@platform-authenticator-available'),
    )
    // Insert on page
    document.head.appendChild(script)
  }

  // Load storage options
  Browser.storage.local.get(
    [
      'option@virtual',
      'option@development',
      'option@pause-with-alert',
      'option@instance-of-pub-key',
      'option@debugger',
      'option@platform-authenticator-available',
    ],
    function (items) {
      options = items
      if (!ready) fireLoad()
    },
  )

  // Relay messages from page script to extension pages
  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    if (!event.data || event.data._webdevauthn !== 'request') return
    Browser.runtime.sendMessage(event.data, () => {
      if (Browser.runtime.lastError) {
        // Extension page not ready yet, will retry
      }
    })
  })

  // Relay messages from extension pages to page script
  Browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message._webdevauthn !== 'response') return
    window.postMessage(message, '*')
  })

  // Script injector loader
  if (document.readyState == 'interactive' || document.readyState == 'complete') {
    fireLoad()
  } else {
    window.addEventListener('DOMContentLoaded', fireLoad, true)
    window.addEventListener('load', fireLoad, true)

    let o = new MutationObserver(() => {
      if (document.head) {
        o.disconnect()
        fireLoad()
      }
    })
    o.observe(document, { childList: true })
  }
})()
