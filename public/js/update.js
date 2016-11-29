document.addEventListener("DOMContentLoaded", () => {
	var socket = io.connect('http://localhost:3000');
	socket.on('results', (results, callback) => {
		var rowNames = Object.getOwnPropertyNames(results[0]),
			html = `<table id="liveboard">
						<thead>
							<tr>`;
		for (var i = 0; i < rowNames.length; i++) {
			html += '			<th>' + rowNames[i] + '</th>';
		}
		html += `			</tr>
						</thead>
						<tbody>`;

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
		document.getElementById("teams").innerHTML = html;

		//wait until the table is appended to sort
		if (typeof callback == "function"){
        	callback();
		}
	});

	socket.on('users', (users) => {
		document.getElementById("users").innerHTML = "Users connected: " + users;
	});

	socket.on('update',  (update) => {
		if (update) {
			var liveboard = document.getElementById("liveboard");
			try {
				var tds = document.getElementById("id" + update[0].before.id).children;
			} catch (e) { //try failed; element does not exist; insert/delete
				var old = Object.entries(liveboard.getElementsByTagName("tr")),
					ids = [];
				for (var i = 0; i < old.length; i++) {
					if (i != 0) {
						ids.push(parseInt(old[i][0].substring(2)));
					}
				}
				if (ids.indexOf(update[0].id) != -1) { //deletion
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
			if (tds) { //try succeed; element exists; update
				for (var i = 0; i < tds.length; i++) {
					tds[i].innerHTML = Object.values(update[0].after)[i + 1];
				}
			}
		}
	});

	//sort on initial results and each update
	["results", "update"].forEach(e =>
    	socket.on(e, () => {
        	sort();
    	})
	);
});

function sort() {
	var sort = tsorter.create('liveboard');
	document.querySelector('th:nth-of-type(3)').click();
}