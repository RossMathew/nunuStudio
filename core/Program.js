function Program(name, description, author, version, vr)
{
	THREE.Object3D.call(this);

	//Program Type
	this.type = "Program";

	//Disable auto matrix updates
	this.rotationAutoUpdate = false;
	this.matrixAutoUpdate = false;

	//Program Info
	this.name = "program";
	this.description = "";
	this.author = "";
	this.version = "0";
	this.vr = false;

	//Collect arguments
	if(name !== undefined)
	{
		this.name = name;
	}
	if(description !== undefined)
	{
		this.description = description;
	}
	if(author !== undefined)
	{
		this.author = author;
	}
	if(version !== undefined)
	{
		this.version = version;
	}
	if(vr !== undefined)
	{
		this.vr = vr;
	}
	
	//Initialization variables
	this.initial_scene = null;

	//Runtime variables
	this.data = function(){};
	this.scene = null;
}

//Function Prototype
Program.prototype = Object.create(THREE.Object3D.prototype);
Program.prototype.icon = "editor/files/icons/script/script.png";

Program.prototype.resize = resize;
Program.prototype.initialize = initialize;
Program.prototype.toJSON = toJSON;
Program.prototype.clone = clone;
Program.prototype.add = add;
Program.prototype.remove = remove;
Program.prototype.setInitialScene = setInitialScene;
Program.prototype.addDefaultScene = addDefaultScene;

//Select initial scene and initialize that scene
function initialize()
{
	if(this.initial_scene !== null)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			if(this.children[i].uuid === this.initial_scene)
			{
				this.scene = this.children[i];
				break;
			}
		}
	}
	else
	{
		this.scene = this.children[0];
	}

	this.scene.initialize();
}

//Set as initial scene (from uuid)
function setInitialScene(scene)
{
	this.initial_scene = scene.uuid;
}

//Create a default scene with sky
function addDefaultScene()
{
	var scene = new Scene();

	//Sky
	var sky = new Sky();
	sky.auto_update = false;
	scene.add(sky);

	//Box
	var material = new THREE.MeshPhongMaterial();
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var model = new Model3D(geometry, material);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "box";
	scene.add(model);

	//Floor
	material = new THREE.MeshPhongMaterial();
	geometry = new THREE.BoxGeometry(20, 1, 20);
 	model = new Model3D(geometry, material);
 	model.position.set(0, -1, 0);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "ground";
	scene.add(model);

	//Add scene to program
	this.add(scene);
}

//Screen resize
function resize(x, y)
{
	if(this.scene !== null)
	{
		this.scene.camera.aspect = x/y;
		this.scene.camera.updateProjectionMatrix();
	}
}

//Remove Scene
function remove(scene)
{
	var index = this.children.indexOf(scene);
	if(index > -1)
	{
		this.children.splice(index, 1);
		scene.parent = null;
	}

	//If no scene on program set actual scene to null
	if(this.children.length === 0)
	{
		this.scene = null;
	}
}

//Add scene
function add(scene)
{
	if(scene instanceof Scene)
	{
		this.children.push(scene);
		scene.parent = this;

		//If first scene set as actual scene
		if(this.children.length === 1)
		{
			this.scene = this.children[0];
		}
	}
}

//Clone program keep uuid and everything else
function clone()
{
	var data = this.toJSON();
	var loader = new ObjectLoader();
	return loader.parse(data);
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.description = this.description;
	data.object.author = this.author;
	data.object.version = this.version;
	data.object.vr = this.vr;
	
	if(this.initial_scene !== null)
	{
		data.object.initial_scene = this.initial_scene;
	}

	return data;
}