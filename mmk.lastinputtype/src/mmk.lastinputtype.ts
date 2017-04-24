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
	const log = console.log;
	//const log = (message : string, ...optional) => {};

	export namespace config {
		export var trackKeyboard        : boolean; if (trackKeyboard        === undefined) trackKeyboard        = true;
		export var trackMouse           : boolean; if (trackMouse           === undefined) trackMouse           = true;
		export var trackStylus          : boolean; if (trackStylus          === undefined) trackStylus          = true;
		export var trackTouch           : boolean; if (trackTouch           === undefined) trackTouch           = true;
		export var trackGamepad         : boolean; if (trackGamepad         === undefined) trackGamepad         = true;

		export var trackGamepadXbox     : boolean; if (trackGamepadXbox     === undefined) trackGamepadXbox     = true;
		export var trackGamepadSony     : boolean; if (trackGamepadSony     === undefined) trackGamepadSony     = true;
		export var trackGamepadStandard : boolean; if (trackGamepadStandard === undefined) trackGamepadStandard = true;

		export var axisDeadzone         : number ; if (axisDeadzone         === undefined) axisDeadzone         = 0.2;
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

	function isActiveDefault(gamepad: Gamepad): boolean {
		for (let i=0; i<gamepad.buttons.length; ++i) if (gamepad.buttons[i].pressed) { log(gamepad.id, "pressed button", i); return true; }
		for (let i=0; i<gamepad.axes.length;    ++i) if (Math.abs(gamepad.axes[i]) > config.axisDeadzone) { log(gamepad.id, "active axis", i); return true; }
		return false;
	}

	function isActiveSonyDS4Wireless(gamepad: Gamepad): boolean {
		for (let i=0; i<gamepad.buttons.length; ++i) if (i !== 12) if (gamepad.buttons[i].pressed) { log(gamepad.id, "pressed button", i); return true; }
		for (let i=0; i<gamepad.axes.length;    ++i) {
			switch (i) {
				// Triggers are -1..+1, renormalize them to 0..+1 for deadzone calcs
				case 3:  if (Math.abs((gamepad.axes[i]+1)/2) > config.axisDeadzone) { log(gamepad.id, "active axis", i); return true; } break;
				case 4:  if (Math.abs((gamepad.axes[i]+1)/2) > config.axisDeadzone) { log(gamepad.id, "active axis", i); return true; } break;

				// 0,1: left stick - sane values
				// 2,5: right stick - sane values
				// 6,7,8: zero values - unused?

				// Dpad is for some reason encoded as an axis.
				case 9:
					let dpadStateIndex = Math.round( (gamepad.axes[i]+1)*7/2 ); // -1.00 == up, rotating around right until +1.00 = up-left, and +1.285714 = resting.
					// console.log("Sony wireless dpad state:", "up up-right right down-right down down-left left up-left center".split(' ')[Math.round( (gamepad.axes[9]+1)*7/2 )]);
					if (dpadStateIndex !== 8) { log(gamepad.id, "active dpad", dpadStateIndex); return true; }
					break;

				default: if (Math.abs(gamepad.axes[i]) > config.axisDeadzone) { log(gamepad.id, "active axis", i); return true; } break;
			}
		}
		return false;
	}

	interface ControllerEntry {
		chromeId?:         string;
		vendorProductId?:  string;
		mappingId?:        string;
		cls:               string;
		clsEnabled:        ()=>boolean;
		active:            (gamepad: Gamepad)=>boolean;
	}
	type ControllerEntryMap = {[id: string]: ControllerEntry};

	const browserGamepadId_to_ControllerEntry : ControllerEntryMap = {};
	const vendorProductId_to_ControllerEntry  : ControllerEntryMap = {};
	const browserMapping_to_ControllerEntry   : ControllerEntryMap = {};

	const controllerEntries : ControllerEntry[] = [
		{ chromeId: "Xbox 360 Controller (XInput STANDARD GAMEPAD)",                                                   cls: GamepadXbox,     clsEnabled: ()=>config.trackGamepadXbox    , active: isActiveDefault         },
		// NOTE: Xbox One Wireless controllers connected via Microsoft's official wireless dongle will also report as a 360 controller

		{ chromeId: "DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)",     vendorProductId: "054c 0ba0", cls: GamepadSony,     clsEnabled: ()=>config.trackGamepadSony    , active: isActiveSonyDS4Wireless }, // DualShock 4 connected via Official Wireless Dongle (NOTE: nonstandard mapping, with single FUBAR axis for dpad!)
		{ chromeId: "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)", vendorProductId: "054c 09cc", cls: GamepadSony,     clsEnabled: ()=>config.trackGamepadSony    , active: isActiveDefault         }, // DualShock 4 connected via Micro-usb (NOTE: Xinput style mapping, with two extra buttons: B16 (PS button), B17 (Touchpad Click)
		{ chromeId: "PLAYSTATION(R)3 Controller (Vendor: 054c Product: 0268)",           vendorProductId: "054c 0268", cls: GamepadSony,     clsEnabled: ()=>config.trackGamepadSony    , active: isActiveDefault         }, // DualShock 3 connected via Mini-usb  (NOTE: input is dead, nonstandard mapping!)

		// TODO: A lot more controller IDs (sony? hotas? pedals?)

		// Fallback
		{ mappingId: "standard",                                                                                       cls: GamepadStandard, clsEnabled: ()=>config.trackGamepadStandard, active: isActiveDefault         }
	];
	controllerEntries.forEach(gamepad => {
		if (gamepad.chromeId        !== undefined) browserGamepadId_to_ControllerEntry[gamepad.chromeId       ] = gamepad;
		if (gamepad.vendorProductId !== undefined) vendorProductId_to_ControllerEntry [gamepad.vendorProductId] = gamepad;
		if (gamepad.mappingId       !== undefined) browserMapping_to_ControllerEntry  [gamepad.mappingId      ] = gamepad;
	});


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

	function updateGamepads() {
		if (!config.trackGamepad) return;
		let gamepads = navigator.getGamepads();
		for (let i=0; i<gamepads.length; ++i) {
			let gamepad = gamepads[i];
			if (!gamepad) continue;

			let e = browserGamepadId_to_ControllerEntry[gamepad.id]
			if (e) if (!e.active(gamepad)) continue; else if (e.clsEnabled()) { setBodyClass(e.cls); return; }

			if (gamepad.mapping) {
				e = browserMapping_to_ControllerEntry[gamepad.mapping];
				if (e) if (!e.active(gamepad)) continue; else if (e.clsEnabled()) { setBodyClass(e.cls); return; }
			}

			let mVendProd = /[ (]Vendor: ([0-9a-f]+) Product: ([0-9a-f]+)\)$/gi.exec(gamepad.id);
			if (mVendProd) {
				e = vendorProductId_to_ControllerEntry[mVendProd[1]+" "+mVendProd[2]];
				if (e) if (!e.active(gamepad)) continue; else if (e.clsEnabled()) { setBodyClass(e.cls); return; }
			}

			if (!isActiveDefault(gamepad)) continue;
			setBodyClass(Controller);
			return;
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
