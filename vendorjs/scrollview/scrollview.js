/**
 * scrollview.
 * 
 * Adds a mouse-drag-scroll functionality to oversized content
 * in undersized containers
 * Copyright (c) 2009 Bernhard Strehl
 *
 * Released under the MIT license.
 * 
 * == Usage ====================
 * scrollview.initialize("#map");
 * =============================
 * 
 * Based on:
 * ScrollView - jQuery plugin 0.1 by Toshimitsu Takahashi
 * Released under the MIT license.
 */
(function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('mod', function () {
    //This is the code you would normally have inside define() or add to module.exports
    return {


        constructor(container, config) {
            this.initialize.apply(container, config);
        },

        initialize: function (container, config) {
            // setting cursor.
            var gecko = navigator.userAgent.indexOf("Gecko/") != -1;
            var opera = navigator.userAgent.indexOf("Opera/") != -1;
            var mac = navigator.userAgent.indexOf("Mac OS") != -1;
            if (opera) {
                this.grab = "default";
                this.grabbing = "move";
            } else if (!(mac && gecko) && config) {
                if (config.grab) {
                    this.grab = "url(\"" + config.grab + "\"),default";
                }
                if (config.grabbing) {
                    this.grabbing = "url(" + config.grabbing + "),move";
                }
            } else if (gecko) {
                this.grab = "-moz-grab";
                this.grabbing = "-moz-grabbing";
            } else {
                this.grab = "default";
                this.grabbing = "move";
            }

            // Get container and image.
            this.m = jQuery(container);
            this.i = this.m.children().css("cursor", this.grab);

            this.isgrabbing = false;

            // Set mouse events.
            var self = this;
            this.i.mousedown(function (e) {
                self.startgrab();
                this.xp = e.pageX;
                this.yp = e.pageY;
                return false;
            }).mousemove(function (e) {
                if (!self.isgrabbing) return true;
                self.scrollTo(this.xp - e.pageX, this.yp - e.pageY);
                this.xp = e.pageX;
                this.yp = e.pageY;
                return false;
            })
                .mouseout(function () { self.stopgrab() })
                .mouseup(function () { self.stopgrab() })
                .dblclick(function () {
                    var _m = self.m;
                    var off = _m.offset();
                    var dx = this.xp - off.left - _m.width() / 2;
                    if (dx < 0) {
                        dx = "+=" + dx + "px";
                    } else {
                        dx = "-=" + -dx + "px";
                    }
                    var dy = this.yp - off.top - _m.height() / 2;
                    if (dy < 0) {
                        dy = "+=" + dy + "px";
                    } else {
                        dy = "-=" + -dy + "px";
                    }
                    _m.animate({ scrollLeft: dx, scrollTop: dy },
                        "normal", "swing");
                });

            this.centering();
        },
        centering: function () {
            var _m = this.m;
            var w = this.i.width() - _m.width();
            var h = this.i.height() - _m.height();
            _m.scrollLeft(w / 2).scrollTop(h / 2);
        },
        startgrab: function () {
            this.isgrabbing = true;
            this.i.css("cursor", this.grabbing);
        },
        stopgrab: function () {
            this.isgrabbing = false;
            this.i.css("cursor", this.grab);
        },
        scrollTo: function (dx, dy) {
            var _m = this.m;
            var x = _m.scrollLeft() + dx;
            var y = _m.scrollTop() + dy;
            _m.scrollLeft(x).scrollTop(y);
        }
    };
}));






