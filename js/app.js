angular.module('TreeApp', [
  'ui.bootstrap',
  'Tree',
  'TreeUtils',
  'TreeStateService'
])

.run(function(TreeModel, TreeState, TreeLocalStorageState){
})

.controller('TreeAppController', function($scope, $modal, TreeModel, TreeLocalStorageState){

	$scope.tree = new TreeModel();
	$scope.treeModel = $scope.tree.get();

	//generate default values
	var node = $scope.tree.createNode();
	node.set('title', 'Element 1');
	$scope.tree.addTo(node);
	var node = $scope.tree.createNode();
	node.set('title', 'Element 2');
	$scope.tree.addTo(node);
	var node = $scope.tree.createNode();
	node.set('title', 'Element 3');
	$scope.tree.addTo(node);

	$scope.save = function()
	{
		TreeLocalStorageState.save($scope.tree);
		alert("Saved!");
	}

	$scope.addTop = function()
	{

	}

	$scope.restoreModal = function()
	{
		var scope = $scope.$new();
		scope.list = TreeLocalStorageState.list();
		$modal.open({
			"templateUrl":'saved-list.html',
			"scope":scope
		}).result.then(function(state){
			TreeLocalStorageState.load($scope.tree, state);
    });
	}


	$scope.remove = function(node)
	{
		if (confirm("Are you sure want to remove this node?"))
		{
			$scope.tree.remove(node.get('id'));
		}
	}

	$scope.edit = function(node)
	{
		var scope = $scope.$new();
		scope.new = false;
		scope.data = node.get();
		$modal.open({
			"templateUrl":'edit-node.html',
			"scope":scope
		}).result.then(function(data){
			node.set(data);
    });
	}

	$scope.add = function(node)
	{
		var scope = $scope.$new();
		scope.new = true;
		var newNode = $scope.tree.createNode();
		scope.data = newNode.get();
		$modal.open({
			"templateUrl":'edit-node.html',
			"scope":scope
		}).result.then(function(data){
			if (node)
			{
				$scope.tree.addTo(newNode, node.get('id'));
			}
			else
			{
				$scope.tree.addTo(newNode);
			}
    });
	}


})