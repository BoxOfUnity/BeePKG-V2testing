import { ComponentBase } from "./ComponentBase.class.js";
import { _ } from "./Escape.util.js";
var isbtntype = false;
export class BeeItem extends ComponentBase {
	constructor(parent, json = {}) {
		super();

		var buttonTypeInstanceHandler = ``
		var buttonTypeInstances = ``

		this.parent = parent;

		this.json = {
			name: 'Item name',
			desc: 'Item description',
			auth: 'Your name',
			placement: 0b111,
			files: {
				icon: null,
				model: { 'mdl': null, 'vtx': null, 'dx90.vtx': null, 'vvd': null, '3ds': null },
				instances: [null, null, null, null, null, null]
			},
			inputs: [],
			outputs: [],
			picker: 'single',
			mdlpreset: 'sentry.3ds',
			handle: 'HANDLE_4_DIRECTIONS',
			embed: false,
			...json
		}

		// editoritems template sections (idk what's happening)
		this._templateProperties = {
			'name': (x) => { this.json.name = x.value },
			'desc': (x) => { this.json.desc = x.value },
			'auth': (x) => { this.json.auth = x.value },
			'handle': (x) => { this.json.handle = x.value },
			'model-type': (x) => { this.json.mdlpreset = x.value },
			'place-floor': (x) => { this.json.placement = (this.json.placement & 0b011) + x.checked * 0b100 },
			'place-wall': (x) => { this.json.placement = (this.json.placement & 0b101) + x.checked * 0b010 },
			'place-ceil': (x) => { this.json.placement = (this.json.placement & 0b110) + x.checked * 0b001 },
			'item-icon': (x) => { this.json.files.icon = x.files[0] },
			'item-inst-0': (x) => { this.json.files.instances[0] = x.files[0] },
			'item-inst-1': (x) => { this.json.files.instances[1] = x.files[0] },
			'item-inst-2': (x) => { this.json.files.instances[2] = x.files[0] },
			'item-inst-3': (x) => { this.json.files.instances[3] = x.files[0] },
			'item-inst-4': (x) => { this.json.files.instances[4] = x.files[0] },
			'item-inst-5': (x) => { this.json.files.instances[5] = x.files[0] },
			'item-picker': (x) => { this.handleInstanceSetup(x.value, this) },
			'item-embed': (x) => { this.json.embed = x.checked }
		}

		this._templateReplacements = {
			'name': this.json.name,
			'desc': this.json.desc,
			'auth': this.json.auth,
			'handle': this.json.handle,
			'model-type': this.json.mdlpreset,
			'place-floor': (this.json.placement & 0b100) >> 2,
			'place-wall': (this.json.placement & 0b010) >> 1,
			'place-ceil': this.json.placement & 0b001,
			'item-picker': this.json.picker,
			'item-embed': this.json.embed
		}

		//easy enough
		this._templateClickActions = {
			'item-delete': () => { this.parent.json.items = this.parent.json.items.filter(x => { return x !== this; }); this._html.remove(); },
			'add-input': () => { this.addInput() },
			'add-output': () => { this.addOutput() }
		}

		//ok- its the drop downs for handle and editor model and stuff- no its the whole page ig- okay
		this._template = `
			<hr>
			<input data-return="name" placeholder="Item name"><br>
			<input data-return="desc" placeholder="Item Description"><br>
			<input data-return="auth" placeholder="Your name">
			<hr>
			<label>Rotation Handle</label>
			<select data-return="handle">
				<option value="HANDLE_NONE">No Handle</option>
				<option value="HANDLE_4_DIRECTIONS">4 Directions</option>
				<option value="HANDLE_36_DIRECTIONS">36 Directions</option>
				<option value="HANDLE_6_POSITIONS">6 Positions</option>
				<option value="HANDLE_8_POSITIONS">8 Positions</option>
			</select><br>
			<label>Editor Model</label>
			<select data-return="model-type">
				<optgroup label="——— Generic ———">
					<option value="sentry.3ds">Turret</option>
					<option value="light_strip.3ds">Light Strip</option>
				</optgroup>
				<optgroup label="——— Cubes ———">
					<option value="cube.3ds">Cube (Normal)</option>
					<option value="cubecompanion.3ds">Cube (Companion)</option>
					<option value="cubelaser.3ds">Cube (Redirection)</option>
					<option value="cubesphere.3ds">Cube (Edgeless)</option>
				</optgroup>
				<optgroup label="——— Buttons ———">
					<option value="buttonweight.3ds">Floor Button (Weighted)</option>
					<option value="buttoncube.3ds">Floor Button (Cube)</option>
					<option value="buttonball.3ds">Floor Button (Sphere)</option>
				</optgroup>
				<optgroup label="——— Custom ———">
					<option value="custom">Custom</option>
				</optgroup>
			</select>
			<br>
			<label>Embed Voxel</label>		<input data-return="item-embed" type="checkbox"><br>
			<label>Allow Placement On</label>
			<section class="item-placement">
				<label>Floor</label>		<input data-return="place-floor" type="checkbox">
				<label>Walls</label>		<input data-return="place-wall" type="checkbox">
				<label>Ceiling</label>		<input data-return="place-ceil" type="checkbox">
			</section>
			<hr>
			<label>Item Icon (png)</label>
			<input data-return="item-icon" type="file"><br>
			<hr>
			<label>Item Picker Type</label>
			<select data-return="item-picker">
				<option value="single">(1) Single Instance</option>
				<option value="singleWB">(2) White/Black Instance</option>
				<option value="buttontype">(3) Button Type Instances</option>
				<option value="buttontypeWB">(6) White/Black Button Type Instance</option>
			</select><br>
			<div data-inst-index=0><label>Item Instance 1</label><input data-return="item-inst-0" type="file"></div>
			<div data-inst-index=1><label>Item Instance 2</label><input data-return="item-inst-1" type="file"></div>
			<div data-inst-index=2><label>Item Instance 3</label><input data-return="item-inst-2" type="file"></div>
			<div data-inst-index=3><label>Item Instance 4</label><input data-return="item-inst-3" type="file"></div>
			<div data-inst-index=4><label>Item Instance 5</label><input data-return="item-inst-4" type="file"></div>
			<div data-inst-index=5><label>Item Instance 6</label><input data-return="item-inst-5" type="file"></div>
			<hr>
			<button data-click="add-input">Add Input</button>
			<section data-section="item-inputs"></section>
			<hr>
			<button data-click="add-output">Add Output</button>
			<section data-section="item-outputs"></section>
			<hr>
			<button data-click="item-delete">Delete Item</button>
		`
	}
	
