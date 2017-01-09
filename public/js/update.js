document.addEventListener("DOMContentLoaded", function() {
	var socket = io.connect('http://localhost:3000');

	//initial query result event
	socket.on('results', function(results, callback) {
		//getting the amount of columns in the query
		var rowNames = Object.getOwnPropertyNames(results[0]),
			html = `<table id="liveboard">
						<thead>
							<tr>`;

		//create as many columns as the query contains
		for (var i = 0; i < rowNames.length; i++) {
			html += '			<th>' + rowNames[i] + '</th>';
		}
		html += `			</tr>
						</thead>
						<tbody>`;
		
		//create as many rows as the query contains
		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			html += '		<tr id ="id' + result[rowNames[0]] + '">';
			for (var j = 0; j < rowNames.length; j++) {
				html += '		<td>' + result[rowNames[j]] + '</td>';
			}
		}
		html += `			</tr>
						</tbody>
					</table>`;
		document.getElementById("tableContainer").innerHTML = html;

		//wait until the table is appended to sort
		if (typeof callback == "function"){
        	callback();
		}
	});

	//display the amount of users watching
	socket.on('users', function(users) {
		document.getElementById("users").innerHTML = "Users connected: " + users;
	});

	//the update event
	socket.on('update',  function(update, callback) {
		if (update) {
			var liveboard = document.getElementById("liveboard");
			try {
				var tds = document.getElementById("id" + update[0].before.id).children;
			} catch (e) { //try failed; element does not exist; insert/delete query
				var old = Object.entries(liveboard.getElementsByTagName("tr")),
					ids = [];
				//get the old rows' ids
				for (var i = 0; i < old.length; i++) {
					if (i != 0) {
						ids.push(parseInt(old[i][0].substring(2)));
					}
				}
				if (ids.indexOf(update[0].id) != -1) { //deletion if id isn't found
					var remove = document.getElementById("id" + update[0].id);
					remove.parentNode.removeChild(remove);
				} else { //insertion
					var insert = '';
					for (var i = 0; i < (Object.values(update[0]).length - 1); i++) {
						insert += '<td>' + Object.values(update[0])[i + 1] + '</td>';
					}
					liveboard.innerHTML += '<tr id="id' + update[0].id + '">' + insert + "</tr>";
				}
			}
			if (tds) { //try succeed; element exists; update query
				for (var i = 0; i < tds.length; i++) {
					tds[i].innerHTML = Object.values(update[0].after)[i + 1];
				}
			}
		}
		//wait until the table modification is completed to sort
		if (typeof callback == "function"){
        	callback();
		}
	});

	//sort on initial results and each update
	["results", "update"].forEach(e =>
    	socket.on(e, () => {
        	sort();
    	})
	);
});

//sorting the tbale using tsorter
function sort() {
	var sort = tsorter.create('liveboard');
	document.querySelector('th:nth-of-type(3)').click();
}