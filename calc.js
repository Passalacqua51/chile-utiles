// Funciones puras de calculo (UMD). Usadas por las paginas y por tests.py via node.
(function (root) {
  // Tramos Impuesto Unico 2da Categoria en UTM (fuente: SII, impuesto2026): [hasta, factor, rebaja]
  var TRAMOS = [[13.5,0,0],[30,0.04,0.54],[50,0.08,1.74],[70,0.135,4.49],[90,0.23,11.14],[120,0.304,17.8],[310,0.35,23.32],[Infinity,0.4,38.82]];
  function impuesto2a(base, utm) {
    var u = base / utm;
    for (var i = 0; i < TRAMOS.length; i++) if (u <= TRAMOS[i][0]) {
      return Math.max(0, base * TRAMOS[i][1] - TRAMOS[i][2] * utm);
    }
  }
  function sueldoLiquido(o) { // bruto imponible, comAfp %, salud %, indefinido, utm, topeClp (0 = sin tope)
    var base = o.topeClp > 0 ? Math.min(o.bruto, o.topeClp) : o.bruto;
    var afp = base * (10 + o.comAfp) / 100, salud = base * o.salud / 100;
    var ces = o.indefinido ? base * 0.006 : 0;
    var trib = o.bruto - afp - salud - ces;
    var imp = impuesto2a(trib, o.utm);
    return { afp: afp, salud: salud, ces: ces, trib: trib, imp: imp, liquido: o.bruto - afp - salud - ces - imp };
  }
  function mesesEntre(a, b) { // a,b = [y,m,d]
    var m = (b[0] - a[0]) * 12 + (b[1] - a[1]);
    return b[2] < a[2] ? m - 1 : m;
  }
  function finiquito(o) { // sueldo, ini [y,m,d], fin [y,m,d], uf, avisoPrevio (true = se dio aviso 30 dias)
    var meses = mesesEntre(o.ini, o.fin), anios = Math.floor(meses / 12);
    if (meses % 12 > 6) anios++;
    anios = Math.min(anios, 11);
    var tope = 90 * o.uf, base = Math.min(o.sueldo, tope);
    var indem = anios * base, aviso = o.avisoPrevio ? 0 : base;
    return { meses: meses, anios: anios, base: base, indem: indem, aviso: aviso, total: indem + aviso };
  }
  function cuota(p, tasaMensualPct, n) {
    var i = tasaMensualPct / 100;
    return i === 0 ? p / n : p * i / (1 - Math.pow(1 + i, -n));
  }
  function interesCompuesto(o) { // capital, tasaAnualPct, anios, aporteMensual (capitalizacion mensual)
    var i = o.tasa / 100 / 12, n = Math.round(o.anios * 12), g = Math.pow(1 + i, n);
    var fv = o.capital * g + (i === 0 ? o.aporte * n : o.aporte * (g - 1) / i);
    var inv = o.capital + o.aporte * n;
    return { fv: fv, invertido: inv, interes: fv - inv };
  }
  function iva(monto, modo) { // modo 'neto' (monto es neto) o 'bruto'
    var neto = modo === 'bruto' ? monto / 1.19 : monto;
    return { neto: neto, iva: neto * 0.19, bruto: neto * 1.19 };
  }
  function propina(monto, pct, personas) { var p = monto * pct / 100; return { propina: p, total: monto + p, porPersona: (monto + p) / personas }; }
  function reajuste(arriendo, pct) { return arriendo * (1 + pct / 100); }
  var api = { impuesto2a: impuesto2a, sueldoLiquido: sueldoLiquido, finiquito: finiquito, cuota: cuota, interesCompuesto: interesCompuesto, iva: iva, propina: propina, reajuste: reajuste };
  if (typeof module !== 'undefined') module.exports = api; else root.Calc = api;
})(this);
