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
const St = imports.gi.St;
const Main = imports.ui.main;
const MessageTray = imports.ui.messageTray;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

let settings, item, iconLayout, originalUpdateCount;
let counter = 0;

function customUpdateCount() {
    originalUpdateCount.call(this);

    counter = 0;

    let app_map = {
        'telepathy': true, /* Chat notifications */
        'notify-send': true,
        'xchat-gnome.desktop': true,
        'fedora-xchat-gnome.desktop': true,
        'xchat.desktop': true,
        'pidgin.desktop': true
    };

    let items = Main.messageTray._summaryItems;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let source = item.source;

        // make sure we have source._mainIcon
        source._ensureMainIcon();
        let sourceCount = parseInt(source._mainIcon._counterLabel.get_text(), 10);

        if (!isNaN(sourceCount) && sourceCount > 0) {
            let key = null;
            if (source.isChat)
                key = 'telepathy';
            else if (source.title == 'notify-send')
                key = 'notify-send';
            else if (source.app)
                key = source.app.get_id();

            if (key != null) {
                let app_cb = app_map[key];
                if (app_cb) {
                    counter = counter + sourceCount;
                }
            }
        }
    }

    item.set_text("" + counter);

    if (counter > 0) {
        item.show();
    } else {
        item.hide();
    }
}

function init(extensionMeta) {
    settings = Convenience.getSettings();
    iconLayout = Main.panel.statusArea.userMenu._iconBox.get_parent();
}

function enable() {
    let color = settings.get_string('counter-color');
    item = new St.Label({text: "" + counter,
        style: 'color: ' + color + ';',
        style_class: 'notify-counter',
        width: 15, height: 12});


    iconLayout.insert_child_at_index(item, 1);

    item.set_position(0, 2);

    this.settings.connect('changed::counter-color', function () {
        let color = settings.get_string('counter-color');
        item.set_style('color: ' + color + ';');
    });

    if (counter <= 0) {
        item.hide();
    }

    originalUpdateCount = MessageTray.SourceActor.prototype._updateCount;
    MessageTray.SourceActor.prototype._updateCount = customUpdateCount;
}

function disable() {
    MessageTray.SourceActor.prototype._updateCount = originalUpdateCount;
    originalUpdateCount = null;

    if (item) {
        item.destroy();
    }
}


