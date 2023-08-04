/*
 Highmaps JS v5.0.7 (2017-01-17)
 Highmaps as a plugin for Highcharts 4.1.x or Highstock 2.1.x (x being the patch version of this file)
 
 (c) 2011-2016 Torstein Honsi
 
 License: www.highcharts.com/license
 */
(function(y){"object" === typeof module && module.exports?module.exports = y:y(Highcharts)})(function(y){(function(a){var m = a.Axis, p = a.each, k = a.pick; a = a.wrap; a(m.prototype, "getSeriesExtremes", function(a){var d = this.isXAxis, u, m, r = [], c; d && p(this.series, function(b, a){b.useMapGeometry && (r[a] = b.xData, b.xData = [])}); a.call(this); d && (u = k(this.dataMin, Number.MAX_VALUE), m = k(this.dataMax, - Number.MAX_VALUE), p(this.series, function(b, a){b.useMapGeometry && (u = Math.min(u, k(b.minX, u)), m = Math.max(m, k(b.maxX, u)), b.xData = r[a],
        c = !0)}), c && (this.dataMin = u, this.dataMax = m))}); a(m.prototype, "setAxisTranslation", function(a){var q = this.chart, d = q.plotWidth / q.plotHeight, q = q.xAxis[0], k; a.call(this); "yAxis" === this.coll && void 0 !== q.transA && p(this.series, function(a){a.preserveAspectRatio && (k = !0)}); if (k && (this.transA = q.transA = Math.min(this.transA, q.transA), a = d / ((q.max - q.min) / (this.max - this.min)), a = 1 > a?this:q, d = (a.max - a.min) * a.transA, a.pixelPadding = a.len - d, a.minPixelPadding = a.pixelPadding / 2, d = a.fixTo)){d = d[1] - a.toValue(d[0], !0); d *= a.transA;
        if (Math.abs(d) > a.minPixelPadding || a.min === a.dataMin && a.max === a.dataMax)d = 0; a.minPixelPadding -= d}}); a(m.prototype, "render", function(a){a.call(this); this.fixTo = null})})(y); (function(a){var m = a.Axis, p = a.Chart, k = a.color, d, q = a.each, u = a.extend, w = a.isNumber, r = a.Legend, c = a.LegendSymbolMixin, b = a.noop, e = a.merge, g = a.pick, n = a.wrap; d = a.ColorAxis = function(){this.init.apply(this, arguments)}; u(d.prototype, m.prototype); u(d.prototype, {defaultColorAxisOptions:{lineWidth:0, minPadding:0, maxPadding:0, gridLineWidth:1, tickPixelInterval:72,
        startOnTick:!0, endOnTick:!0, offset:0, marker:{animation:{duration:50}, width:.01, color:"#999999"}, labels:{overflow:"justify", rotation:0}, minColor:"#e6ebf5", maxColor:"#003399", tickLength:5, showInLegend:!0}, keepProps:["legendGroup", "legendItem", "legendSymbol"].concat(m.prototype.keepProps), init:function(l, a){var f = "vertical" !== l.options.legend.layout, b; this.coll = "colorAxis"; b = e(this.defaultColorAxisOptions, {side:f?2:1, reversed:!f}, a, {opposite:!f, showEmpty:!1, title:null}); m.prototype.init.call(this, l,
        b); a.dataClasses && this.initDataClasses(a); this.initStops(a); this.horiz = f; this.zoomEnabled = !1; this.defaultLegendLength = 200}, tweenColors:function(a, f, b){var l; f.rgba.length && a.rgba.length?(a = a.rgba, f = f.rgba, l = 1 !== f[3] || 1 !== a[3], a = (l?"rgba(":"rgb(") + Math.round(f[0] + (a[0] - f[0]) * (1 - b)) + "," + Math.round(f[1] + (a[1] - f[1]) * (1 - b)) + "," + Math.round(f[2] + (a[2] - f[2]) * (1 - b)) + (l?"," + (f[3] + (a[3] - f[3]) * (1 - b)):"") + ")"):a = f.input || "none"; return a}, initDataClasses:function(a){var f = this, l = this.chart, b, h = 0, c = l.options.chart.colorCount,
        g = this.options, d = a.dataClasses.length; this.dataClasses = b = []; this.legendItems = []; q(a.dataClasses, function(a, x){a = e(a); b.push(a); a.color || ("category" === g.dataClassColor?(x = l.options.colors, c = x.length, a.color = x[h], a.colorIndex = h, h++, h === c && (h = 0)):a.color = f.tweenColors(k(g.minColor), k(g.maxColor), 2 > d?.5:x / (d - 1)))})}, initStops:function(a){this.stops = a.stops || [[0, this.options.minColor], [1, this.options.maxColor]]; q(this.stops, function(a){a.color = k(a[1])})}, setOptions:function(a){m.prototype.setOptions.call(this,
        a); this.options.crosshair = this.options.marker}, setAxisSize:function(){var a = this.legendSymbol, f = this.chart, b = f.options.legend || {}, c, h; a?(this.left = b = a.attr("x"), this.top = c = a.attr("y"), this.width = h = a.attr("width"), this.height = a = a.attr("height"), this.right = f.chartWidth - b - h, this.bottom = f.chartHeight - c - a, this.len = this.horiz?h:a, this.pos = this.horiz?b:c):this.len = (this.horiz?b.symbolWidth:b.symbolHeight) || this.defaultLegendLength}, toColor:function(a, f){var b = this.stops, l, h, c = this.dataClasses, e, g; if (c)for (g =
        c.length; g--; ){if (e = c[g], l = e.from, b = e.to, (void 0 === l || a >= l) && (void 0 === b || a <= b)){h = e.color; f && (f.dataClass = g, f.colorIndex = e.colorIndex); break}} else{this.isLog && (a = this.val2lin(a)); a = 1 - (this.max - a) / (this.max - this.min || 1); for (g = b.length; g-- && !(a > b[g][0]); ); l = b[g] || b[g + 1]; b = b[g + 1] || l; a = 1 - (b[0] - a) / (b[0] - l[0] || 1); h = this.tweenColors(l.color, b.color, a)}return h}, getOffset:function(){var a = this.legendGroup, b = this.chart.axisOffset[this.side]; a && (this.axisParent = a, m.prototype.getOffset.call(this), this.added ||
        (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = b)}, setLegendColor:function(){var a, b = this.options, c = this.reversed; a = c?1:0; c = c?0:1; a = this.horiz?[a, 0, c, 0]:[0, c, 0, a]; this.legendColor = {linearGradient:{x1:a[0], y1:a[1], x2:a[2], y2:a[3]}, stops:b.stops || [[0, b.minColor], [1, b.maxColor]]}}, drawLegendSymbol:function(a, b){var f = a.padding, l = a.options, h = this.horiz, c = g(l.symbolWidth, h?this.defaultLegendLength:12), e = g(l.symbolHeight, h?12:this.defaultLegendLength), d = g(l.labelPadding,
        h?16:30), l = g(l.itemDistance, 10); this.setLegendColor(); b.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, c, e).attr({zIndex:1}).add(b.legendGroup); this.legendItemWidth = c + f + (h?l:d); this.legendItemHeight = e + f + (h?d:0)}, setState:b, visible:!0, setVisible:b, getSeriesExtremes:function(){var a = this.series, b = a.length; this.dataMin = Infinity; for (this.dataMax = - Infinity; b--; )void 0 !== a[b].valueMin && (this.dataMin = Math.min(this.dataMin, a[b].valueMin), this.dataMax = Math.max(this.dataMax, a[b].valueMax))}, drawCrosshair:function(a,
        b){var f = b && b.plotX, c = b && b.plotY, h, l = this.pos, e = this.len; b && (h = this.toPixels(b[b.series.colorKey]), h < l?h = l - 2:h > l + e && (h = l + e + 2), b.plotX = h, b.plotY = this.len - h, m.prototype.drawCrosshair.call(this, a, b), b.plotX = f, b.plotY = c, this.cross && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.attr({fill:this.crosshair.color})))}, getPlotLinePath:function(a, b, c, e, h){return w(h)?this.horiz?["M", h - 4, this.top - 6, "L", h + 4, this.top - 6, h, this.top, "Z"]:["M", this.left, h, "L", this.left - 6, h + 6,
        this.left - 6, h - 6, "Z"]:m.prototype.getPlotLinePath.call(this, a, b, c, e)}, update:function(a, b){var c = this.chart, f = c.legend; q(this.series, function(a){a.isDirtyData = !0}); a.dataClasses && f.allItems && (q(f.allItems, function(a){a.isDataClass && a.legendGroup.destroy()}), c.isDirtyLegend = !0); c.options[this.coll] = e(this.userOptions, a); m.prototype.update.call(this, a, b); this.legendItem && (this.setLegendColor(), f.colorizeItem(this, !0))}, getDataClassLegendSymbols:function(){var l = this, f = this.chart, e = this.legendItems, g =
        f.options.legend, h = g.valueDecimals, d = g.valueSuffix || "", n; e.length || q(this.dataClasses, function(g, x){var t = !0, z = g.from, v = g.to; n = ""; void 0 === z?n = "\x3c ":void 0 === v && (n = "\x3e "); void 0 !== z && (n += a.numberFormat(z, h) + d); void 0 !== z && void 0 !== v && (n += " - "); void 0 !== v && (n += a.numberFormat(v, h) + d); e.push(u({chart:f, name:n, options:{}, drawLegendSymbol:c.drawRectangle, visible:!0, setState:b, isDataClass:!0, setVisible:function(){t = this.visible = !t; q(l.series, function(a){q(a.points, function(a){a.dataClass === x && a.setVisible(t)})});
                f.legend.colorizeItem(this, t)}}, g))}); return e}, name:""}); q(["fill", "stroke"], function(b){a.Fx.prototype[b + "Setter"] = function(){this.elem.attr(b, d.prototype.tweenColors(k(this.start), k(this.end), this.pos), null, !0)}}); n(p.prototype, "getAxes", function(a){var b = this.options.colorAxis; a.call(this); this.colorAxis = []; b && new d(this, b)}); n(r.prototype, "getAllItems", function(a){var b = [], c = this.chart.colorAxis[0]; c && c.options && (c.options.showInLegend && (c.options.dataClasses?b = b.concat(c.getDataClassLegendSymbols()):
        b.push(c)), q(c.series, function(a){a.options.showInLegend = !1})); return b.concat(a.call(this))}); n(r.prototype, "colorizeItem", function(a, b, c){a.call(this, b, c); c && b.legendColor && b.legendSymbol.attr({fill:b.legendColor})})})(y); (function(a){var m = a.defined, p = a.each, k = a.noop, d = a.seriesTypes; a.colorPointMixin = {isValid:function(){return null !== this.value}, setVisible:function(a){var d = this, q = a?"show":"hide"; p(["graphic", "dataLabel"], function(a){if (d[a])d[a][q]()})}, setState:function(d){a.Point.prototype.setState.call(this,
        d); this.graphic && this.graphic.attr({zIndex:"hover" === d?1:0})}}; a.colorSeriesMixin = {pointArrayMap:["value"], axisTypes:["xAxis", "yAxis", "colorAxis"], optionalAxis:"colorAxis", trackerGroups:["group", "markerGroup", "dataLabelsGroup"], getSymbol:k, parallelArrays:["x", "y", "value"], colorKey:"value", pointAttribs:d.column.prototype.pointAttribs, translateColors:function(){var a = this, d = this.options.nullColor, k = this.colorAxis, m = this.colorKey; p(this.data, function(c){var b = c[m]; if (b = c.options.color || (c.isNull?d:k &&
        void 0 !== b?k.toColor(b, c):c.color || a.color))c.color = b})}, colorAttribs:function(a){var d = {}; m(a.color) && (d[this.colorProp || "fill"] = a.color); return d}}})(y); (function(a){function m(a){a && (a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)}var p = a.addEvent, k = a.Chart, d = a.doc, q = a.each, u = a.extend, w = a.merge, r = a.pick; a = a.wrap; u(k.prototype, {renderMapNavigation:function(){var a = this, b = this.options.mapNavigation, e = b.buttons, g, d, l, f, x, q = function(b){this.handler.call(a,
        b); m(b)}; if (r(b.enableButtons, b.enabled) && !a.renderer.forExport)for (g in a.mapNavButtons = [], e)e.hasOwnProperty(g) && (l = w(b.buttonOptions, e[g]), d = l.theme, d.style = w(l.theme.style, l.style), x = (f = d.states) && f.hover, f = f && f.select, d = a.renderer.button(l.text, 0, 0, q, d, x, f, 0, "zoomIn" === g?"topbutton":"bottombutton").addClass("highcharts-map-navigation").attr({width:l.width, height:l.height, title:a.options.lang[g], padding:l.padding, zIndex:5}).add(), d.handler = l.onclick, d.align(u(l, {width:d.width, height:2 * d.height}),
        null, l.alignTo), p(d.element, "dblclick", m), a.mapNavButtons.push(d))}, fitToBox:function(a, b){q([["x", "width"], ["y", "height"]], function(e){var c = e[0]; e = e[1]; a[c] + a[e] > b[c] + b[e] && (a[e] > b[e]?(a[e] = b[e], a[c] = b[c]):a[c] = b[c] + b[e] - a[e]); a[e] > b[e] && (a[e] = b[e]); a[c] < b[c] && (a[c] = b[c])}); return a}, mapZoom:function(a, b, e, d, q){var c = this.xAxis[0], f = c.max - c.min, g = r(b, c.min + f / 2), n = f * a, f = this.yAxis[0], h = f.max - f.min, t = r(e, f.min + h / 2), h = h * a, g = this.fitToBox({x:g - n * (d?(d - c.pos) / c.len:.5), y:t - h * (q?(q - f.pos) / f.len:.5), width:n,
        height:h}, {x:c.dataMin, y:f.dataMin, width:c.dataMax - c.dataMin, height:f.dataMax - f.dataMin}), n = g.x <= c.dataMin && g.width >= c.dataMax - c.dataMin && g.y <= f.dataMin && g.height >= f.dataMax - f.dataMin; d && (c.fixTo = [d - c.pos, b]); q && (f.fixTo = [q - f.pos, e]); void 0 === a || n?(c.setExtremes(void 0, void 0, !1), f.setExtremes(void 0, void 0, !1)):(c.setExtremes(g.x, g.x + g.width, !1), f.setExtremes(g.y, g.y + g.height, !1)); this.redraw()}}); a(k.prototype, "render", function(a){var b = this, c = b.options.mapNavigation; b.renderMapNavigation(); a.call(b);
        (r(c.enableDoubleClickZoom, c.enabled) || c.enableDoubleClickZoomTo) && p(b.container, "dblclick", function(a){b.pointer.onContainerDblClick(a)}); r(c.enableMouseWheelZoom, c.enabled) && p(b.container, void 0 === d.onmousewheel?"DOMMouseScroll":"mousewheel", function(a){b.pointer.onContainerMouseWheel(a); m(a); return!1})})})(y); (function(a){var m = a.extend, p = a.pick, k = a.Pointer; a = a.wrap; m(k.prototype, {onContainerDblClick:function(a){var d = this.chart; a = this.normalize(a); d.options.mapNavigation.enableDoubleClickZoomTo?
        d.pointer.inClass(a.target, "highcharts-tracker") && d.hoverPoint && d.hoverPoint.zoomTo():d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(.5, d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)}, onContainerMouseWheel:function(a){var d = this.chart, k; a = this.normalize(a); k = a.detail || - (a.wheelDelta / 120); d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(Math.pow(d.options.mapNavigation.mouseWheelSensitivity, k), d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY),
        a.chartX, a.chartY)}}); a(k.prototype, "zoomOption", function(a){var d = this.chart.options.mapNavigation; p(d.enableTouchZoom, d.enabled) && (this.chart.options.chart.pinchType = "xy"); a.apply(this, [].slice.call(arguments, 1))}); a(k.prototype, "pinchTranslate", function(a, k, m, p, r, c, b){a.call(this, k, m, p, r, c, b); "map" === this.chart.options.chart.type && this.hasZoom && (a = p.scaleX > p.scaleY, this.pinchTranslateDirection(!a, k, m, p, r, c, b, a?p.scaleX:p.scaleY))})})(y); (function(a){var m = a.color, p = a.ColorAxis, k = a.colorPointMixin,
        d = a.each, q = a.extend, u = a.isNumber, w = a.map, r = a.merge, c = a.noop, b = a.pick, e = a.isArray, g = a.Point, n = a.Series, l = a.seriesType, f = a.seriesTypes, x = a.splat, v = void 0 !== a.doc.documentElement.style.vectorEffect; l("map", "scatter", {allAreas:!0, animation:!1, nullColor:"#f7f7f7", borderColor:"#cccccc", borderWidth:1, marker:null, stickyTracking:!1, joinBy:"hc-key", dataLabels:{formatter:function(){return this.point.value}, inside:!0, verticalAlign:"middle", crop:!1, overflow:!1, padding:0}, turboThreshold:0, tooltip:{followPointer:!0,
                pointFormat:"{point.name}: {point.value}\x3cbr/\x3e"}, states:{normal:{animation:!0}, hover:{brightness:.2, halo:null}, select:{color:"#cccccc"}}}, r(a.colorSeriesMixin, {type:"map", supportsDrilldown:!0, getExtremesFromAll:!0, useMapGeometry:!0, forceDL:!0, searchPoint:c, directTouch:!0, preserveAspectRatio:!0, pointArrayMap:["value"], getBox:function(h){var c = Number.MAX_VALUE, f = - c, e = c, l = - c, g = c, x = c, n = this.xAxis, k = this.yAxis, q; d(h || [], function(h){if (h.path){"string" === typeof h.path && (h.path = a.splitPath(h.path));
                var d = h.path || [], n = d.length, k = !1, z = - c, t = c, v = - c, m = c, p = h.properties; if (!h._foundBox){for (; n--; )u(d[n]) && (k?(z = Math.max(z, d[n]), t = Math.min(t, d[n])):(v = Math.max(v, d[n]), m = Math.min(m, d[n])), k = !k); h._midX = t + (z - t) * (h.middleX || p && p["hc-middle-x"] || .5); h._midY = m + (v - m) * (h.middleY || p && p["hc-middle-y"] || .5); h._maxX = z; h._minX = t; h._maxY = v; h._minY = m; h.labelrank = b(h.labelrank, (z - t) * (v - m)); h._foundBox = !0}f = Math.max(f, h._maxX); e = Math.min(e, h._minX); l = Math.max(l, h._maxY); g = Math.min(g, h._minY); x = Math.min(h._maxX - h._minX,
                h._maxY - h._minY, x); q = !0}}); q && (this.minY = Math.min(g, b(this.minY, c)), this.maxY = Math.max(l, b(this.maxY, - c)), this.minX = Math.min(e, b(this.minX, c)), this.maxX = Math.max(f, b(this.maxX, - c)), n && void 0 === n.options.minRange && (n.minRange = Math.min(5 * x, (this.maxX - this.minX) / 5, n.minRange || c)), k && void 0 === k.options.minRange && (k.minRange = Math.min(5 * x, (this.maxY - this.minY) / 5, k.minRange || c)))}, getExtremes:function(){n.prototype.getExtremes.call(this, this.valueData); this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
                this.valueMin = this.dataMin; this.valueMax = this.dataMax; this.dataMin = this.minY; this.dataMax = this.maxY}, translatePath:function(a){var b = !1, h = this.xAxis, c = this.yAxis, f = h.min, e = h.transA, h = h.minPixelPadding, d = c.min, l = c.transA, c = c.minPixelPadding, g, n = []; if (a)for (g = a.length; g--; )u(a[g])?(n[g] = b?(a[g] - f) * e + h:(a[g] - d) * l + c, b = !b):n[g] = a[g]; return n}, setData:function(b, c, f, g){var h = this.options, l = this.chart.options.chart, k = l && l.map, v = h.mapData, t = h.joinBy, z = null === t, q = h.keys || this.pointArrayMap, m = [], p = {}, A, B = this.chart.mapTransforms;
                !v && k && (v = "string" === typeof k?a.maps[k]:k); z && (t = "_i"); t = this.joinBy = x(t); t[1] || (t[1] = t[0]); b && d(b, function(a, c){var f = 0; if (u(a))b[c] = {value:a}; else if (e(a)){b[c] = {}; !h.keys && a.length > q.length && "string" === typeof a[0] && (b[c]["hc-key"] = a[0], ++f); for (var l = 0; l < q.length; ++l, ++f)q[l] && (b[c][q[l]] = a[f])}z && (b[c]._i = c)}); this.getBox(b); if (this.chart.mapTransforms = B = l && l.mapTransforms || v && v["hc-transform"] || B)for (A in B)B.hasOwnProperty(A) && A.rotation && (A.cosAngle = Math.cos(A.rotation), A.sinAngle = Math.sin(A.rotation));
                if (v){"FeatureCollection" === v.type && (this.mapTitle = v.title, v = a.geojson(v, this.type, this)); this.mapData = v; this.mapMap = {}; for (A = 0; A < v.length; A++)l = v[A], k = l.properties, l._i = A, t[0] && k && k[t[0]] && (l[t[0]] = k[t[0]]), p[l[t[0]]] = l; this.mapMap = p; b && t[1] && d(b, function(a){p[a[t[1]]] && m.push(p[a[t[1]]])}); h.allAreas?(this.getBox(v), b = b || [], t[1] && d(b, function(a){m.push(a[t[1]])}), m = "|" + w(m, function(a){return a && a[t[0]]}).join("|") + "|", d(v, function(a){t[0] && - 1 !== m.indexOf("|" + a[t[0]] + "|") || (b.push(r(a, {value:null})),
                g = !1)})):this.getBox(m)}n.prototype.setData.call(this, b, c, f, g)}, drawGraph:c, drawDataLabels:c, doFullTranslate:function(){return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans}, translate:function(){var a = this, b = a.xAxis, c = a.yAxis, f = a.doFullTranslate(); a.generatePoints(); d(a.data, function(h){h.plotX = b.toPixels(h._midX, !0); h.plotY = c.toPixels(h._midY, !0); f && (h.shapeType = "path", h.shapeArgs = {d:a.translatePath(h.path)})}); a.translateColors()}, pointAttribs:function(a, b){b =
                f.column.prototype.pointAttribs.call(this, a, b); a.isFading && delete b.fill; v?b["vector-effect"] = "non-scaling-stroke":b["stroke-width"] = "inherit"; return b}, drawPoints:function(){var a = this, b = a.xAxis, c = a.yAxis, e = a.group, l = a.chart, g = l.renderer, n, k, x, m, q = this.baseTrans, p, u, r, w, y; a.transformGroup || (a.transformGroup = g.g().attr({scaleX:1, scaleY:1}).add(e), a.transformGroup.survive = !0); a.doFullTranslate()?(l.hasRendered && d(a.points, function(b){b.shapeArgs && (b.shapeArgs.fill = a.pointAttribs(b, b.state).fill)}),
                a.group = a.transformGroup, f.column.prototype.drawPoints.apply(a), a.group = e, d(a.points, function(a){a.graphic && (a.name && a.graphic.addClass("highcharts-name-" + a.name.replace(/ /g, "-").toLowerCase()), a.properties && a.properties["hc-key"] && a.graphic.addClass("highcharts-key-" + a.properties["hc-key"].toLowerCase()))}), this.baseTrans = {originX:b.min - b.minPixelPadding / b.transA, originY:c.min - c.minPixelPadding / c.transA + (c.reversed?0:c.len / c.transA), transAX:b.transA, transAY:c.transA}, this.transformGroup.animate({translateX:0,
                translateY:0, scaleX:1, scaleY:1})):(n = b.transA / q.transAX, k = c.transA / q.transAY, x = b.toPixels(q.originX, !0), m = c.toPixels(q.originY, !0), .99 < n && 1.01 > n && .99 < k && 1.01 > k && (k = n = 1, x = Math.round(x), m = Math.round(m)), p = this.transformGroup, l.renderer.globalAnimation?(u = p.attr("translateX"), r = p.attr("translateY"), w = p.attr("scaleX"), y = p.attr("scaleY"), p.attr({animator:0}).animate({animator:1}, {step:function(a, b){p.attr({translateX:u + (x - u) * b.pos, translateY:r + (m - r) * b.pos, scaleX:w + (n - w) * b.pos, scaleY:y + (k - y) * b.pos})}})):
                p.attr({translateX:x, translateY:m, scaleX:n, scaleY:k})); v || a.group.element.setAttribute("stroke-width", a.options[a.pointAttrToOptions && a.pointAttrToOptions["stroke-width"] || "borderWidth"] / (n || 1)); this.drawMapDataLabels()}, drawMapDataLabels:function(){n.prototype.drawDataLabels.call(this); this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect)}, render:function(){var a = this, b = n.prototype.render; a.chart.renderer.isVML && 3E3 < a.data.length?setTimeout(function(){b.call(a)}):b.call(a)}, animate:function(a){var b =
                this.options.animation, c = this.group, h = this.xAxis, f = this.yAxis, e = h.pos, l = f.pos; this.chart.renderer.isSVG && (!0 === b && (b = {duration:1E3}), a?c.attr({translateX:e + h.len / 2, translateY:l + f.len / 2, scaleX:.001, scaleY:.001}):(c.animate({translateX:e, translateY:l, scaleX:1, scaleY:1}, b), this.animate = null))}, animateDrilldown:function(a){var b = this.chart.plotBox, c = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1], h = c.bBox, f = this.chart.options.drilldown.animation; a || (a = Math.min(h.width / b.width, h.height /
                b.height), c.shapeArgs = {scaleX:a, scaleY:a, translateX:h.x, translateY:h.y}, d(this.points, function(a){a.graphic && a.graphic.attr(c.shapeArgs).animate({scaleX:1, scaleY:1, translateX:0, translateY:0}, f)}), this.animate = null)}, drawLegendSymbol:a.LegendSymbolMixin.drawRectangle, animateDrillupFrom:function(a){f.column.prototype.animateDrillupFrom.call(this, a)}, animateDrillupTo:function(a){f.column.prototype.animateDrillupTo.call(this, a)}}), q({applyOptions:function(a, b){a = g.prototype.applyOptions.call(this, a, b);
                b = this.series; var c = b.joinBy; b.mapData && ((c = void 0 !== a[c[1]] && b.mapMap[a[c[1]]])?(b.xyFromShape && (a.x = c._midX, a.y = c._midY), q(a, c)):a.value = a.value || null); return a}, onMouseOver:function(a){clearTimeout(this.colorInterval); if (null !== this.value)g.prototype.onMouseOver.call(this, a); else this.series.onMouseOut(a)}, onMouseOut:function(){var a = this, b = + new Date, c = m(this.series.pointAttribs(a).fill), f = m(this.series.pointAttribs(a, "hover").fill), e = a.series.options.states.normal.animation, l = e && (e.duration ||
                500); l && 4 === c.rgba.length && 4 === f.rgba.length && "select" !== a.state && (clearTimeout(a.colorInterval), a.colorInterval = setInterval(function(){var e = (new Date - b) / l, h = a.graphic; 1 < e && (e = 1); h && h.attr("fill", p.prototype.tweenColors.call(0, f, c, e)); 1 <= e && clearTimeout(a.colorInterval)}, 13), a.isFading = !0); g.prototype.onMouseOut.call(a); a.isFading = null}, zoomTo:function(){var a = this.series; a.xAxis.setExtremes(this._minX, this._maxX, !1); a.yAxis.setExtremes(this._minY, this._maxY, !1); a.chart.redraw()}}, k))})(y); (function(a){var m =
        a.seriesType, p = a.seriesTypes; m("mapline", "map", {lineWidth:1, fillColor:"none"}, {type:"mapline", colorProp:"stroke", pointAttrToOptions:{stroke:"color", "stroke-width":"lineWidth"}, pointAttribs:function(a, d){a = p.map.prototype.pointAttribs.call(this, a, d); a.fill = this.options.fillColor; return a}, drawLegendSymbol:p.line.prototype.drawLegendSymbol})})(y); (function(a){var m = a.merge, p = a.Point; a = a.seriesType; a("mappoint", "scatter", {dataLabels:{enabled:!0, formatter:function(){return this.point.name}, crop:!1, defer:!1,
        overflow:!1, style:{color:"#000000"}}}, {type:"mappoint", forceDL:!0}, {applyOptions:function(a, d){a = void 0 !== a.lat && void 0 !== a.lon?m(a, this.series.chart.fromLatLonToPoint(a)):a; return p.prototype.applyOptions.call(this, a, d)}})})(y); (function(a){var m = a.arrayMax, p = a.arrayMin, k = a.Axis, d = a.color, q = a.each, u = a.isNumber, w = a.noop, r = a.pick, c = a.pInt, b = a.Point, e = a.Series, g = a.seriesType, n = a.seriesTypes; g("bubble", "scatter", {dataLabels:{formatter:function(){return this.point.z}, inside:!0, verticalAlign:"middle"},
        marker:{lineColor:null, lineWidth:1, radius:null, states:{hover:{radiusPlus:0}}, symbol:"circle"}, minSize:8, maxSize:"20%", softThreshold:!1, states:{hover:{halo:{size:5}}}, tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"}, turboThreshold:0, zThreshold:0, zoneAxis:"z"}, {pointArrayMap:["y", "z"], parallelArrays:["x", "y", "z"], trackerGroups:["markerGroup", "dataLabelsGroup"], bubblePadding:!0, zoneAxis:"z", pointAttribs:function(a, b){var c = r(this.options.marker.fillOpacity, .5); a = e.prototype.pointAttribs.call(this,
        a, b); 1 !== c && (a.fill = d(a.fill).setOpacity(c).get("rgba")); return a}, getRadii:function(a, b, c, e){var f, l, g, d = this.zData, n = [], k = this.options, v = "width" !== k.sizeBy, x = k.zThreshold, m = b - a; l = 0; for (f = d.length; l < f; l++)g = d[l], k.sizeByAbsoluteValue && null !== g && (g = Math.abs(g - x), b = Math.max(b - x, Math.abs(a - x)), a = 0), null === g?g = null:g < a?g = c / 2 - 1:(g = 0 < m?(g - a) / m:.5, v && 0 <= g && (g = Math.sqrt(g)), g = Math.ceil(c + g * (e - c)) / 2), n.push(g); this.radii = n}, animate:function(a){var b = this.options.animation; a || (q(this.points, function(a){var c =
        a.graphic, e; c && c.width && (e = {x:c.x, y:c.y, width:c.width, height:c.height}, c.attr({x:a.plotX, y:a.plotY, width:1, height:1}), c.animate(e, b))}), this.animate = null)}, translate:function(){var a, b = this.data, c, e, g = this.radii; n.scatter.prototype.translate.call(this); for (a = b.length; a--; )c = b[a], e = g?g[a]:0, u(e) && e >= this.minPxSize / 2?(c.marker = {radius:e, width:2 * e, height:2 * e}, c.dlBox = {x:c.plotX - e, y:c.plotY - e, width:2 * e, height:2 * e}):c.shapeArgs = c.plotY = c.dlBox = void 0}, alignDataLabel:n.column.prototype.alignDataLabel, buildKDTree:w,
        applyZones:w}, {haloPath:function(a){return b.prototype.haloPath.call(this, 0 === a?0:this.marker.radius + a)}, ttBelow:!1}); k.prototype.beforePadding = function(){var a = this, b = this.len, e = this.chart, g = 0, d = b, n = this.isXAxis, k = n?"xData":"yData", w = this.min, y = {}, H = Math.min(e.plotWidth, e.plotHeight), D = Number.MAX_VALUE, E = - Number.MAX_VALUE, F = this.max - w, C = b / F, G = []; q(this.series, function(b){var g = b.options; !b.bubblePadding || !b.visible && e.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, G.push(b), n && (q(["minSize",
        "maxSize"], function(a){var b = g[a], e = /%$/.test(b), b = c(b); y[a] = e?H * b / 100:b}), b.minPxSize = y.minSize, b.maxPxSize = Math.max(y.maxSize, y.minSize), b = b.zData, b.length && (D = r(g.zMin, Math.min(D, Math.max(p(b), !1 === g.displayNegative?g.zThreshold: - Number.MAX_VALUE))), E = r(g.zMax, Math.max(E, m(b))))))}); q(G, function(b){var c = b[k], e = c.length, f; n && b.getRadii(D, E, b.minPxSize, b.maxPxSize); if (0 < F)for (; e--; )u(c[e]) && a.dataMin <= c[e] && c[e] <= a.dataMax && (f = b.radii[e], g = Math.min((c[e] - w) * C - f, g), d = Math.max((c[e] - w) * C + f, d))});
        G.length && 0 < F && !this.isLog && (d -= b, C *= (b + g - d) / b, q([["min", "userMin", g], ["max", "userMax", d]], function(b){void 0 === r(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / C)}))}})(y); (function(a){var m = a.merge, p = a.Point, k = a.seriesType, d = a.seriesTypes; d.bubble && k("mapbubble", "bubble", {animationLimit:500, tooltip:{pointFormat:"{point.name}: {point.z}"}}, {xyFromShape:!0, type:"mapbubble", pointArrayMap:["z"], getMapData:d.map.prototype.getMapData, getBox:d.map.prototype.getBox, setData:d.map.prototype.setData}, {applyOptions:function(a,
        k){return a && void 0 !== a.lat && void 0 !== a.lon?p.prototype.applyOptions.call(this, m(a, this.series.chart.fromLatLonToPoint(a)), k):d.map.prototype.pointClass.prototype.applyOptions.call(this, a, k)}, ttBelow:!1})})(y); (function(a){var m = a.colorPointMixin, p = a.each, k = a.merge, d = a.noop, q = a.pick, u = a.Series, w = a.seriesType, r = a.seriesTypes; w("heatmap", "scatter", {animation:!1, borderWidth:0, nullColor:"#f7f7f7", dataLabels:{formatter:function(){return this.point.value}, inside:!0, verticalAlign:"middle", crop:!1, overflow:!1,
        padding:0}, marker:null, pointRange:null, tooltip:{pointFormat:"{point.x}, {point.y}: {point.value}\x3cbr/\x3e"}, states:{normal:{animation:!0}, hover:{halo:!1, brightness:.2}}}, k(a.colorSeriesMixin, {pointArrayMap:["y", "value"], hasPointSpecificOptions:!0, supportsDrilldown:!0, getExtremesFromAll:!0, directTouch:!0, init:function(){var a; r.scatter.prototype.init.apply(this, arguments); a = this.options; a.pointRange = q(a.pointRange, a.colsize || 1); this.yAxis.axisPointRange = a.rowsize || 1}, translate:function(){var a = this.options,
        b = this.xAxis, e = this.yAxis, g = function(a, b, c){return Math.min(Math.max(b, a), c)}; this.generatePoints(); p(this.points, function(c){var d = (a.colsize || 1) / 2, f = (a.rowsize || 1) / 2, n = g(Math.round(b.len - b.translate(c.x - d, 0, 1, 0, 1)), - b.len, 2 * b.len), d = g(Math.round(b.len - b.translate(c.x + d, 0, 1, 0, 1)), - b.len, 2 * b.len), k = g(Math.round(e.translate(c.y - f, 0, 1, 0, 1)), - e.len, 2 * e.len), f = g(Math.round(e.translate(c.y + f, 0, 1, 0, 1)), - e.len, 2 * e.len); c.plotX = c.clientX = (n + d) / 2; c.plotY = (k + f) / 2; c.shapeType = "rect"; c.shapeArgs = {x:Math.min(n,
        d), y:Math.min(k, f), width:Math.abs(d - n), height:Math.abs(f - k)}}); this.translateColors()}, drawPoints:function(){r.column.prototype.drawPoints.call(this); p(this.points, function(a){a.graphic.attr(this.colorAttribs(a))}, this)}, animate:d, getBox:d, drawLegendSymbol:a.LegendSymbolMixin.drawRectangle, alignDataLabel:r.column.prototype.alignDataLabel, getExtremes:function(){u.prototype.getExtremes.call(this, this.valueData); this.valueMin = this.dataMin; this.valueMax = this.dataMax; u.prototype.getExtremes.call(this)}}),
        m)})(y); (function(a){function m(a, b){var c, g, d, l = !1, f = a.x, k = a.y; a = 0; for (c = b.length - 1; a < b.length; c = a++)g = b[a][1] > k, d = b[c][1] > k, g !== d && f < (b[c][0] - b[a][0]) * (k - b[a][1]) / (b[c][1] - b[a][1]) + b[a][0] && (l = !l); return l}var p = a.Chart, k = a.each, d = a.extend, q = a.format, u = a.merge, w = a.win, r = a.wrap; p.prototype.transformFromLatLon = function(c, b){if (void 0 === w.proj4)return a.error(21), {x:0, y:null}; c = w.proj4(b.crs, [c.lon, c.lat]); var e = b.cosAngle || b.rotation && Math.cos(b.rotation), g = b.sinAngle || b.rotation && Math.sin(b.rotation);
        c = b.rotation?[c[0] * e + c[1] * g, - c[0] * g + c[1] * e]:c; return{x:((c[0] - (b.xoffset || 0)) * (b.scale || 1) + (b.xpan || 0)) * (b.jsonres || 1) + (b.jsonmarginX || 0), y:(((b.yoffset || 0) - c[1]) * (b.scale || 1) + (b.ypan || 0)) * (b.jsonres || 1) - (b.jsonmarginY || 0)}}; p.prototype.transformToLatLon = function(c, b){if (void 0 === w.proj4)a.error(21); else{c = {x:((c.x - (b.jsonmarginX || 0)) / (b.jsonres || 1) - (b.xpan || 0)) / (b.scale || 1) + (b.xoffset || 0), y:(( - c.y - (b.jsonmarginY || 0)) / (b.jsonres || 1) + (b.ypan || 0)) / (b.scale || 1) + (b.yoffset || 0)}; var e = b.cosAngle || b.rotation &&
        Math.cos(b.rotation), g = b.sinAngle || b.rotation && Math.sin(b.rotation); b = w.proj4(b.crs, "WGS84", b.rotation?{x:c.x * e + c.y * - g, y:c.x * g + c.y * e}:c); return{lat:b.y, lon:b.x}}}; p.prototype.fromPointToLatLon = function(c){var b = this.mapTransforms, e; if (b){for (e in b)if (b.hasOwnProperty(e) && b[e].hitZone && m({x:c.x, y: - c.y}, b[e].hitZone.coordinates[0]))return this.transformToLatLon(c, b[e]); return this.transformToLatLon(c, b["default"])}a.error(22)}; p.prototype.fromLatLonToPoint = function(c){var b = this.mapTransforms, e, g;
        if (!b)return a.error(22), {x:0, y:null}; for (e in b)if (b.hasOwnProperty(e) && b[e].hitZone && (g = this.transformFromLatLon(c, b[e]), m({x:g.x, y: - g.y}, b[e].hitZone.coordinates[0])))return g; return this.transformFromLatLon(c, b["default"])}; a.geojson = function(a, b, e){var c = [], n = [], l = function(a){var b, c = a.length; n.push("M"); for (b = 0; b < c; b++)1 === b && n.push("L"), n.push(a[b][0], - a[b][1])}; b = b || "map"; k(a.features, function(a){var e = a.geometry, g = e.type, e = e.coordinates; a = a.properties; var f; n = []; "map" === b || "mapbubble" ===
        b?("Polygon" === g?(k(e, l), n.push("Z")):"MultiPolygon" === g && (k(e, function(a){k(a, l)}), n.push("Z")), n.length && (f = {path:n})):"mapline" === b?("LineString" === g?l(e):"MultiLineString" === g && k(e, l), n.length && (f = {path:n})):"mappoint" === b && "Point" === g && (f = {x:e[0], y: - e[1]}); f && c.push(d(f, {name:a.name || a.NAME, properties:a}))}); e && a.copyrightShort && (e.chart.mapCredits = q(e.chart.options.credits.mapText, {geojson:a}), e.chart.mapCreditsFull = q(e.chart.options.credits.mapTextFull, {geojson:a})); return c}; r(p.prototype,
        "addCredits", function(a, b){b = u(!0, this.options.credits, b); this.mapCredits && (b.href = null); a.call(this, b); this.credits && this.mapCreditsFull && this.credits.attr({title:this.mapCreditsFull})})})(y); (function(a){function m(a, b, c, d, f, k, m, h){return["M", a + f, b, "L", a + c - k, b, "C", a + c - k / 2, b, a + c, b + k / 2, a + c, b + k, "L", a + c, b + d - m, "C", a + c, b + d - m / 2, a + c - m / 2, b + d, a + c - m, b + d, "L", a + h, b + d, "C", a + h / 2, b + d, a, b + d - h / 2, a, b + d - h, "L", a, b + f, "C", a, b + f / 2, a + f / 2, b, a + f, b, "Z"]}var p = a.Chart, k = a.defaultOptions, d = a.each, q = a.extend, u = a.merge, w = a.pick,
        r = a.Renderer, c = a.SVGRenderer, b = a.VMLRenderer; q(k.lang, {zoomIn:"Zoom in", zoomOut:"Zoom out"}); k.mapNavigation = {buttonOptions:{alignTo:"plotBox", align:"left", verticalAlign:"top", x:0, width:18, height:18, padding:5, style:{fontSize:"15px", fontWeight:"bold"}, theme:{"stroke-width":1, "text-align":"center"}}, buttons:{zoomIn:{onclick:function(){this.mapZoom(.5)}, text:"+", y:0}, zoomOut:{onclick:function(){this.mapZoom(2)}, text:"-", y:28}}, mouseWheelSensitivity:1.1}; a.splitPath = function(a){var b; a = a.replace(/([A-Za-z])/g,
        " $1 "); a = a.replace(/^\s*/, "").replace(/\s*$/, ""); a = a.split(/[ ,]+/); for (b = 0; b < a.length; b++) / [a - zA - Z] / .test(a[b]) || (a[b] = parseFloat(a[b])); return a}; a.maps = {}; c.prototype.symbols.topbutton = function(a, b, c, d, f){return m(a - 1, b - 1, c, d, f.r, f.r, 0, 0)}; c.prototype.symbols.bottombutton = function(a, b, c, d, f){return m(a - 1, b - 1, c, d, 0, 0, f.r, f.r)}; r === b && d(["topbutton", "bottombutton"], function(a){b.prototype.symbols[a] = c.prototype.symbols[a]}); a.Map = a.mapChart = function(b, c, d){var e = "string" === typeof b || b.nodeName,
        f = arguments[e?1:0], g = {endOnTick:!1, visible:!1, minPadding:0, maxPadding:0, startOnTick:!1}, k, h = a.getOptions().credits; k = f.series; f.series = null; f = u({chart:{panning:"xy", type:"map"}, credits:{mapText:w(h.mapText, ' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'), mapTextFull:w(h.mapTextFull, "{geojson.copyright}")}, tooltip:{followTouchMove:!1}, xAxis:g, yAxis:u(g, {reversed:!0})}, f, {chart:{inverted:!1, alignTicks:!1}}); f.series = k; return e?new p(b, f, d):new p(f, c)}})(y)});
