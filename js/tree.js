(function(){

//Base Node of Tree
//Provide base array functionality
//with custom data (get, set methods)
//Search, Add, Remove elements
function TreeElementModel(initialData)
{
	if (initialData)
	{
		this._data = initialData;
	}
	else
	{
		this._data = {
			"title":"New node",
			"description":"",
			"id":GUID()
		};
	}
}

TreeElementModel.prototype = new Array();
$.extend(TreeElementModel.prototype, {
	get:function(){
		if (arguments.length==1)
		{
			return this._data[arguments[0]];
		}
		return $.extend({}, this._data); //return copy of all data by default
	},
	set:function(){
		if (arguments.length==1)
		{
			this._data = arguments[0];
		}
		else
		{
			this._data[arguments[0]] = arguments[1];
		}
	},
	indexOf:function(id){
		var found = -1;
		this.some(function(el, index){
			if (el.get('id')==id)
			{
				found = index;
				return true;
			}
		});
		return found;
	},
	search:function(id){
		var found = null;
		this.some(function(el){
			if (el.get('id')==id)
			{
				found = el;
			}
			else
			{
				found = el.search(id);
			}
			return !!found;  //convert to boolean
		});
		return found;
	},
	remove:function(id){
		var found = this.indexOf(id);
		if (found!=-1)
		{
			this.splice(found, 1);
			return true;
		}
		else
		{
			return this.some(function(el){
				return el.remove(id);
			});
		}
	},
	clear:function(){
		while(this.length>0)
		{
			this.pop();
		}
	}
})

angular.module('Tree', [
])

.factory('TreeModel', function(){
	return function(){
		var tree = new TreeElementModel({
			"title":"ROOT",
			"id":0,
		});
		return {
			get:function(){
				return tree;
			},
			createNode:function(data){
				return new TreeElementModel(data);
			},
			search:function(id){
				return tree.search(id);
			},
			addTo:function(newNode, parentNodeId){
				var newNodeId = newNode.get('id');
				var parentNode = parentNodeId ? this.search(parentNodeId) : tree;
				//check for integrity
				if (this.search(newNodeId))
				{
					throw new Error("Duplicate ID.");
				}
				if (!parentNode)
				{
					throw new Error("Parent node not found.");
				}
				return parentNode.push(newNode);
			},
			remove:function(id){
				return tree.remove(id);
			},
			clear:function(id){
				tree.clear();
			}
		};
	}
})

.directive('treeCollection', function(){
	
  return {
      restrict:'E',
      require: ['ngModel'],
      scope:{
      	collection:'=ngModel',
      	controller:'=',
      },
      controller:['$scope', '$filter', '$parse', function($scope, $filter, $parse){
				$scope.getNumber = function(num)
				{
					var a = [];
					for(var i=0;i<num;i++)
					{
						a[i] = i;
					}
				  return a;
				}
        $scope.isCollapsed = function(node)
        {
        	return !node.$expanded;
        }
        $scope.expand = function(node)
        {
        	node.$expanded = true;
        	return true;
        }
        $scope.toggle = function(node)
        {
      		node.$expanded = !node.$expanded;
        }
        $scope.hasChilds = function(node)
        {
        	return node.length>0;
        }
      }],
      link:function($scope, $element, $attributes, aController){
      	var level = +$attributes.level;
      	$scope.level = level||0;
      },
      templateUrl:'tree-template.html'
  }

})


})();
