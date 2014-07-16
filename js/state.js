angular.module('TreeStateService', [
  'LocalStorageModule',
])

.run(function(LocalStorage){
	var storageName = "TreeState";
	var data = LocalStorage.get(storageName);
	if (!data)
	{
		LocalStorage.set(storageName, []); //save default value to local storage
	}
})

.service('TreeState', function(){
	//save Tree state to new object
	function serialize(tree)
	{
		return tree.map(function(el){
			var data = {
				"d":el.get(), //short keynames to reduce size in localStorage
				"c":serialize(el)
			};
			return data;
		})
	}

	//load saved state into Tree
	function injectNodes(tree, parentNode, stateData)
	{
		stateData.forEach(function(nodeState){
			var node = tree.createNode(nodeState.d);
			tree.addTo(node, parentNode.get('id'));
			injectNodes(tree, node, nodeState.c);
		});
	}
	return {
		serialize:function(tree){
			return serialize(tree.get());
		},
		loadState:function(tree, state){
			state = state||[]; //handle null,undefined values
			tree.clear();
			injectNodes(tree, tree.get(), state);
		}
	}
})

.service('TreeLocalStorageState', function(TreeState, LocalStorage){

	var storageName = "TreeState";
	var storage = LocalStorage.get(storageName);

	return {
		save:function(tree){
			var data = TreeState.serialize(tree);
			var title = "Tree State:"+(new Date());
			storage.push({
				"title":title,
				"data":data
			});
			LocalStorage.set(storageName, storage);
			return title;
		},
		load:function(tree, state){
			TreeState.loadState(tree, state.data);
		},
		list:function(){
			return LocalStorage.get(storageName);
		}
	}
})

