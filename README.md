# Liveboard
This is a live updating leaderboard for UOIT CTFs. It's written for Node.js and subsequently requires the following NPM packages:

Package|Reason
---|:--
[Express](http://expressjs.com/)|Serving staic assets
[MySQL](https://github.com/mysqljs/mysql)|Interfacing with a MySQL instance
[Socket.io](http://socket.io/)|Creating websockets to push updates
[Zongji](https://github.com/nevill/zongji)|Restfully watching the MySQL instance

It also uses [tsorter.js](https://github.com/terrilldent/tsorter) on the frontend to sort the leaderboard... quickly.
# Use
To use this you need to have your MySQL configured in a certain way. It's currently configured with the following schema:
```SQL
CREATE DATABASE ctf;

USE ctf;

CREATE TABLE teams (
	id INT(255) NOT NULL AUTO_INCREMENT, 
	name VARCHAR(50) NOT NULL, 
	money INT(255) DEFAULT 0,
	sla VARCHAR(255) DEFAULT 100.000,
	service1 TINYINT(1) DEFAULT 1, 
	service2 TINYINT(1) DEFAULT 1, 
	service3 TINYINT(1) DEFAULT 1, 
	service4 TINYINT(1) DEFAULT 1, 
	service5 TINYINT(1) DEFAULT 1, 
	PRIMARY KEY (id));

CREATE TABLE items (
	id INT(255) NOT NULL AUTO_INCREMENT,
	name VARCHAR(255),
	description VARCHAR(255),
	price INT(255) DEFAULT 0,
	purchases INT(255) DEFAULT 0,
	PRIMARY KEY (id));

//zongji requirements
CREATE USER 'zongji'@'localhost' IDENTIFIED BY 'zongji';
GRANT REPLICATION SLAVE, REPLICATION CLIENT, SELECT ON *.* TO 'zongji'@'localhost';
```
And then the following mysqld config:
```cmd
mysqld --log-bin=<ABSOLUTE PATH TO FUTURE LOG FILE> --binlog-format=row --server-id=1
```
Then running `node server.js` where `server.js` is located will give you a liveboard at [localhost:3000](http://localhost:3000/).

# Customization
- You can change the user/pass for your MySQL instance near the top of `server.js`.
- Feel free to alter the database schema however you want, but be sure to modify the table headers and object references in the `results` event in `update.js`. 
	- Also, double check type parsing. (I believe it's all gone at this point)
	- And you probably don't want the styling done by `upDownStyleAndSort()` so check that too.
	- Now that I mention styling, it's probably best you write an entirely new `style.css` since the included one is severely customized.
- If you want to change ports/static location/path/etc. Look around in the code or look up the documentation for whatever package is controlling what you want to change. Except for Zongji... don't mess with that.

# Running
- Start MySQL instance
- In the proper directory:
```cmd
npm install express mysql socket.io zongji
node server.js
```
And that's it.
