document.getElementById('credential-get-challenge').value = (function () {
  let id = []
  for (var i = 31; i >= 0; i--) id.push(i)
  return JSON.stringify(id)
})()

document.getElementById('credential-get-rpid').value = new URL(document.location.href).host

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
