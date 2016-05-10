Algorithms = (function() {
	var	nodes = []; 
	var neighbors = [];
	var graph;

	var initGrapth = function(_graph){
		graph = _graph;
		$.each(graph, function(index, node) {
			nodes.push(node.id);
			neighbors[node.id] = node.neighbors.slice();
		});
	};

	var findCommunity = function(_graph){
		if(!graph)
			initGrapth(_graph);

		var m = 0;
		$.each(nodes, function(index, node) {
			m += neighbors[node] ? neighbors[node].length : 0;
		});
		m /= 2;

		var a = {};
		$.each(nodes, function(index, node) {
			a[node] = neighbors[node] ? neighbors[node].length / (2 * m) : 0;
		});

		var deltaQ = {};		
		$.each(nodes, function(i, nodeI){
			deltaQ[nodeI] = {nodes: [nodeI]};
			$.each(nodes, function(j, nodeJ){
				deltaQ[nodeI][nodeJ] = (neighbors[nodeI].indexOf(nodeJ) != -1) ? 1/(2*m) - a[nodeI] * a[nodeJ] : 0;				
			});			
		});

		while (true) {
			var maxI = -1;
			var maxJ = -1;
			var maxDeltaQ = 0;
			for(var nodeI in deltaQ) {
				nodeI = parseInt(nodeI);
				for(var nodeJ in deltaQ){					
					nodeJ = parseInt(nodeJ);
					if(nodeI == nodeJ)
						continue;

					if(deltaQ[nodeI][nodeJ] >= maxDeltaQ){
						maxDeltaQ = deltaQ[nodeI][nodeJ];
						maxI = nodeI;
						maxJ = nodeJ;
					}
				}
   			}

   			if(maxDeltaQ <= 0 || Object.keys(deltaQ).length === 1)
   				break;

   			for(var k in deltaQ) {
   				k = parseInt(k);
   				if( k == maxI || k == maxJ)
   					continue;

   				var isNeighborsWithI = isNeighbors(deltaQ[maxI].nodes, deltaQ[k].nodes);
   				var isNeighborsWithJ = isNeighbors(deltaQ[maxJ].nodes, deltaQ[k].nodes);

				deltaQ[maxJ][k] =  isNeighborsWithI && isNeighborsWithJ
					? deltaQ[maxI][k] + deltaQ[maxJ][k]
					: isNeighborsWithI && !isNeighborsWithJ
						? deltaQ[maxI][k] - 2 * a[maxJ] * a[k]
						: isNeighborsWithJ && !isNeighborsWithI ? deltaQ[maxJ][k] - 2 * a[maxI] * a[k] : 0;

				deltaQ[k][maxJ] = deltaQ[maxJ][k];
				var row = deltaQ[k];
				delete row[maxI];
   			}
   			deltaQ[maxJ].nodes = deltaQ[maxJ].nodes.concat(deltaQ[maxI].nodes);   			
   			delete deltaQ[maxJ][maxI];
			delete deltaQ[maxI];
			a[maxJ] = a[maxJ] + a[maxI];
			a[maxI] = 0;			
		}

		var communities = [];
		for(var item in deltaQ) {
			communities.push(deltaQ[item].nodes);
		};

		return communities;		
	};

	var isNeighbors = function(source, targer) {
		var res = false;
		$.each(source, function(index, sourceNode) {
			if (_.intersection(neighbors[sourceNode], targer).length > 0) {
				res = true;
				return false;
			}
		});

		return res;
	};

	return {
		findCommunity: findCommunity,
	}
}());