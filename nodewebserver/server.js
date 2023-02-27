const Axios = require('axios');
const { createHmac } = require('crypto');
const express = require('express');
const path = require('path');

const server = express();
const port = 80; // check if need to change - changed back to 80, working now
let dirname = __dirname;

// for parsing application/json
server.use(express.json());
// for parsing application/x-www-form-urlencoded
server.use( express.urlencoded({extended: true}));


// points path at directory for static websites
server.use(express.static(path.join(dirname, '/public'), {
    extensions:['htm', 'htm']
}));

// add templating engine [doesn't need import at top of file, but needs to be installed- inc in express]
server.set('view engine', 'ejs');
server.set('views', path.join(dirname, '/views'));

// sends the 'Add student submit' button from addstudents back to webserver
server.post('/addstudent', async(req, res)=> {
    try
    {
        let containerName = "webservice"; // see docker compose file, this is what we called the srvice
        let serviceResponse= await 
            Axios.post(`http://${containerName}:1339/students`, {
                name: req.body["name-textbox"],
                age: req.body["age-numberbox"],
                course: req.body["course-textbox"]

                //can access in js by index -> req.body.["name-textbox"]
            });
            console.log(`Service response = ${serviceResponse.status}`);
            res.redirect('thanks.html');
    }
    catch(error)
    {
        console.log(error);
        res.status(403).end();
    }
});

server.get('/readstudents', async(req, res) => {
    try 
    {
        console.log("Get students readstudents path");
        let containerName = "webservice";
        let response = await Axios.get(`http://${containerName}:1339/students`);
        res.render('displayallstudents', { students: response.data});
    }
    catch(error) {
        console.log(error);
        res.status(403).send({});
    }
});

server.get('/readstudent/:id', async(req, res) => {
    try
    {
        console.log(`Get student with ${req.params.id}`);
        let containerName = "webservice";
        let serviceResponse= await Axios.get(`http://${containerName}:1339/students/${req.params.id}`);

        console.log(`Service response = ${serviceResponse.status}`);
        res.render('displaystudentdetails', {student: serviceResponse.data})
    }
    catch(error) {
        console.log(error); 
        res.status(403).end();
    }
});


server.listen(port, ()=> console.log(`example web service listening at http://localhost:${port}`));


