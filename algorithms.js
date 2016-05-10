Algorithms = (function() {
	var oldAlgorithm = function(friends, delta) {
		var isGood = function(users, n, c, delta) {
			if(_.intersection(n, c).length < (1 - delta) * c.length)
				return false;

	        return _.intersection(n, _.difference(users, c)).length <= delta * c.length;
    	};

    	var used = [];
	    var groups = {name: "Пользователь", children: []};
	    var index = 0;
	    var users = $.map(friends, function(friend) { return friend.uid; });
	    while(users && users.length > 0 && index < users.length) {
	      var v = users[index];
	      var f = friends.find(function(element, index, array) { return element.uid == v; }).friends || [];
	      var a = $.grep(f, function(id){
	      	return !_.contains(used, id);
	      });
	      a.push(v);
	      var removed = true;
	      while (removed) {
	        removed = false;
	        $.each(a, function(index, x) {
	        	var fr = friends.find(function(element, index, array) { return element.uid == x; }).friends || [];
	        	var n = $.grep(fr, function(id) {
	        		return !_.contains(used, id);
	        	});
	        	n.push(x);
	        	if (!isGood(users, n, a, 3*delta)) {
	        		var i = a.indexOf(x);
	            	if (i > -1) {
	              		a.splice(i, 1);
	            	}

		            removed = true;
		            return false;
	          	}
	        });
	      }

	      $.each(users, function(index, user) {
	        if (_.contains(a, user))
	          return true;

			var fr = friends.find(function(element, index, array) { return element.uid == user; }).friends || [];
	        var n = $.grep(fr, function(id) {
	        	return !_.contains(used, id);
	        });

	        n.push(user);
	        if (isGood(users, n, a, 7*delta))
	          a.push(user);
	      });

	      if (a && a.length > 0) {
	        var group = {};
	        group.name = a.length;	        
	        group.children = $.map(a, function(id) {
	          var i = users.indexOf(id);
	            if (i > -1) {
	              users.splice(i, 1);
	              used.push(id);
	            }
	          var user = friends.find(function(element, index, array) { return element.uid == id; });
	          user.name = (user.last_name || '' ) + ' ' + (user.first_name || '');
	          user.size = 100;
	          return user;
	        });
	        groups.children.push(group);
	        group.size = a.length;
	        index = 0;
	      }
	      else {
	        index++;
	      }
	    }

	    return groups;
	};

	return {
		oldAlgorithm: oldAlgorithm
	}
}());