// CRUD
const mongodb = require('mongodb');
const { MongoClient, ObjectId } = mongodb; 

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectId();
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
	if (error) {
		return console.log('Unable to connect to database');
	}

	const db = client.db(databaseName);

    // db.collection('tasks').deleteOne({
    //     _id: new ObjectId("6195256401e877c1191ed3ae")
    // }).then(result => {
    //     console.log(result)
    // }).catch(error => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(result => {
    //     console.log(result)
    // }).catch(error => {
    //     console.log(error)
    // })

    // db.collection('users').findOne({ name: 'Carlos' }, (error, data) => {
    //     if(error) {
    //         return console.log('Unable to find user!')
    //     }

    //     console.log(data)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectId('618d2d44b2098fc8cfeb64ff'),
    // }, {
    //     $set: {
    //         name: 'Carlo'
    //     }
    // })
    db.collection('tasks').insertMany([
        {
            description: 'task 1',
            completed: true
        },
        {
            description: 'task 2',
            completed: false
        },
        {
            description: 'task 3',
            completed: false
        }
    ])
	db.collection('users').insertOne({
		name: 'Carlos',
		age: 22
	}, (error, result) => {
        if (error) {
            return consolee.log('Unable to insert user')
        }

        console.log(result.ops)
	});
    // db.collection('users').insertMany([
    //     {
    //         name: 'Juan',
    //         age: 15
    //     }, {
    //         name: 'Kick',
    //         age: 17
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return consolee.log('Unable to insert documents')
    //     }
        
    //     console.log(result.insertedIds)
    // });
});
