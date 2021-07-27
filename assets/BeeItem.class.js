class BeeItem extends ComponentBase {
	constructor(json={}) {
		super();

		this.json = {
			name: 'My Item',
			desc: 'This is my item.',
			auth: 'Baguettery',
			placement: 0b111,
			files:{
				icon: null,
				model: { 'mdl': null, 'vtx': null, 'dx90.vtx': null, 'vvd': null, '3ds': null},
				instances: [ null,  null, null, null, null, null ]
			},
			inputs: [],
			outputs: [],
			picker: 'None',
			mdlpreset: 'sentry.3ds',
			handle: 'HANDLE_4_DIRECTIONS',
			embed: false,
			...json
		}

		this._templateProperties = {
			'name':			(x) => { this.json.name = x.value },
			'desc':			(x) => { this.json.desc = x.value },
			'auth':			(x) => { this.json.auth = x.value },
			'handle':		(x) => { this.json.handle = x.value },
			'model-type':	(x) => { this.json.mdlpreset = x.value },
			'place-floor':	(x) => { this.json.placement = (this.json.placement & 0b011) + x.checked * 0b100 },
			'place-wall':	(x) => { this.json.placement = (this.json.placement & 0b101) + x.checked * 0b010 },
			'place-ceil':	(x) => { this.json.placement = (this.json.placement & 0b110) + x.checked * 0b001 },
		}

		this._templateReplacements = {
			'name': this.json.name,
			'desc': this.json.desc,
			'auth': this.json.auth,
			'handle': this.json.handle,
			'model-type': this.json.mdlpreset,
			'place-floor': (this.json.placement & 0b100) >> 2,
			'place-wall': (this.json.placement & 0b010) >> 1,
			'place-ceil': this.json.placement & 0b001
		}

		this._template = `
			<hr>
			<input data-return="name" placeholder="Item Name"><br>
			<input data-return="desc" placeholder="Item Description"><br>
			<input data-return="auth" placeholder="Item Author">
			<hr>
			<select data-return="handle">
				<option value="HANDLE_NONE">No Handle</option>
				<option value="HANDLE_4_DIRECTIONS">4 Directions</option>
				<option value="HANDLE_36_DIRECTIONS">36 Directions</option>
				<option value="HANDLE_6_POSITIONS">6 Positions</option>
				<option value="HANDLE_8_POSITIONS">8 Positions</option>
			</select><br>
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
					<option value="custom">Custom (Beta)</option>
				</optgroup>
			</select>
			<br>
			<input data-return="model-custom" type="file" multiple disabled><br>
			<label>Allow Placement On</label>
			<section class="item-placement">
				<label>Floor</label><input data-return="place-floor" type="checkbox">
				<label>Walls</label><input data-return="place-wall" type="checkbox">
				<label>Ceiling</label><input data-return="place-ceil" type="checkbox">
			</section>
			<hr>
		`
	}

	export(appendToInfo, createFile) {
		return new Promise(async (resolve, reject) => {

			// png item icon
			await createFile(`resources/BEE2/items/beepkg/${this.idl}.png`,
				await this.readToBuffer(this.json.files.icon));

			// vtf item icon
			await createFile(`resources/materials/models/props_map_editor/palette/beepkg/${this.idl}.vtf`,
				await this.convertToVTF(this.json.files.icon));

			// vmf instances
			for (var inst = 0; inst < this.json.files.instances.length; inst++) {
				if ( this.json.files.instances[inst] == null ) { continue; }
				await createFile(`resources/instances/beepkg/${this.idl}/${inst}.vmf`,
					await this.readToText(this.json.files.instances[inst]));
			}

			// editoritems.txt
			await createFile(`items/${this.idl}/editoritems.txt`,`
// Generated by ComponentBase.Item.export
"Item"
{
	"ItemClass"	"ItemBase"
	"Type"	"${this.id}"
	"Editor"
	{
		"SubType"
		{
			"Name"				"${this.json.name}"
			"Model" { "ModelName"		"${ this.json.mdlpreset == 'custom' ? ('props_beepkg/'+this.idl+'.3ds') : this.json.mdlpreset }" }
			"Palette"
			{
				"Tooltip"		"${this.json.name.toUpperCase()}"
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
				"Disable_cmd" "${ino.disable}"
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
			await createFile(`items/${this.idl}/properties.txt`,`
// Generated by ComponentBase.Item.export
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
			appendToInfo(`
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
			// END
			resolve(true);
		})
	}
}