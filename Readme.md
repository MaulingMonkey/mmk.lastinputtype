# mmk.lastinputtype

MaulingMonKey's basic API for tracking the type of input device last used.

Defines classes directly on the body, allowing fancy CSS transitions of your choice with no other configuration.
Alternatively, `mmk.lastinputtype.id === mmk.lastinputtype.Keyboard` is provided for a programatic option.
Set/define `mmk.lastinputtype.config.trackXYZ = false` to disable input types you don't care about.

License: [Apache 2.0](LICENSE.txt)



# [Example](http://maulingmonkey.com/mmk.lastinputtype/mmk.lastinputtype/)

[mmk.lastinputtype.css](mmk.lastinputtype/res/mmk.lastinputtype.css)
```css
/* ... */
.mmk-lastinputtype-keyboard          .highlight-keyboard         { color: #FFF; background: #48F; }
.mmk-lastinputtype-mouse             .highlight-mouse            { color: #FFF; background: #48F; }
.mmk-lastinputtype-stylus            .highlight-stylus           { color: #FFF; background: #48F; }
.mmk-lastinputtype-touch             .highlight-touch            { color: #FFF; background: #48F; }
.mmk-lastinputtype-gamepad-xbox      .highlight-gamepad-xbox     { color: #FFF; background: #48F; }
.mmk-lastinputtype-gamepad-sony      .highlight-gamepad-sony     { color: #FFF; background: #48F; }
.mmk-lastinputtype-gamepad-standard  .highlight-gamepad-standard { color: #FFF; background: #48F; }
.mmk-lastinputtype-controller        .highlight-controller       { color: #FFF; background: #48F; }
```

[index.html](mmk.lastinputtype/index.html)
```html
<!-- ... -->
<table>
	<tr><th>Last Input Type</th></tr>
	<tr><td class="highlight-keyboard"         >Keyboard</td></tr>
	<tr><td class="highlight-mouse"            >Mouse</td></tr>
	<tr><td class="highlight-stylus"           >Stylus</td></tr>
	<tr><td class="highlight-touch"            >Touch</td></tr>
	<tr><td class="highlight-gamepad-xbox"     >Xbox Gamepad</td></tr>
	<tr><td class="highlight-gamepad-sony"     >Sony Gamepad (NYI)</td></tr>
	<tr><td class="highlight-gamepad-standard" >"Standard" Gamepad</td></tr>
	<tr><td class="highlight-controller"       >Nonstandard Controller</td></tr>
</table>
<!-- ... -->
```

Live demo: [Example](http://maulingmonkey.com/mmk.lastinputtype/mmk.lastinputtype/)

See also: [HTML5 Gamepad Tester](http://html5gamepad.com/)



# Compatability / Testing

| Browser   | Status   | Notes                                     |
| --------- | -------- | ----------------------------------------- |
| Chrome 75 | OK       |                                           |
| IE 11     | OK       | No gamepad API/support                    |
| ...       | Untested | Should work if addEventListener available |

| Input Type          | CSS Class                           | Status                                              |
| ------------------- | ----------------------------------- | --------------------------------------------------- |
| Keyboard            | .mmk-lastinputtype-keyboard         | OK                                                  |
| Mouse               | .mmk-lastinputtype-mouse            | OK                                                  |
| Stylus          [2] | .mmk-lastinputtype-stylus           | Untested                                            |
| Touch               | .mmk-lastinputtype-touch            | Untested                                            |
| GamepadXbox     [1] | .mmk-lastinputtype-gamepad-xbox     | Partial (Wired 360 Controllers should identify)     |
| GamepadSony     [1] | .mmk-lastinputtype-gamepad-sony     | NYI                                                 |
| GamepadStandard [1] | .mmk-lastinputtype-gamepad-standard | OK                                                  |
| Controller      [1] | .mmk-lastinputtype-controller       | OK                                                  |

[1] Requires browser support for the gamepad API

[2] Requires browser support for pointer events

| Controller                | Status                                            |
| ------------------------- | ------------------------------------------------- |
| Xbox 360 Wired Controller | OK                                                |
| Xbox One Controllers      | NYI (GamepadStandard?)                            |
| Dualshock Controllers     | NYI (GamepadStandard?)                            |
| ...                       | NYI (GamepadStandard?)                            |
| ...                       | NYI (Controller)                                  |



# TODO

* Sony / dualshock controller support
* Leverage https://github.com/gabomdq/SDL_GameControllerDB ?  No javascript gamepad ids though.
* Add options to disable minor mouse motion and other "false" positives for last input switching
* Publish nuget package



# Installation

## Via NuGet

* <strike>Add [mmk.lastinputtype](https://www.nuget.org/packages/mmk.lastinputtype/) to your project via nuget.</strike> **Soon(tm)**
* <strike>Add `<script src="mmk.lastinputtype.js"></script>` to your HTML</strike> **TODO: determine where this actually ends up**
* Profit
