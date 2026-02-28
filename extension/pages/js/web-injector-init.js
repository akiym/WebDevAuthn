var el = document.getElementById('load-as-script-code');
if (el) {
	var url = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
		? chrome.runtime.getURL('webauthn-dev.js')
		: (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL)
			? browser.runtime.getURL('webauthn-dev.js')
			: 'EXTENSION_URL/webauthn-dev.js';
	el.innerHTML = el.innerHTML.replace('EXTENSION_URL/webauthn-dev.js', url);
}
