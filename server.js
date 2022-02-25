const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const adque=require('./adminquery');
//const service= require('./notused/service')

//id pathanor jnno
const paramMiddleware = (id) => {
     return (req, res, next) => {console.log(req.query.id);
          req.Aid =id;
          next();
          
          //res.render('adminpage/adminDashboard', {id:req.query.id})
     }
   }

//const connectDB = require('./server/database/connection');
const connect= require('./connection');
const control= require('./routes/controller');
const patientControl = require('./patientquery');
const doctorControl = require('./doctorquery');
const receptionistControl = require('./receptionistquery');

const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

//db connection
connect();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// set view engine
app.set("view engine", "ejs")
// app.set('/home', path.resolve(__dirname, "views/home/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "adminhome/admin&home/admin/css")))
app.use('/images', express.static(path.resolve(__dirname, "adminhome/admin&home/images")))
app.use('/js', express.static(path.resolve(__dirname, "adminhome/admin&home/admin/js")))
app.use('/lib', express.static(path.resolve(__dirname, "adminhome/admin&home/admin/lib")))
app.use('/img', express.static(path.resolve(__dirname, "adminhome/admin&home/admin/img")))
app.use('/scss', express.static(path.resolve(__dirname, "adminhome/admin&home/admin/sccs")))
//app.use('/images', express.static(path.resolve(__dirname, "adminhome/admin&home/images")))
app.use('/home', express.static(path.resolve(__dirname, "adminhome/home")))
app.use('/doctor', express.static(path.resolve(__dirname, "views/doctor/ejs")))

// load routers
//app.use('/', require('./server/routes/router'))
app.get("/", (req, res) => { res.render('home/index');
});
// app.get("/admin-login", (req, res) => {
//      res.render('home/adminlogin');

// });
app.get("/employee-login", (req, res) => {
     res.render('home/employeeLogin');

});

//admin login + other works
let adminid;
app.get("/admin-dash", (req, res) => {console.log(req.query.id);
     let id=req.query.id ;
     adminid = id;
     adque.admininfo(id, res);
    // next();
     
     //res.render('adminpage/adminDashboard', {id:req.query.id})
});

//app.get("/admin-dash",paramMiddleware(req.qid), (req, res))
app.get("/makeschedule",control.showEmp);
app.get("/delete-schedule",control.delEmp);

// app.post('/adminlogin', control.check_user);
app.post('/employeelogin', control.check_user);
//app.get("/admin-view",service.homeRoutes);
app.get("/admin-view",control.allcheck);
app.get("/failed-in-loggedin",(req, res) => { res.render('home/notLoggedIn');});
app.get('/add-employee', (req, res) => { res.render('adminpage/addEmployee');});
app.post('/adduser', control.add);
app.post('/doctorschedule', control.add_doc_sched);
app.post('/othersschedule', control.add_other_sched);
app.post('/nurseschedule', control.add_nurses_sched);
app.get('/update-user', control.update);
app.post('/update-user', control.update_INFO);
app.get('/delete-user', control.delete);
app.get('/pescription', (req, res) => { res.render('doctor/pescription');});

//admin data show
/*app.get('/admin-dash', (req, res)=>{
     //var id = req.query.id;//ei id koi pabo?
     //var id = param;
      //console.log(id);
      adque.admininfo(id, res);
    });*/



//patient
//patient sign up
//app.get('/patientsignup', (req, res) => { res.render('patient/patientSignUp');});
app.get('/patientsignup', patientControl.patient_id);
app.post('/addpatient', patientControl.addPatient);

//patient appointment request
app.post('/appointmentform', patientControl.reqappointment);


//app.get('/patientProfile',patientControl.showpatient);

//patient log in
app.get("/patient-login", (req, res) => {
     res.render('patient/patientLogin');

});
app.get('/ot-list', (req, res) => {
     adque.allot(res);
});

let pid;
app.post('/patientLogin', patientControl.check_patient);

//patient data show
app.get("/patient-profile", (req, res) => {console.log(req.query.id);
     let id=req.query.id ;
     pid = id;
     patientControl.patientinfo(id, res);
});

app.get('/appointment', (req, res) => { 
     patientControl.patientappointment(pid, res);
});

//doctor list show
app.get('/doctorlist',patientControl.showdoctorlist);

//patient appointment show
//app.get('/appointment', patientControl.showpatientappointment);

//doctor
let did;
//doctor info show
app.get("/doctor-dash", (req, res) => {console.log(req.query.id);
     let id=req.query.id ;
     did = id;
     doctorControl.docotorinfo(id, res);
});

//upcoming appointments show
app.get('/upcomingappointments', (req, res) => { 
     doctorControl.doctorappointment(did, res);
});


//upcoming doctor schedule
app.get('/doctorscheduleupcoming', (req, res) => { 
     doctorControl.doctor_schedule(did, res);
});

//receptionist
let rid;
//receptionist info show
app.get("/receptionist-dash", (req, res) => {console.log(req.query.id);
     let id=req.query.id ;
     rid = id;
     receptionistControl.receptionistinfo(id, res);
});

//upcoming doctor schedule
app.get('/receptionistschedule', (req, res) => { 
     receptionistControl.receptionist_schedule(rid, res);
});

//appointment approval by receptionist
app.get('/appointmentlist', (req, res) => { 
     receptionistControl.receptionistapproval(rid, res);
});



app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});