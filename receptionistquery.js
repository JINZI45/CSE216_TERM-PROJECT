const connect = require('./connection');
const oracledb = require('oracledb');
const  axios = require('axios');
const { DB_TYPE_DATE } = require('oracledb');
const { param } = require('express/lib/request');
connect();

//receptionist dashboard
exports.receptionistinfo=async(id, res)=>{

    let connection;
  
  try {
  
    connection = await oracledb.getConnection();
  
    console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID =:id`,
       {id:id});//EKHANE ID NA admin id?
  
  res.render('receptionist/receptionistprofile', {row:result.rows,id:id});
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

exports.receptionist_schedule=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    console.log(id);
   
    result = await connection.execute(`SELECT * FROM EMPLOYEE_SCHEDULE WHERE EMPLOYEE_ID=:id`,
    {id:id});//EKHANE ID NA PATIENT_ID?
    console.log(result.rows);

    
  res.render('receptionist/receptionistschedule', {row:result.rows,id:id});
 
 
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

// approving appointment section
exports.receptionistapproval=async(id, res)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    console.log(id);
   
    result = await connection.execute(`SELECT* FROM APPOINMENT WHERE STATUS = 'PENDING' and A_DATE >= SYSDATE`,
  []);//EKHANE ID NA PATIENT_ID?
    console.log(result.rows);
    
  res.render('receptionist/appointmentlist', {row:result.rows,id:id});
 
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
