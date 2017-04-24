var mmk;
(function (mmk) {
    var lastinputtype;
    (function (lastinputtype) {
        var log = console.log;
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
            if (config.axisDeadzone === undefined)
                config.axisDeadzone = 0.1;
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
        function isActiveDefault(gamepad) {
            for (var i = 0; i < gamepad.buttons.length; ++i)
                if (gamepad.buttons[i].pressed) {
                    log(gamepad.id, "pressed button", i);
                    return true;
                }
            for (var i = 0; i < gamepad.axes.length; ++i)
                if (Math.abs(gamepad.axes[i]) > config.axisDeadzone) {
                    log(gamepad.id, "active axis", i);
                    return true;
                }
            return false;
        }
        function isActiveSonyDS4Wireless(gamepad) {
            for (var i = 0; i < gamepad.buttons.length; ++i)
                if (gamepad.buttons[i].pressed) {
                    log(gamepad.id, "pressed button", i);
                    return true;
                }
            for (var i = 0; i < gamepad.axes.length; ++i) {
                switch (i) {
                    case 3:
                        if (Math.abs((gamepad.axes[i] + 1) / 2) > config.axisDeadzone) {
                            log(gamepad.id, "active axis", i);
                            return true;
                        }
                        break;
                    case 4:
                        if (Math.abs((gamepad.axes[i] + 1) / 2) > config.axisDeadzone) {
                            log(gamepad.id, "active axis", i);
                            return true;
                        }
                        break;
                    case 9:
                        var dpadStateIndex = Math.round((gamepad.axes[i] + 1) * 7 / 2);
                        if (dpadStateIndex !== 8) {
                            log(gamepad.id, "active dpad", dpadStateIndex);
                            return true;
                        }
                        break;
                    default:
                        if (Math.abs(gamepad.axes[i]) > config.axisDeadzone) {
                            log(gamepad.id, "active axis", i);
                            return true;
                        }
                        break;
                }
            }
            return false;
        }
        var browserGamepadId_to_ControllerEntry = {};
        var vendorProductId_to_ControllerEntry = {};
        var browserMapping_to_ControllerEntry = {};
        var controllerEntries = [
            { chromeId: "Xbox 360 Controller (XInput STANDARD GAMEPAD)", cls: lastinputtype.GamepadXbox, clsEnabled: function () { return config.trackGamepadXbox; }, active: isActiveDefault },
            { chromeId: "DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)", vendorProductId: "054c 0ba0", cls: lastinputtype.GamepadSony, clsEnabled: function () { return config.trackGamepadSony; }, active: isActiveSonyDS4Wireless },
            { chromeId: "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)", vendorProductId: "054c 09cc", cls: lastinputtype.GamepadSony, clsEnabled: function () { return config.trackGamepadSony; }, active: isActiveDefault },
            { chromeId: "PLAYSTATION(R)3 Controller (Vendor: 054c Product: 0268)", vendorProductId: "054c 0268", cls: lastinputtype.GamepadSony, clsEnabled: function () { return config.trackGamepadSony; }, active: isActiveDefault },
            { mappingId: "standard", cls: lastinputtype.GamepadStandard, clsEnabled: function () { return config.trackGamepadStandard; }, active: isActiveDefault }
        ];
        controllerEntries.forEach(function (gamepad) {
            if (gamepad.chromeId !== undefined)
                browserGamepadId_to_ControllerEntry[gamepad.chromeId] = gamepad;
            if (gamepad.vendorProductId !== undefined)
                vendorProductId_to_ControllerEntry[gamepad.vendorProductId] = gamepad;
            if (gamepad.mappingId !== undefined)
                browserMapping_to_ControllerEntry[gamepad.mappingId] = gamepad;
        });
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
        function updateGamepads() {
            if (!config.trackGamepad)
                return;
            var gamepads = navigator.getGamepads();
            for (var i = 0; i < gamepads.length; ++i) {
                var gamepad = gamepads[i];
                if (!gamepad)
                    continue;
                var e = browserGamepadId_to_ControllerEntry[gamepad.id];
                if (e)
                    if (!e.active(gamepad))
                        continue;
                    else if (e.clsEnabled()) {
                        setBodyClass(e.cls);
                        return;
                    }
                if (gamepad.mapping) {
                    e = browserMapping_to_ControllerEntry[gamepad.mapping];
                    if (e)
                        if (!e.active(gamepad))
                            continue;
                        else if (e.clsEnabled()) {
                            setBodyClass(e.cls);
                            return;
                        }
                }
                var mVendProd = /[ (]Vendor: ([0-9a-f]+) Product: ([0-9a-f]+)\)$/gi.exec(gamepad.id);
                if (mVendProd) {
                    e = vendorProductId_to_ControllerEntry[mVendProd[1] + " " + mVendProd[2]];
                    if (e)
                        if (!e.active(gamepad))
                            continue;
                        else if (e.clsEnabled()) {
                            setBodyClass(e.cls);
                            return;
                        }
                }
                if (!isActiveDefault(gamepad))
                    continue;
                setBodyClass(lastinputtype.Controller);
                return;
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