const connect = require('./connection');
const oracledb = require('oracledb');
const  axios = require('axios');
const { DB_TYPE_DATE } = require('oracledb');
const { param } = require('express/lib/request');
connect();

//patient sign up er jnno
//route er part

exports.patient_id= (req,res)=>{
  console.log('jj')
  auto_id(res);

 async function auto_id(res){
    let connection;

    try {
  
      connection = await oracledb.getConnection();
  
      console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `select max(patient_id)+1 from patient`,
        []);
        
  //console.log(row.EMPLOYEE_ID);
  console.log(result.rows[0]);
      res.render('patient/patientSignUp', {row:result.rows});
  
      await rs.close();
    } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
 
  }

exports.check_patient= (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // check
    
        var patient_Id = req.body.id;
        var password = req.body.password;
        console.log(patient_Id,password);
        checkpatient(patient_Id,password,res);
}
    checkpatient=async(Aid, pass,res)=>{
    let connection;

    try {
  
      connection = await oracledb.getConnection();
  
      console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `select * from patient`,
        [],
        { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });
        n=Number.parseInt(Aid);
      const rs = result.resultSet;
      let row;
  //console.log(row.EMPLOYEE_ID);
      
  while ((row = await rs.getRow())){if(row.PATIENT_ID==Aid && row.PASSWORD== pass){
            res.redirect('/patient-profile?id=' + Aid);
            console.log("done");
        break;
        }
        
    }
         
       
      res.redirect('/failed-in-loggedin')
  
      await rs.close();
    } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }
    }


exports.addPatient=(req,res)=>{
    //var id=req.body.ID;
    var password= req.body.Password;
    var name=req.body.name;
    var guardianName=req.body.guardianName;
    var age=req.body.age;
    var gender=req.body.gender;
    var address=req.body.address;
    var phone=req.body.phone;
    var gphone=req.body.Gphone;
    var data = [[name,guardianName,age,address,phone,gphone,password,gender]];
    console.log(password,name,guardianName,age,gender,address,phone,gphone);
    insertPatient(data,res); 
    }


insertPatient=async(rows,res)=>{
    let connection;

try {

connection = await oracledb.getConnection();

console.log("Successfully connected to Oracle Database");

// Insert some data

const sql = `insert into patient(name,guardian_name, age,address,phone,guardian_phone,password, gender) values(:1, :2, :3, :4,:5,:6,:7,:8)`;

let result = await connection.executeMany(sql, rows);

console.log(result.rowsAffected, "Rows Inserted");
res.redirect("/patient-login")

connection.commit();
}
catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

}

//ptient data show er jnno
//route part
exports.showpatient= (req, res)=>{
    var id = req.query.id;//id koi pabo?
    patientinfo(id, res);
  }

exports.patientinfo=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `SELECT * FROM PATIENT WHERE PATIENT_ID= :id`,
       {id:id});//EKHANE ID NA PATIENT_ID?

  res.render('patient/patientProfile', {row:result.rows});
  }
  catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
}


//patient appointment request er jnno
//route er part
exports.reqappointment=(req,res)=>{
    //var id=req.body.ID;
    //var department= req.body.department;
    var doctorid=req.body.id;
    var patientid=req.body.pid;
    var date=req.body.date;
    var time=req.body.time;
    var data = [[time, date, patientid, doctorid,'PENDING']];
    console.log(time, date, patientid, doctorid,'PENDING');
    insertappointment(data,res); 
    }


insertappointment=async(rows,res)=>{
    let connection;

try {

connection = await oracledb.getConnection();

console.log("Successfully connected to Oracle Database");

// Insert some data

const sql = `insert into appoinment( TIME, A_DATE, PATIENT_ID, DOC_ID, STATUS) values(:1, TO_DATE(:2,'yyyy-mm-dd'),:3, :4,:5)`;

let result = await connection.executeMany(sql, rows);

console.log(result.rowsAffected, "Rows Inserted");
//res.redirect("/admin-view")

connection.commit();
}
catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }



}

// ei part ta admin data show er jnno
//route part
/*exports.showadmin = (req, res)=>{
    var id = req.query.id;//ei id koi pabo?
    adque.admininfo(id, res);
  }*/

/*exports.admininfo=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID= :id`,
       {id:id});//EKHANE ID NA admin id?

  res.render('adminpage/adminView', {row:result.rows});
  }
  catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
}*/

//showing doctor list

    exports.showdoctorlist= (req, res)=>{
    
       doctorlist(res);
      }
    
    doctorlist=async(res)=>{
    

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
   
    result =await connection.execute(
        `SELECT D.DOC_ID,E.NAME, D.DEPARTMENT, D.QUALIFICATION, D.SPECIALIZED_SECTOR FROM DOCTOR D JOIN EMPLOYEE E ON (D.DOC_ID=E.EMPLOYEE_ID)`,
        []);

  res.render('patient/doctorlist', {row:result.rows});
  
  }
  catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
}

// pending appointment
exports.showpatientappointment= (req, res)=>{
    var id = req.query.id;// ei id koi pabo?
    patientappointment(id, res);
  }

exports.patientappointment=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    console.log(id);
   
    result = await connection.execute(`SELECT * FROM APPOINMENT A JOIN PATIENT P ON(A.PATIENT_ID=P.PATIENT_ID) AND P.PATIENT_ID= :id`,
    {id:id});//EKHANE ID NA PATIENT_ID?
    console.log(result.rows);
    
  res.render('patient/appointment', {row:result.rows});
 
  }
  catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
}