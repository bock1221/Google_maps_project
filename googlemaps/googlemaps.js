var myMaps = {};
function initialize() {
	var mapOptions = {
		center : new google.maps.LatLng(40.0770, 74.2004),
		zoom : 8
	};
	myMaps.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	$(function() {
		$("#options").resizable({
			resize : function() {
				google.maps.event.trigger(myMaps.map, "resize");
			}
		});
	});

	$("#lakewood").click(function() {
		var bounds = myMaps.map.getBounds().toUrlValue(), boundarray = JSON.parse("[" + bounds + "]");
		console.log(boundarray);
		$.getJSON("http://api.geonames.org/wikipediaBoundingBox?&south=" + boundarray[0] + "&north=" + boundarray[2] + "&east=" + boundarray[3] + "&west=" + boundarray[1] + "&maxRows=10&username=tzvibock&type=json", function(data) {
			alert(data);
			$.each(data, function(i, places) {
				$.each(places, function(i, place) {

					var marker = new google.maps.Marker({
						position : new google.maps.LatLng(place.lat, place.lng),
						map : myMaps.map,
						title : place.title
					});

				});
			});
			/*var myLatLong = new google.maps.LatLng(40.070932, -74.194362);
			 map.panTo(myLatLong);
			 map.setZoom(12);
			 var marker = new google.maps.Marker({
			 position : myLatLong,
			 map : map,
			 title : 'lakewood!',
			 http://api.geonames.org/wikipediaBoundingBox?north=44.1&south=-9.9&east=-22.4&west=55.2&username=demo
			 */
		});
	});
};

google.maps.event.addDomListener(window, 'load', initialize);
$(function() {
	$("#options").resizable({
		resize : function() {
			google.maps.event.trigger(myMaps.map, "resize");
		}
	});
});
var headNode;
var data1;
$(function() {
	$("#find").on("click", function() {
		var rootNode;

		var bounds = new google.maps.LatLngBounds();
		// Initialize the tree in the onload event
		$("#tree").dynatree({
			onActivate : function(node) {
				alert("You activated " + node.data.title);
			}
		});
		rootNode = $("#tree").dynatree("getRoot");
		$.getJSON("http://api.geonames.org/wikipediaSearch?q=" + $("#place").val() + "&maxRows=10&username=tzvibock&type=json", function(data) {
			data1 = data;
			$.each(data, function(i, places) {
				if (headNode !== undefined) {
					headNode.remove();
				}
				headNode = rootNode.addChild({
					title : $("#place").val(),
					tooltip : "This child node was added programmatically.",
					isFolder : true,
					expand:true
				});
				$.each(places, function(i, place) {
					var newPosition = new google.maps.LatLng(place.lat, place.lng), size = new google.maps.Size(40,40), icon = place.thumbnailImg;
					bounds.extend(newPosition);
					var icon;
					if(place.thumbnailImg){
					    icon = {
							url : place.thumbnailImg,
							scaledSize : size
					};
					}
					var marker = new google.maps.Marker({
						position : newPosition,
						map : myMaps.map,
						title : place.title,
						icon : icon

					});
					var childNode = headNode.addChild({
						title : place.title,
						tooltip : "This child node was added programmatically.",
						isFolder : true
					});
				});
				myMaps.map.fitBounds(bounds);
			});

		});

	});

});

dynaTreeInit = function() {
	// Initialize the tree in the onload event
	$("#tree").dynatree({
		onActivate : function(node) {

			alert("You activated " + node.data.title);
		}
	});
	// Now get the root node object
	rootNode = $("#tree").dynatree("getRoot");
	// Call the DynaTreeNode.addChild() member function and pass options for the new node
};

addDynaChild = function(parentNode, lat, lng, title, tooltip, folderBoolean) {
	var childNode = parentNode.addChild({
		title : title,
		tooltip : tooltip,
		isFolder : folderBoolean,
		lat : lat,
		lng : lng,
		folder : folderBoolean
	});
	return {
		childNode : childNode
	};
};

