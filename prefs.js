const ExtensionUtils = imports.misc.extensionUtils;
const Gtk = imports.gi.Gtk;

const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

let settings;

const SETTING_COUNTER_COLOR = 'counter-color';

function init() {
    settings = Convenience.getSettings();
}

function buildPrefsWidget() {
    let frame = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, border_width: 0});

    let colorLabel = new Gtk.Label({ label: "<b>Counter color: </b>",
        use_markup: true,
        xalign: 0 });
    let colorText = new Gtk.Entry({ hexpand: true });

    let saveBtn = new Gtk.Button({label: 'Save'});
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