	handleInstanceSetup(val,self) {
		self.json.picker = val;
		function setState(ind, isHidden, labelText) {
			const e = self._html.querySelector(`*[data-inst-index="${ind}"]`)
			e.children[0].innerText = labelText;
			e.hidden = isHidden;
		}
		switch (val) {
			case 'single':
				setState(0,false,'Item Instance');
				setState(1,true,'(Unused)');
				setState(2,true,'(Unused)');
				setState(3,true,'(Unused)');
				setState(4,true,'(Unused)');
				setState(5,true,'(Unused)');
				this.buttonTypeInstanceHandler = ``
				break;
			case 'singleWB':
				setState(0,false,'Item Instance (White)');
				setState(1,false,'Item Instance (Black)');
				setState(2,true,'(Unused)');
				setState(3,true,'(Unused)');
				setState(4,true,'(Unused)');
				setState(5,true,'(Unused)');
				this.buttonTypeInstanceHandler = ``
				break;
			case 'buttontype':
					setState(0,false,'Item Instance (Weighted)');
					setState(1,true,'(Unused)');
					setState(2,false,'Item Instance (Cube)');
					setState(3,true,'(Unused)');
					setState(4,false,'Item Instance (Sphere)');
					setState(5,true,'(Unused)');
					this.buttonTypeInstanceHandler =
`       "ButtonType"
        {
            "DefaultValue"    "0"
            "Index"    "2"
        }`

					break;
			case 'buttontypeWB':
				setState(0,false,'Item Instance (Weighted) (White)');
				setState(1,false,'Item Instance (Weighted) (Black)');
				setState(2,false,'Item Instance (Cube) (White)');
				setState(3,false,'Item Instance (Cube) (Black)');
				setState(4,false,'Item Instance (Sphere) (White)');
				setState(5,false,'Item Instance (Sphere) (Black)');
				this.buttonTypeInstanceHandler =
`       "ButtonType"
        {
            "DefaultValue"    "0"
            "Index"    "2"
        }`
				break;
		}
	}

