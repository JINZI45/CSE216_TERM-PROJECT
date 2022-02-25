const connect = require('./connection');
const oracledb = require('oracledb');
const  axios = require('axios');
const { DB_TYPE_DATE } = require('oracledb');
const { param } = require('express/lib/request');
connect();

//doctor dashboard
exports.docotorinfo=async(id, res)=>{

    let connection;
  
  try {
  
    connection = await oracledb.getConnection();
  
    console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID =:id`,
       {id:id});//EKHANE ID NA admin id?
  
  res.render('doctor/doctorprofile', {row:result.rows,id:id});
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

  //upcoming appointment
 

exports.doctorappointment=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    console.log(id);
   
    result = await connection.execute(`SELECT* FROM APPOINMENT WHERE DOC_ID =:id`,
    {id:id});//EKHANE ID NA PATIENT_ID?
    console.log(result.rows);
    
  res.render('doctor/upcomingappointments', {row:result.rows,id:id});
 
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

//upcoming schedule

exports.doctor_schedule=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    console.log(id);
   
    result1 = await connection.execute(`SELECT * FROM EMPLOYEE_SCHEDULE WHERE EMPLOYEE_ID=:id `,
    {id:id});//EKHANE ID NA PATIENT_ID?AND (JOB_TYPE = 'REGULAR ROUND ' OR JOB_TYPE = ' OUT PATIENT ' )
    console.log(result1.rows);

    result2 = await connection.execute(`SELECT * FROM OT WHERE DOC_ID=:id `,
    {id:id});
    
  res.render('doctor/doctorscheduleupcoming', {row1:result1.rows,id:id});
  //res.render('doctor/doctorscheduleupcoming', {row2:result2.rows});
 
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