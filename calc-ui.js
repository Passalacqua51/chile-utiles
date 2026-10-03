// Render generico de calculadoras: la pagina define window.RUN(v) -> [[etiqueta, numero, formato], ...]
(function () {
  var f = document.getElementById('calc'), out = document.getElementById('res');
  var F = {
    clp: function (n) { return '$' + Math.round(n).toLocaleString('es-CL'); },
    uf: function (n) { return n.toLocaleString('es-CL', { maximumFractionDigits: 4 }) + ' UF'; },
    n: function (n) { return n.toLocaleString('es-CL', { maximumFractionDigits: 2 }); },
    pct: function (n) { return n.toLocaleString('es-CL', { maximumFractionDigits: 2 }) + '%'; }
  };
  function run() {
    var v = {};
    Array.prototype.forEach.call(f.elements, function (e) {
      if (!e.name) return;
      v[e.name] = e.type === 'checkbox' ? e.checked : e.type === 'number' ? parseFloat(e.value) || 0 : e.value;
    });
    var rows;
    try { rows = window.RUN(v); } catch (x) { rows = [['Revisa los datos ingresados', 0, 'msg']]; }
    out.innerHTML = '';
    rows.forEach(function (r) {
      var d = document.createElement('div'); d.className = 'row';
      var a = document.createElement('span'); a.textContent = r[0];
      var b = document.createElement('strong'); b.textContent = r[2] === 'msg' ? '' : (isFinite(r[1]) ? F[r[2]](r[1]) : '-');
      d.appendChild(a); d.appendChild(b); out.appendChild(d);
    });
  }
  f.addEventListener('input', run); f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
  run();
})();
