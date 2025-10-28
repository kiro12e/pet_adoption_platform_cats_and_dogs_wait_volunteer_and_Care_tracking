const mysql = require('mysql');

async function UserDb() {
    try{
        const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'stray_cats_dog_adoption',

        
    });
    }catch(err){
        console.error('Connection error', err.message);
    }
}

async function getTableAdopters(table) {
    mysql.gettable
}

module.exports = {UserDb};