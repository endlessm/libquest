/* exported LibQuestApp */
/* global pkg */

const {Gio, GObject} = imports.gi;

const {QuestBus} = imports.questBus;

const DBUS_INTERFACE = `
<node>
  <interface name="com.hack_computer.Libquest">
    <method name="ListAvailableQuests">
      <arg type='as' name='quests' direction='out'/>
    </method>
    <method name="LoadQuest">
      <arg type='s' name='questID' direction='in'/>
      <arg type='s' name='questStory' direction='in'/>
      <arg type='s' name='questPath' direction='out'/>
    </method>
  </interface>
</node>`;

const AUTO_CLOSE_MILLISECONDS_TIMEOUT = 300000;  // 5 minutes

var LibQuestApp = GObject.registerClass(class LibQuestApp extends Gio.Application {
    _init() {
        super._init({
            application_id: pkg.name,
            inactivity_timeout: AUTO_CLOSE_MILLISECONDS_TIMEOUT,
            flags: Gio.ApplicationFlags.IS_SERVICE,
        });

        this._questBusList = [];
        this.dbusRegister();
    }

    vfunc_startup() {
        // Call hold/release here, so the inactivity-timeout is used
        // correctly (as the overridden value is only used after a
        // release call).
        this.hold();
        this.release();
        super.vfunc_startup();
    }

    shutdown() {
        this.dbusUnregister();
        this._questBusList.forEach(q => {
            q.dbusUnregister();
        });
    }

    dbusRegister() {
        const objectPath = '/com/hack_computer/Libquest';
        this._dbus = Gio.DBusExportedObject.wrapJSObject(DBUS_INTERFACE, this);

        try {
            this._dbus.export(Gio.DBus.session, objectPath);
        } catch (e) {
            logError(e);
        }
    }

    dbusUnregister() {
        if (this._dbus)
            this._dbus.unexport();
    }

    // D-Bus implementation
    LoadQuest(questID, questStory) {
        let questBus = this._questBusList[questID];
        if (questBus) {
            questBus.dbusUnregister();
        }

        questBus = new QuestBus({quest_id: questID, quest_story: questStory});
        this._questBusList[questID] = questBus;
        log(`Quest ${questBus.quest_id} loaded.`);
        return questBus.dbusPath;
    }

    // D-Bus implementation
    // eslint-disable-next-line class-methods-use-this
    ListAvailableQuests() {
        // FIXME
        return ['p5-quest'];
    }
});