	html() {
		const el = super.html();
		this.handleInstanceSetup( this.json.picker, this );

		const json = {...this.json};

		if ( json.inputs && json.inputs.length ) {
			this.json.inputs = [];
			json.inputs.forEach(inp => {
				this.addInput( inp.enable, inp.disable )
			});
		}

		if ( json.outputs && json.outputs.length ) {
			this.json.outputs = [];
			json.outputs.forEach(opt => {
				this.addOutput( opt.activate, opt.deactivate )
			});
		}

		return el;
	}

	/* The addInput/addOutput methods and their respective generated HTML are quite janky. A more modular solution for the future would be more ideal. */
	addInput(enableValue='', disableValue='') {
		const iel = document.createElement('SECTION');
		iel.innerHTML = `
			<label>Enable Command</label>	<input data-return="input-enable"	placeholder="mylight,TurnOn,,0,-1"><br>
			<label>Disable Command</label>	<input data-return="input-disable"	placeholder="mylight,TurnOff,,0,-1">
			<hr>
			<button data-click="input-delete">Delete Input</button>
		`
		const enableCmd  = iel.querySelector('input[data-return="input-enable"]')
		const disableCmd = iel.querySelector('input[data-return="input-disable"]')
		const delButton  = iel.querySelector('button[data-click="input-delete"]')

		var inputDict = { enable: enableValue, disable: disableValue }

		enableCmd.value	 = enableValue;
		disableCmd.value = disableValue;

		enableCmd.oninput  = () => { inputDict.enable  = enableCmd.value;  }
		disableCmd.oninput = () => { inputDict.disable = disableCmd.value; }
		delButton.onclick  = () => { this.json.inputs = this.json.inputs.filter(x => { return x != inputDict; }); delButton.parentElement.remove() }

		this.json.inputs.push(inputDict);

		this._html.querySelector('[data-section="item-inputs"]').appendChild(iel);
	}

	addOutput(activateValue='', deactivateValue='') {
		const iel = document.createElement('SECTION');
		iel.innerHTML = `
			<label>Activate Event</label>	<input data-return="output-activate"	placeholder="instance:relay_enable;onTrigger"><br>
			<label>Deactivate Event</label>	<input data-return="output-deactivate"	placeholder="instance:relay_disable;onTrigger">
			<hr>
			<button data-click="output-delete">Delete Output</button>
		`
		const activateCmd  = iel.querySelector('input[data-return="output-activate"]')
		const deactivateCmd = iel.querySelector('input[data-return="output-deactivate"]')
		const delButton  = iel.querySelector('button[data-click="output-delete"]')

		var outputDict = { activate: activateValue, deactivate: deactivateValue }

		activateCmd.value	= activateValue;
		deactivateCmd.value = deactivateValue;

		activateCmd.oninput   = () => { outputDict.activate   = activateCmd.value;   }
		deactivateCmd.oninput = () => { outputDict.deactivate = deactivateCmd.value; }
		delButton.onclick     = () => { this.json.outputs = this.json.outputs.filter(x => { return x != outputDict; }); delButton.parentElement.remove() }

		this.json.outputs.push(outputDict);

		this._html.querySelector('[data-section="item-outputs"]').appendChild(iel);
	}

