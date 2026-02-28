document.getElementById('credential-creation-rp-id').value = new URL(document.location.href).host;

document.getElementById('credential-creation-user-id').value = JSON.stringify(
	document.getElementById('credential-creation-user-name').value.split('').map(function (c) { return c.charCodeAt(0); })
);

document.getElementById('credential-creation-challenge').value = (function() {
	let id = [];
	for (var i = 16 - 1; i >= 0; i--) id.push(i);
	return JSON.stringify(id);
})();

$(function() { $('[data-toggle="tooltip"]').tooltip() });
