const connect = require('../connection');
const oracledb = require('oracledb');
const adque=require('../adminquery');
//const { DB_TYPE_DATE } = require('oracledb');
const { param } = require('express/lib/request');
connect();

// create and save new user
exports.check_user = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // check
    
        var Admin_Id = req.body.id;
        var password = req.body.Password;
        console.log(Admin_Id,password);
        adque.check_(Admin_Id,password,res);
}

//
exports.add=(req,res)=>{
  let id_E=req.query.id ;
  var id=req.body.ID;
  var job=req.body.jobType;
  var name=req.body.name;
  var dob=req.body.dob;//ekhane dob hobe may be
  var gender=req.body.gender;
  var hire_date=req.body.hireDate;
  var salary=req.body.salary;
  var password= req.body.password;
var data = [[id,name,dob,gender,hire_date,salary,job,password]];
console.log(id,name,dob,gender,hire_date,salary,job,password);
adque.insert(data,res,id_E); 
}



// exports.showadmin = (req, res)=>{
//  //var id = req.query.id;//ei id koi pabo?
//  //var id = param;
//   //console.log(id);
//   adque.admininfo('10002', res);
// }

//
exports.allcheck = (req,res)=>{
  let id=req.query.id ;
  adque.allc(res,id); 
}

// Update a new idetified user by user id
exports.update = (req, res)=>{
  if(!req.body){
      return res
          .status(400)
          .send({ message : "Data to update can not be empty"})
  }

  var id = req.query.id;
  update_id(res,id);
  //Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})

  async function update_id(res,id ){
    let connection;

    try {
  
      connection = await oracledb.getConnection({ user: "tfuser7", password: "f7c97a09", connectionString: "103.94.135.201/ORCLCDB.LOCALDOMAIN" });
  
      console.log("Successfully connected to Oracle Database");
      result = await connection.execute(
        `SELECT EMPLOYEE_ID, NAME, TO_char(DATE_OF_BIRTH,'yyyy-mm-dd'), GENDER,TO_CHAR(HIRE_DATE,'yyyy-mm-dd'),SALARY, JOB_ID,PASSWORD FROM EMPLOYEE where employee_id=:id `,
        {id:id});
        console.log(result.rows[0]);   
             if(!result.rows){
              res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
          }else{
            console.log(result.rows[0]);
             res.render('adminpage/update_employee', {employee:result.rows});
          }
  
      
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
//
exports.update_INFO = (req, res)=>{
  if(!req.body){
      return res
          .status(400)
          .send({ message : "Data to update can not be empty"})
  }
  console.log("kk")

  var id_ = req.query.id;
  var id=req.body.ID;
var job=req.body.JobType;
var name=req.body.Name;
var dob=req.body.DateOfBirth;
var gender=req.body.gender;
var hire_date=req.body.HireDate;
var salary=req.body.Salary;
var password= req.body.Password;
var data = [id,name,dob,gender,hire_date,salary,job,password,id_];

  update_id_info(res,id,data);
  //Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})

  async function update_id_info(res,id,data ){
    let connection;

    try {
  
      connection = await oracledb.getConnection();
  
      console.log("Successfully connected to Oracle Database");
      //console.log(data);
    

      const sql=`UPDATE employee SET employee_id=:1, name=:2, date_of_birth=TO_DATE(:3,'yyyy-mm-dd'), gender=:4,hire_date=TO_DATE(:5,'yyyy-mm-dd'),salary=to_number(:6),job_id=:7,password=:8  where employee_id = :9`
      await connection.execute(sql,data);
      

      connection.commit();
      result = await connection.execute(
        `SELECT EMPLOYEE_ID, NAME, TO_char(DATE_OF_BIRTH,'yyyy-mm-dd'), GENDER,TO_CHAR(HIRE_DATE,'yyyy-mm-dd'),SALARY, JOB_ID,PASSWORD FROM EMPLOYEE where employee_id=:id `,
        {id:id});
      console.log(result.rows[0]);   
             if(!result.rows){
              res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
          }else{
            //console.log(result.rows[0]);
             res.render('adminpage/update_employee', {employee:result.rows});
          }
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
//
exports.delete= (req, res)=>{

    var id = req.query.id;
    console.log(id)
    del_id(res,id);
    //Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
  
    async function del_id(res,id ){
      let connection;
  
      try {
    
        connection = await oracledb.getConnection();
    
        console.log("Successfully connected to Oracle Database");
        result=await connection.execute('DELETE FROM employee where employee_id = :1', [id]); 
        connection.commit();

        if(result.rowsAffected>0){
          //res.redirect('/admin-view');
          res.redirect('/admin-dash?id=' + id);
      }else{
         res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
      }   
        
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

exports.showEmp= (req, res)=>{
  let id=req.query.id ;
  adque.showschedule(res,id);
}

exports.delEmp= (req, res)=>{
  var id = req.query.id;
  console.log(id)
 
  adque.del_sch(res,id);
}

exports.add_doc_sched=(req,res)=>{
  var doc_id=req.body.id;
  var job=req.body.scheduletype;
  var date=req.body.date;
  var ST=req.body.starttime;
  var ET=req.body.endtime;
  if(job=='SURGERY'){
  var data = [[date,ST,doc_id,ET,'PENDING']];
  console.log(data);}
  else{
    var data = [[date,doc_id,job,ST,ET]];
    console.log(data);
  }
  adque.add_doc_schedule(data,res,job); 
  }
  
exports.add_nurses_sched=(req,res)=>{
  var nurse_id=req.body.id;
  var job=req.body.scheduletype;
  var room_id= req.body.otid;
  var date=req.body.date;
  var ST=req.body.starttime;
  var ET=req.body.endtime;
  
if(job=='SURGERY'){
  var data = [[nurse_id,room_id]];
  room=[[]];
  adque.add_nurse_schedule(data,res,job,room); }
  else{
    var data = [[date,nurse_id,job, ST,ET]];
    var room=[[' ',room_id]];
  adque.add_nurse_schedule(data,res,room,job);
  }
  }
  exports.add_other_sched=(req,res)=>{
    var emp_id=req.body.id;
    var job=req.body.jobtype;
    var date=req.body.date;
    var ST=req.body.starttime;
    var ET=req.body.endtime;
    var data = [[date,emp_id,job,ST,ET]];
    console.log(data);
    if(adque.exists(emp_id,job)){
      adque.add_emp_schedule(data,res); 
    }
    
    }
///