	exportSubtypes() {
		const gSubtype = () => {
			return `"SubType"
		{
			"Name"				"${this.json.name}"
			"Model" { "ModelName"		"${ this.json.mdlpreset == 'custom' ? ('props_beepkg/'+this.idl+'.3ds') : this.json.mdlpreset }" }
			"Palette"
			{
				"Tooltip"		"${_(this.json.name.toUpperCase())}"
				"Image"			"palette/beepkg/${this.idl}.png"
				"Position"		"4 2 0"
			}
			"Sounds"
			{
			"SOUND_CREATED"			"P2Editor.PlaceOther"
			"SOUND_EDITING_ACTIVATE"	"P2Editor.ExpandOther"
			"SOUND_EDITING_DEACTIVATE"	"P2Editor.CollapseOther"
			"SOUND_DELETED"			"P2Editor.RemoveOther"
			}
			"Animations"
			{
				"ANIM_IDLE"			"0"
				"ANIM_EDITING_ACTIVATE"		"1"
				"ANIM_EDITING_DEACTIVATE"	"2"
			}
		}
		`
		}
		var len = 1;
		if (this.json.picker.startsWith('buttontype')) { len = 3 }
		return Array(len).fill(0).map(gSubtype).join('')
	}

	async export(appendToInfo, createFile) {

		// Rudimentary icon checks
		if (!this.json.files.icon)
			throw(`Item ${this.id} missing an icon!`)
		if (this.json.files.icon.size >= 100000000)
			throw(`Item ${this.id} has an unusually large icon!`)

		// png item icon
		await createFile(`resources/BEE2/items/beepkg/${this.idl}.png`,
			await this.readToBuffer(this.json.files.icon));

		// vtf item icon
		await createFile(`resources/materials/models/props_map_editor/palette/beepkg/${this.idl}.vtf`,
			await this.convertToVTF(this.json.files.icon));

		// vmf instances
		for (var inst = 0; inst < this.json.files.instances.length; inst++) {
			if ( this.json.files.instances[inst] == null ) { continue; }
			await createFile(`resources/instances/beepkg/${this.idl}/${this.idl}_${inst}.vmf`,
				await this.readToText(this.json.files.instances[inst]));
		}

		
		// editoritems.txt
		await createFile(`items/${this.idl}/editoritems.txt`,`// Generated by ComponentBase.BeeItem.export
"Item"
{
	"ItemClass"	"${this.json.picker.endsWith('WB') ? 'ItemButtonFloor' : 'ItemBase'}"
	"Type"	"${this.id}"
	"Editor"
	{
		${ this.json.picker.startsWith('buttontype') ? '"SubTypeProperty"	"ButtonType"' : ''} 
		${ this.exportSubtypes() }
		"MovementHandle"	"${this.json.handle}"
		"InvalidSurface" 	"${ (((this.json.placement&0b100) == 0b100) ? '':'FLOOR ') + (((this.json.placement&0b010) == 0b010) ? '':'WALL ') + (((this.json.placement&0b001) == 0b001) ? '':'CEILING') }"
		"DesiredFacing"		"DESIRES_ANYTHING"
		"CanAnchorOnGoo"	"0"
		"CanAnchorOnBarriers"	"0"
	}
	"Properties"
	{
		"ConnectionCount"
		{
			"DefaultValue"	"0"
			"Index"	"1"
		}
		${this.buttonTypeInstanceHandler}
	}
	"Exporting"
	{
		"Inputs"
		{
${
this.json.inputs.map(inp => {
	return `
			"BEE2"
			{
				"Type"	"AND"
				"Enable_cmd" "${inp.enable}"
				"Disable_cmd" "${inp.disable}"
			}
`
})
}
		}
		"Outputs"
		{
${
this.json.outputs.map(outp => {
	return `
			"BEE2"
			{
				"Type"	"AND"
				"out_activate" "${outp.activate}"
				"out_deactivate" "${outp.deactivate}"
			}
`
})
}
		}
		"Instances"
		{
			"0"
			{
				"Name" "instances/BEE2/beepkg/${this.idl}/${this.idl}_0.vmf"
				"EntityCount"	"0"
				"BrushCount"	"0" 
				"BrushSideCount"	"0"
			}
			"1"
			{
				"Name" "instances/BEE2/beepkg/${this.idl}/${this.idl}_1.vmf"
				"EntityCount"	"0"
				"BrushCount"	"0" 
				"BrushSideCount"	"0"
			}
			"2"
			{
				"Name" "instances/BEE2/beepkg/${this.idl}/${this.idl}_2.vmf"
				"EntityCount"	"0"
				"BrushCount"	"0" 
				"BrushSideCount"	"0"
			}
			"3"
			{
				"Name" "instances/BEE2/beepkg/${this.idl}/${this.idl}_3.vmf"
				"EntityCount"	"0"
				"BrushCount"	"0" 
				"BrushSideCount"	"0"
			}
			"4"
			{
				"Name" "instances/BEE2/beepkg/${this.idl}/${this.idl}_4.vmf"
				"EntityCount"	"0"
				"BrushCount"	"0" 
				"BrushSideCount"	"0"
			}
			"5"
			{
				"Name" "instances/BEE2/beepkg/${this.idl}/${this.idl}_5.vmf"
				"EntityCount"	"0"
				"BrushCount"	"0" 
				"BrushSideCount"	"0"
			}
		}
${
	this.json.embed ? `
		"OccupiedVoxels"
		{
			"Voxel"
			{
				"Pos"		"0 0 0"
				"Surface"
				{
					"Normal"	"0 0 1"
				}
			}
		}
		"EmbeddedVoxels"
		{
			"Voxel"
			{
				"Pos"		"0 0 0"
			}
		}` : ''
}
		"ConnectionPoints"
		{
			// left
			"Point"
			{
				"Dir"				"1 0 0"
				"Pos"				"-1 3 0"
				"SignageOffset"		"-2 2 0"
				"Priority"  "0"
			}
			"Point"
			{
				"Dir"				"1 0 0"
				"Pos"				"-1 4 0"
				"SignageOffset"		"-2 5 0"
				"Priority"  "0"
			}
			// right
			"Point"
			{
				"Dir"				"-1 0 0"
				"Pos"				"8 3 0"
				"SignageOffset"		"9 2 0"
				"Priority"  "0"
			}
			"Point"
			{
				"Dir"				"-1 0 0"
				"Pos"				"8 4 0"
				"SignageOffset"		"9 5 0"
				"Priority"  "0"
			}
			// up
			"Point"
			{
				"Dir"				"0 1 0"
				"Pos"				"3 -1 0"
				"SignageOffset"		"2 -2 0"
				"Priority"  "0"
			}
			"Point"
			{
				"Dir"				"0 1 0"
				"Pos"				"4 -1 0"
				"SignageOffset"		"5 -2 0"
				"Priority"  "0"
			}
			// down
			"Point"
			{
				"Dir"				"0 -1 0"
				"Pos"				"3 8 0"
				"SignageOffset"		"2 9 0"
				"Priority"  "0"
			}
			"Point"
			{
				"Dir"				"0 -1 0"
				"Pos"				"4 8 0"
				"SignageOffset"		"5 9 0"
				"Priority"  "0"
			}
		}
		"TargetName"	"name"
		"Offset"	"64 64 64"
	}
}
`);
	
		// properties.txt
		await createFile(`items/${this.idl}/properties.txt`,`// Generated by ComponentBase.BeeItem.export
"Properties" {
	"Authors" "${this.json.auth}"
	"Description" "${this.json.desc}"
	"Icon"
	{
		"0" "beepkg/${this.idl}.png"
	}
}
`);
		// info.txt
		appendToInfo(`// Generated by ComponentBase.BeeItem.export
"Item"
{
	"ID"  "${this.id}"
	"Version"
	{
		"Styles"
		{
			"BEE2_CLEAN" "${this.idl}"
		}
	}
}`);
/*if  (this.buttonTypeInstanceHandler != ``) {
		await createFile(`items/${this.idl}/vbsp_config.cfg`,`//Comment lmao
"Conditions" {
   "Condition" {
      "Instance" "<${this.id}>"
      "Result" {
            "Switch" {
                "Flag" "instvar"
                "$button_type = 0" {
                    "ChangeInstace" "instances/BEE2/beepkg/${this.idl}/${this.idl}_0.vmf"
                }
                "$button_type = 1" {
                    "ChangeInstace" "instances/BEE2/beepkg/${this.idl}/${this.idl}_2.vmf"
                }
                "$button_type = 2" {
                    "ChangeInstace" "instances/BEE2/beepkg/${this.idl}/${this.idl}_4.vmf"
                }
            }
        }
    }
}`);
console.log("VBSP_CONFIG MADE")
		}*/
		// END
		return true;
	}
	}
