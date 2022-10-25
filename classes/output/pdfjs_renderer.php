<?php
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

/**
 * This is the renderer for pdfjs_renderer.mustache
 * The rendered HTML contains the PDF
 *
 * @package     local_pdfjsrenderer
 * @copyright   2022 Bernhard Strehl <moodle@software.bernhard-strehl.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_pdfjsrenderer\output;

use renderable;
use renderer_base;
use templatable;
use stdClass;

class pdfjs_renderer implements renderable, templatable
{
    /** @var stored_file $pdffileobject The PDF-File to render. */
    private $pdffileobject = null;

    /**
     * constructor. Serve a object(stored_file).
     * This can be retrieved via:
     * $fs = get_file_storage();
     * $fileobject = $fs->get_file_by_id($desiredfileid);
     */
    public function __construct(\stored_file $pdffileobject)
    {
        $this->pdffileobject = $pdffileobject;
    }

    /**
     * Export this data so it can be used as the context for a mustache template.
     *
     * @return stdClass
     */
    public function export_for_template(renderer_base $output): stdClass
    {
        global $PAGE, $CFG;


        //get relevant data for $data-array
        $pdffileurl = \moodle_url::make_pluginfile_url($this->pdffileobject->get_contextid(),  $this->pdffileobject->get_component(),  $this->pdffileobject->get_filearea(),  $this->pdffileobject->get_itemid(),  $this->pdffileobject->get_filepath(),  $this->pdffileobject->get_filename());
        $pdffileid = $this->pdffileobject->get_id();

        $data = new stdClass();

        $data->pdffileurl = $pdffileurl;
        $data->pdffileid = $pdffileid;
        $data->moduleurl = $CFG->wwwroot . "/local/pdfjsrenderer/";
        //todo maybe refactor and add $data->callback_pdfloaded , $data->callback_pdffailure

        $PAGE->requires->js_call_amd('local_pdfjsrenderer/config');
        return $data;
    }
}
