var mmk;
(function (mmk) {
    var lastinputtype;
    (function (lastinputtype) {
        var config;
        (function (config) {
            if (config.trackKeyboard === undefined)
                config.trackKeyboard = true;
            if (config.trackMouse === undefined)
                config.trackMouse = true;
            if (config.trackStylus === undefined)
                config.trackStylus = true;
            if (config.trackTouch === undefined)
                config.trackTouch = true;
            if (config.trackGamepad === undefined)
                config.trackGamepad = true;
            if (config.trackGamepadXbox === undefined)
                config.trackGamepadXbox = true;
            if (config.trackGamepadSony === undefined)
                config.trackGamepadSony = true;
            if (config.trackGamepadStandard === undefined)
                config.trackGamepadStandard = true;
        })(config = lastinputtype.config || (lastinputtype.config = {}));
        lastinputtype.id = undefined;
        var liClassList = [];
        function addCls(cls) { liClassList.push(cls); return cls; }
        lastinputtype.Keyboard = addCls("mmk-lastinputtype-keyboard");
        lastinputtype.Mouse = addCls("mmk-lastinputtype-mouse");
        lastinputtype.Stylus = addCls("mmk-lastinputtype-stylus");
        lastinputtype.Touch = addCls("mmk-lastinputtype-touch");
        lastinputtype.GamepadXbox = addCls("mmk-lastinputtype-gamepad-xbox");
        lastinputtype.GamepadSony = addCls("mmk-lastinputtype-gamepad-sony");
        lastinputtype.GamepadStandard = addCls("mmk-lastinputtype-gamepad-standard");
        lastinputtype.Controller = addCls("mmk-lastinputtype-controller");
        var gamepadIdsToCls = {
            "Xbox 360 Controller (XInput STANDARD GAMEPAD)": { cls: lastinputtype.GamepadXbox, enabled: function () { return config.trackGamepadXbox; } }
        };
        var gamepadMappingsToCls = {
            "standard": { cls: lastinputtype.GamepadStandard, enabled: function () { return config.trackGamepadStandard; } }
        };
        var deferredBodyClass = undefined;
        function setBodyClass(idAndClass) {
            lastinputtype.id = idAndClass;
            var body = document.body;
            if (!body) {
                deferredBodyClass = idAndClass;
            }
            else {
                deferredBodyClass = undefined;
                liClassList.forEach(function (cls) {
                    if (cls === idAndClass)
                        body.classList.add(cls);
                    else
                        body.classList.remove(cls);
                });
            }
        }
        addEventListener("load", function () { if (deferredBodyClass !== undefined)
            setBodyClass(deferredBodyClass); });
        function setKeyboard() { if (config.trackKeyboard)
            setBodyClass(lastinputtype.Keyboard); }
        function setMouse() { if (config.trackMouse)
            setBodyClass(lastinputtype.Mouse); }
        function setStylus() { if (config.trackStylus)
            setBodyClass(lastinputtype.Stylus); }
        function setTouch() { if (config.trackTouch)
            setBodyClass(lastinputtype.Touch); }
        function setPointer(ev) {
            ev = ev || event;
            switch (ev.pointerType) {
                case "mouse":
                    setMouse();
                    break;
                case "pen":
                    setStylus();
                    break;
                case "touch":
                    setTouch();
                    break;
                case "":
                case null:
                case undefined:
                    break;
                default:
                    console.warn("Unrecognized PointerEvent.pointerType:", ev.pointerType);
                    break;
            }
        }
        addEventListener("keydown", setKeyboard);
        addEventListener("keyup", setKeyboard);
        addEventListener("keypress", setKeyboard);
        addEventListener("wheel", setMouse);
        addEventListener("mousedown", setMouse);
        addEventListener("mouseup", setMouse);
        addEventListener("mousemove", setMouse);
        addEventListener("mousewheel", setMouse);
        addEventListener("pointerdown", setPointer);
        addEventListener("pointermove", setPointer);
        addEventListener("pointerup", setPointer);
        addEventListener("touchstart", setTouch);
        addEventListener("touchmove", setTouch);
        addEventListener("touchend", setTouch);
        function poll(action) {
            if (!('requestAnimationFrame' in window)) {
                setInterval(action, 1000 / 60);
                action();
            }
            else {
                var wrapper = function () {
                    window.requestAnimationFrame(wrapper);
                    action();
                };
                wrapper();
            }
        }
        var lastGamepadUpdate = undefined;
        function updateGamepads() {
            if (!config.trackGamepad)
                return;
            var gamepads = navigator.getGamepads();
            for (var i = 0; i < gamepads.length; ++i) {
                var gamepad = gamepads[i];
                if (!gamepad)
                    continue;
                var timestamp = gamepad.timestamp;
                if (lastGamepadUpdate === undefined || lastGamepadUpdate < timestamp) {
                    lastGamepadUpdate = timestamp;
                    var e = gamepadIdsToCls[gamepad.id];
                    if (e && e.enabled()) {
                        setBodyClass(e.cls);
                        return;
                    }
                    e = gamepadMappingsToCls[gamepad.mapping];
                    if (e && e.enabled()) {
                        setBodyClass(e.cls);
                        return;
                    }
                    setBodyClass(lastinputtype.Controller);
                }
            }
        }
        if (!('getGamepads' in navigator)) {
        }
        else if (!('ongamepadconnected' in window)) {
            poll(updateGamepads);
        }
        else {
            addEventListener("gamepadconnected", function () {
                poll(updateGamepads);
            });
        }
    })(lastinputtype = mmk.lastinputtype || (mmk.lastinputtype = {}));
})(mmk || (mmk = {}));
//# sourceMappingURL=mmk.lastinputtype.js.map