/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Peter Golm <golm.peter@gmail.com>
 *
 */
const ExtensionUtils = imports.misc.extensionUtils;
const Gtk = imports.gi.Gtk;

const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('Usermenu_Message_Notifier');
const _ = Gettext.gettext;

let settings;

const SETTING_COUNTER_COLOR = 'counter-color';

function init() {
    settings = Convenience.getSettings();
    Convenience.initTranslations("Usermenu_Message_Notifier");
}

function buildPrefsWidget() {
    let frame = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, border_width: 0});

    let colorLabel = new Gtk.Label({ label: "<b>"+_("Counter color")+": </b>",
        use_markup: true,
        xalign: 0 });
    let colorText = new Gtk.Entry({ hexpand: true });

    let saveBtn = new Gtk.Button({label: _("Save")});
    saveBtn.connect('clicked', function (widget) {
        settings.set_string(SETTING_COUNTER_COLOR, colorText.get_text());
    });

    let s = settings.get_string(SETTING_COUNTER_COLOR);

    colorText.set_text(s);

    frame.add(colorLabel);
    frame.add(colorText);
    frame.add(saveBtn);
    frame.show_all();
    return frame;
}
