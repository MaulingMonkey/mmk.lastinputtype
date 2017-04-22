/* Copyright 2017 MaulingMonkey

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

namespace mmk.lastinputtype {
	export namespace config {
		export var trackKeyboard        ; if (trackKeyboard        === undefined) trackKeyboard        = true;
		export var trackMouse           ; if (trackMouse           === undefined) trackMouse           = true;
		export var trackStylus          ; if (trackStylus          === undefined) trackStylus          = true;
		export var trackTouch           ; if (trackTouch           === undefined) trackTouch           = true;
		export var trackGamepad         ; if (trackGamepad         === undefined) trackGamepad         = true;

		export var trackGamepadXbox     ; if (trackGamepadXbox     === undefined) trackGamepadXbox     = true;
		export var trackGamepadSony     ; if (trackGamepadSony     === undefined) trackGamepadSony     = true;
		export var trackGamepadStandard ; if (trackGamepadStandard === undefined) trackGamepadStandard = true;

		// ...
	}

	export var id = undefined;

	const liClassList = [];
	function addCls(cls: string): string { liClassList.push(cls); return cls; }
	export const Keyboard         = addCls("mmk-lastinputtype-keyboard"         );
	export const Mouse            = addCls("mmk-lastinputtype-mouse"            );
	export const Stylus           = addCls("mmk-lastinputtype-stylus"           );
	export const Touch            = addCls("mmk-lastinputtype-touch"            );
	export const GamepadXbox      = addCls("mmk-lastinputtype-gamepad-xbox"     );
	export const GamepadSony      = addCls("mmk-lastinputtype-gamepad-sony"     );
	export const GamepadStandard  = addCls("mmk-lastinputtype-gamepad-standard" );
	export const Controller       = addCls("mmk-lastinputtype-controller"       );

	interface ControllerEntry {
		cls:     string;
		enabled: ()=>boolean;
	}
	type ControllerEntryMap = {[id: string]: ControllerEntry};

	const gamepadIdsToCls : ControllerEntryMap = {
		"Xbox 360 Controller (XInput STANDARD GAMEPAD)": { cls: GamepadXbox, enabled: ()=>config.trackGamepadXbox }
		// TODO: A lot more controller IDs (sony? hotas? pedals?)
	};

	const gamepadMappingsToCls : ControllerEntryMap = {
		"standard": { cls: GamepadStandard, enabled: ()=>config.trackGamepadStandard }
	};

	var deferredBodyClass : string = undefined;
	function setBodyClass(idAndClass: string) {
		id = idAndClass;

		let body = <HTMLBodyElement> document.body;
		if (!body) {
			deferredBodyClass = idAndClass;
		} else {
			deferredBodyClass = undefined;
			liClassList.forEach(cls => {
				if (cls === idAndClass) body.classList.add(cls);
				else                    body.classList.remove(cls);
			});
		}
	}
	addEventListener("load", function() { if (deferredBodyClass !== undefined) setBodyClass(deferredBodyClass); });

	function setKeyboard() { if (config.trackKeyboard) setBodyClass(Keyboard); }
	function setMouse()    { if (config.trackMouse   ) setBodyClass(Mouse   ); }
	function setStylus()   { if (config.trackStylus  ) setBodyClass(Stylus  ); }
	function setTouch()    { if (config.trackTouch   ) setBodyClass(Touch   ); }

	function setPointer(ev: PointerEvent) {
		ev = ev || <PointerEvent>event;
		switch (ev.pointerType) {
			case "mouse": setMouse();  break;
			case "pen":   setStylus(); break;
			case "touch": setTouch();  break;

			case "":
			case null:
			case undefined:
				// ...some other kind of pointing device?  Ignored...
				break;

			default:
				console.warn("Unrecognized PointerEvent.pointerType:", ev.pointerType);
				break;
		}
	}

	addEventListener("keydown",     setKeyboard);
	addEventListener("keyup",       setKeyboard);
	addEventListener("keypress",    setKeyboard);

	addEventListener("wheel",       setMouse);
	addEventListener("mousedown",   setMouse);
	addEventListener("mouseup",     setMouse);
	addEventListener("mousemove",   setMouse);
	addEventListener("mousewheel",  setMouse);

	addEventListener("pointerdown", setPointer);
	addEventListener("pointermove", setPointer);
	addEventListener("pointerup",   setPointer);

	addEventListener("touchstart",  setTouch);
	addEventListener("touchmove",   setTouch);
	addEventListener("touchend",    setTouch);

	function poll(action: ()=>void) {
		if (!('requestAnimationFrame' in window)) {
			setInterval(action, 1000/60);
			action();
		} else {
			var wrapper = () => {
				window.requestAnimationFrame(wrapper);
				action();
			};
			wrapper();
		}
	}

	let lastGamepadUpdate : number = undefined;
	function updateGamepads() {
		if (!config.trackGamepad) return;
		let gamepads = navigator.getGamepads();
		for (let i=0; i<gamepads.length; ++i) {
			let gamepad = gamepads[i];
			if (!gamepad) continue;
			let timestamp = gamepad.timestamp;
			if (lastGamepadUpdate === undefined || lastGamepadUpdate < timestamp) {
				lastGamepadUpdate = timestamp;

				let e = gamepadIdsToCls[gamepad.id]
				if (e && e.enabled()) { setBodyClass(e.cls); return; }

				e = gamepadMappingsToCls[gamepad.mapping];
				if (e && e.enabled()) { setBodyClass(e.cls); return; }

				setBodyClass(Controller);
			}
		}
	}

	if (!('getGamepads' in navigator)) {
		// Don't poll gamepads
	} else if (!('ongamepadconnected' in window)) {
		poll(updateGamepads);
	} else {
		addEventListener("gamepadconnected", function(){
			poll(updateGamepads);
		});
	}
}
