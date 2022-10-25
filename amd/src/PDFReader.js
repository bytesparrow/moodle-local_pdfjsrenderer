// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @module     local_pdfjsrenderer/PDFReader
 * @copyright  2022 Bernhard Strehl <moodle@software.bernhard-strehl.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
//import pdfjsWorker from 'pdfjs-dist/build/pdf.worker';
//import * as pdfjsLib from 'pdfjs-dist/build/pdf';
//import PDFJSWorker from 'pdfjs-dist/build/pdf.worker';
import html5pdf from 'local_pdfjsrenderer/html5pdf';
import scrollview from 'local_pdfjsrenderer/scrollview';


window.pdfrenderer_list = [];


/**
 * create a new PDF-Reader.
 * Supply parameters as named array
 * Mandatory (strings):
 * pdffileurl - URL of the PDF to render
 * pdffileid - any internal file-id
 * width - of container, e.g. "300"
 * html_pagecount_id - a html-object to hold the info "x / ALLPAGES"
 * html_currentpage_id - a html-object to hold the info "CURRENTPAGE / y"
 * html_pdfcanvas_id - the html-canvas-id - it will hold the rendered PDF
 * html_pdfscrollcontainer_id - the container that holds html_pdfcanvas_id
 * html_next_id - an input-element to goto next page
 * html_prev_id - an input-element to goto previous page
 * html_zoomin_id - an input-element to zoom in
 * html_zoomout_id - an input-element to zoom out
 * callback_pdfloaded - e.g. function(){alert("hooray");}
 * callback_pdffailure - e.g. function(){alert("doh");}
 * @param {*} parameters parameters as named array, see above
 */
export const create = (parameters) => {

    //nicht schön, sollte auch als import gehen, aber läuft halt so...
    pdfjsLib.GlobalWorkerOptions.workerSrc = M.cfg.wwwroot + "/local/pdfjsrenderer/vendorjs/pdfjs-min/pdf.worker.min.js";
    parameters.pdfjslib = pdfjsLib;
    //window.console.debug(parameters);
    let html5pdfobject = new html5pdf(parameters);
    html5pdfobject.loadPDF(parameters.callback_pdfloaded, parameters.callback_pdffailure);


    /*bind created controls to actions*/
    if (parameters.html_next_id) {
        document.getElementById(parameters.html_next_id).addEventListener('click', function () {
            html5pdfobject.pageUp();
        });
    }
    if (parameters.html_prev_id) {
        document.getElementById(parameters.html_prev_id).addEventListener('click', function () {
            html5pdfobject.pageDown();
        });
    }
    if (parameters.html_zoomin_id) {
        document.getElementById(parameters.html_zoomin_id).addEventListener('click', function () {
            html5pdfobject.zoomIn();
        });
    }
    if (parameters.html_zoomout_id) {
        document.getElementById(parameters.html_zoomout_id).addEventListener('click', function () {
            html5pdfobject.zoomOut();
        });

    }

    //jquery-scrollview in normale class konvertiert
    scrollview.initialize("#" + parameters.html_pdfscrollcontainer_id);


    window.pdfrenderer_list[parameters.pdffileid] = html5pdfobject;
};


/**
 * returns a previously generated pdf-reader-object
 * @param {string} pdffileid Fileid of the reader
 * @returns js-object
 */
export const get = (pdffileid) => {
    return window.pdfrenderer_list[pdffileid];
};