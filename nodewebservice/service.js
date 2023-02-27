const express = require('express');
const service = express();
const db =require("./pgdbstudent.js");

const port = 1339;

service.get('/', (req, res)=> {
    res.send('Welcome!');
})

service.get('/hi', (req, res)=> {
    res.send('Hello!');
})

service.listen(port, ()=> {
    console.log(`Example web service listening at http://localhost:${port}`)
});

// npm install --save-dev nodemon

//example paths - with parameter
service.get('/hello/:name', (req, res)=> {
    res.send(`Hello ${req.params.name}`); //sends html back to the client from the service
})

// response object can be json - > re.json
// res.status(500).json({ error: 'message'})
// can chain res.status(404).end();
// need to always call either 'send' or 'end' in the response, otherwise not really sending back a response
// there's a 3rd arg to .get call back fn - > req, res, next - if not want to handle, middleware to handle, won't use

//example error
service.get('/error', (req, res)=> {
    res.status(403).end();
});

// rreading info in the HTTP request body

//add once in app, usually at the top:
// parsin application/json
service.use( express.json());
// for parsin application/x-www-form-urlencoded
service.use(express.urlencoded({extended: true}))


// previous without link to database
// service.post('/dogs', (req, res)=>{
//     let result = {
//         id: 101,
//         name: req.body.name,
//         breed: req.body.breed,
//         age: req.body.age
//     };
//     res.send(result);
// });

// also at the top:
const cors = require('cors');

let corsOptions = {
    origin:"*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    allowedHeaders: "Authorization, Origin, Content-Type, X-Requested-With",
    maxAge: 0
};

// maxAge - 0 for learning, change later when use properly
// maxAge - if 0 forces browser to renegotiate cors each time, rather than caching data

service.use(cors(corsOptions))

// example CRUD operations web service for students
// ignore edit

// //previous without datbase link - post
// service.post('/students', async(req, res)=>{
//     console.log("add student");
//     console.log(req.body.name);
//     console.log(req.body.age);
//     console.log(req.body.course);
//     res.status(201).send({
//         Id: 101,
//         Name: req.body.name,
//         Age: req.body.age,
//         Course: req.body.course
//     });
// });
service.post('/students', async(req, res)=>{
    await db.Insert({
        Name: req.body.name,
        Age: req.body.age,
        Course: req.body.course
    }, res);
});


// //delete - previous
// service.delete('/students/:id', async(req, res)=> {
//     console.log("Delete student");
//     console.log(req.params.id);
//     res.send({}); // or could return nothing using res.end()
//     // 200 is the default status code
// })
//------------new delete student
service.delete('/students/:id', async(req, res)=> {
    await db.Delete(parseInt(req.params.id), res);
})

// //----- previous read all students
// // read all students, now adapted with a query
// // query eg 'students/?name=bob
// service.get('/students', async(req, res)=> {
//     let data = [];

//     if(typeof req.query.name === "string") {
//         console.log("read the students' details");
//         console.log(req.query.name);

//         data[0]= {Id: 1, Name: req.query.name, Age: 23, Course: "SE"};
//         data[1]= {Id: 2, Name: req.query.name, Age: 24, Course: "WD"}; // dummy records with a name the same as the query
//     } 
//     else {

//         console.log("Read all student details");
//         data[0]= {Id: 1, Name: "Fred", Age: 23, Course: "SE"};
//         data[1]= {Id: 2, Name: "Sophie", Age: 24, Course: "WD"}; // fake db records
//     }
//     res.send(data);

// });

// ----------new read all students with db link
service.get('/students', async(req, res)=> {
    let data = [];

    if(typeof req.query.name === "string") {
        await db.SelectByName(req.query.name, res);
    } 
    else {
        await db.Select(res);
    }
    res.send(data);

});

// // read a student by id
// service.get('/students/:id', async(req, res)=> {
//     console.log("read a student by id");
//     console.log(req.params.id)
    
//     res.send({Id: req.params.id, Name: "Fred", Age: 23, Course: "SE"});
// });
//-----------student by id new with connection to db
service.get('/students/:id', async(req, res)=> {
    await db.SelectById(parseInt(req.params.id), res);
});



// router
let router = express.Router();

router.get('/events', async (req, res) => {

    res.send("calendar events");
});

// add router to application at the root URL/calendar
service.use('.calendar', router);

