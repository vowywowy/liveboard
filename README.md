# Liveboard
This is a live updating MySQL table mirror. It's primarily for live updating leaderboards but it can watch any table. It's written for Node.js and subsequently requires the following NPM packages:

Package|Reason
---|:--
[Express](http://expressjs.com/)|Serving staic assets
[MySQL](https://github.com/mysqljs/mysql)|Interfacing with a MySQL instance
[Socket.io](http://socket.io/)|Creating websockets to push updates
[Zongji](https://github.com/nevill/zongji)|Restfully watching the MySQL instance

It also uses [tsorter.js](https://github.com/terrilldent/tsorter) on the frontend to sort the leaderboard... quickly. *(One of these days I'll write my own quicksort in JS)*
# Use
To use this you need to create a user for Zongji in your MySQL instance:
```SQL
CREATE USER 'zongji'@'localhost' IDENTIFIED BY 'zongji';
GRANT REPLICATION SLAVE, REPLICATION CLIENT, SELECT ON *.* TO 'zongji'@'localhost';
```
This makes a user named `zongji` with the password `zongji`. You can change these around if you want but you'll need to change the Zongji credentials at the bottom of `server.js`. Here's the new SQL statement:
```SQL
CREATE USER 'desiredUsername'@'localhost' IDENTIFIED BY 'desiredPassword';
GRANT REPLICATION SLAVE, REPLICATION CLIENT, SELECT ON *.* TO 'desiredUsername'@'localhost';
```
And the following changes in `server.js`:
```js
var zongji = new ZongJi({
	host: 'localhost',
	user: 'desiredUsername',
	password: 'desiredPassword',
});
```
When you run mysqld you need you give it the following flags for Zongji:
```cmd
mysqld --log-bin=<ABSOLUTE PATH TO FUTURE LOG FILE> --binlog-format=row --server-id=1
```

# Customization
- You can style stuff in `public/style.css`. As an example, it currently hides the first column which is usually an AUTO INCREMENT primary key, so its of no use to display to the end user.
- If you want to change ports/static location/path/etc. Look around in the code or look up the documentation for whatever package is controlling what you want to change.

# Running
- Clone the repo
- `npm install`
- Start MySQL with the proper flags:
```cmd
mysqld --log-bin=<ABSOLUTE PATH TO FUTURE LOG FILE> --binlog-format=row --server-id=1
```
- In `server.js` modify the MySQL variables with the username, password, database, and the table you want to display. *(It's the first few lines)*
- In the proper directory:
```cmd
npm install
node server.js
```
And that's it, if it runs without error you'll see: `Listening on 3000`. You can access you liveboard at [http://localhost:3000](http://localhost:3000).

# Caution
**Think twice about what you choose to mirror.** This project directly displays database structure to the frontend. Liveboard has no write capabilities however, it's very possible to reveal structure that can lead to an exploit or injection. **Only mirror tables you are absolutely sure you're ok with everyone seeing.**