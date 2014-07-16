//Generate Unique ID
function GUID()
{
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}


angular.module('TreeUtils', [])

//allow recursive directive
.directive("recursive", function($compile) {
  return {
    restrict: "EACM",
    priority: 100000,
    compile: function(tElement, tAttr){
      var contents = tElement.contents().remove();
      var compiledContents;
      return function(scope, iElement, iAttr){
        if(!compiledContents)
        {
          compiledContents = $compile(contents);
        }
        iElement.append(
          compiledContents(scope, function(clone){
          	return clone;
          })
        );
      };
    }
  };
})
