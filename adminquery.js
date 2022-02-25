const connect = require('./connection');
const oracledb = require('oracledb');
const  axios = require('axios');
connect();


exports.check_=async(Aid, pass,res)=>{
    let connection;

    try {
  
      connection = await oracledb.getConnection();
  
      console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
        `select * from employee`,
        [],
        { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });
        n=Number.parseInt(Aid);
      const rs = result.resultSet;
      let row;
  //console.log(row.EMPLOYEE_ID);
      while ((row = await rs.getRow())) {
        if(row.EMPLOYEE_ID==Aid && row.PASSWORD== pass){
          console.log('era');
          console.log(row);
          console.log(row.JOB_ID);

          if(row.JOB_ID=="ADMIN"){
          // axios.patch('/admin-dash',{ params : { id : Aid }})
          
          res.redirect('/admin-dash?id=' + Aid);
          }
          else if(row.JOB_ID=='DOCTOR')
          {
            console.log('hello');
            res.redirect('/doctor-dash?id=' +Aid);
          }

          else if(row.JOB_ID=='RECEPTIONIST')
          res.redirect('/receptionist-dash?id=' +Aid);

          else if(row.JOB_ID=='CLEANER')
          res.redirect('/cleaner-dash?id=' + Aid);

          else if(row.JOB_ID=='NURSE')
          res.redirect('/nurse-dash?id=' + Aid);

          else if(row.JOB_ID=='STORE MANAGER')
          res.redirect('/store-dash?id='+ Aid);

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

    exports.insert=async(rows,res,id)=>{
        let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");

    // Insert some data

    const sql = `insert into employee ( employee_id, name,date_of_birth, gender,hire_date,salary,job_id,password) values(:1, :2, TO_DATE(:3,'yyyy-mm-dd'), :4,TO_DATE(:5,'yyyy-mm-dd'),:6,:7,:8)`;

    let result = await connection.executeMany(sql, rows);

    console.log(result.rowsAffected, "Rows Inserted");
    //res.redirect("/admin-view")
    res.redirect('/admin-view?id=' + id);

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

//
exports.allc=async(res,id)=>{

    let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
      `select * from employee`,
      []);

    // const rs = result.resultSet;
    // let data;
    // var i=0, row=[];
    // while ((data = await rs.getRow())) {
     
    //   row[i]=data;
    //   i++;
    // }
  res.render('adminpage/adminView', {row:result.rows,id:id});
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


exports.admininfo=async(id, res)=>{

  let connection;

try {

  connection = await oracledb.getConnection();

  console.log("Successfully connected to Oracle Database");
  result = await connection.execute(
      `SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID =:id`,
     {id:id});//EKHANE ID NA admin id?

res.render('adminpage/adminDashboard', {row:result.rows,id:id});
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

///admininfo
/*exports.admininfo=async(res)=>{

  let connection;

try {

  connection = await oracledb.getConnection();

  console.log("Successfully connected to Oracle Database");
  result = await connection.execute(
    `select * from employee where`,
    []);

  // const rs = result.resultSet;
  // let data;
  // var i=0, row=[];
  // while ((data = await rs.getRow())) {
   
  //   row[i]=data;
  //   i++;
  // }
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

exports.showschedule=async(res,id)=>{
  
  let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    result = await connection.execute(
      `SELECT * FROM EMPLOYEE_SCHEDULE e JOIN EMPLOYEE e2 ON(e.EMPLOYEE_ID=e2.EMPLOYEE_ID) order by id asc`,
      []);
      res.render('adminpage/makeschedule', {row:result.rows,id:id});
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

exports.del_sch=async(res,id )=>{
  let connection;

  try {

    connection = await oracledb.getConnection();

    console.log("Successfully connected to Oracle Database");
    result=await connection.execute('DELETE FROM employee_schedule where id= :1', [id] ); 
    connection.commit();

    if(result.rowsAffected>0){
      res.redirect('/makeschedule');
  }else{
     res.status(404).send({ message : `Cannot delete user with ${id}. Maybe user not found!`})
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

exports.add_doc_schedule=async(rows,res,job)=>{
  let connection;

try {

connection = await oracledb.getConnection();

console.log("Successfully connected to Oracle Database");

// Insert some data
let sql;
if(job=='SURGERY'){
 sql = `insert into ot (  OT_DATE,START_TIME, DOC_ID,END_TIME,STATUS) values(TO_DATE(:1,'yyyy-mm-dd'), :2, :3,:4 ,:5)`;
}
else{
 sql = `insert into employee_schedule (  DATE_, EMPLOYEE_ID,JOB_TYPE,START_TIME,END_TIME) values(TO_DATE(:1,'yyyy-mm-dd'), :2,:3 ,:4, :5)`;
}

let result = await connection.executeMany(sql,rows);
console.log(result.rowsAffected, "Rows Inserted");
res.redirect("/makeschedule");

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
exports.add_emp_schedule=async(rows,res)=>{
  let connection;

try {

connection = await oracledb.getConnection();

console.log("Successfully connected to Oracle Database");

// Insert some data
console.log(rows);
const sql = `insert into employee_schedule (  DATE_, EMPLOYEE_ID,JOB_TYPE,START_TIME,END_TIME) values(TO_DATE(:1,'yyyy-mm-dd'), :2,:3 ,:4, :5)`;
// let binds = {
//   ot_date : rows[0],
//   st : rows[3],
//   did : rows[1],
//   job:rows[2],
//   et: rows[4]

// };

let result = await connection.executeMany(sql,rows);

console.log(result.rowsAffected, "Rows Inserted");
res.redirect("/makeschedule")

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
exports.exists=async(id,job)=>{
  let connection;

try {

connection = await oracledb.getConnection();

console.log("Successfully connected to Oracle Database");

result = await connection.execute(
  `SELECT * FROM EMPLOYEE WHERE ID= :id`,
 {id:id});

if(job==result.rows[0][4] )
return true;
else return false;
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
exports.add_nurse_schedule=async(rows,res,room_sched,job)=>{
  let connection;

try {

connection = await oracledb.getConnection();

console.log("Successfully connected to Oracle Database");

// Insert some data
if(job=='SURGERY'){

await connection.execute( 'UPDATE OT SET  nurse_id=:1  where ot_id=:2',rows);
}
else{
  const sql = `insert into employee_schedule (DATE_, EMPLOYEE_ID,JOB_TYPE,START_TIME,END_TIME) values(TO_DATE(:1,'yyyy-mm-dd'), :2,:3 ,:4, :5)`;
  let result1 = await connection.executeMany(sql,rows);
  
room = await connection.execute(
  `SELECT max(id) FROM EMPLOYEE_SCHEDULE`,
 []);
 console.log(room.rows[0][0]);

 room_sched[0][0]= room.rows[0][0];
console.log(room_sched[0][0]);
 const sqll = `insert into nurse_schedule (schedule_id,room_id) values(:1,:2)`;
  let result2 = await connection.executeMany(sqll,room_sched);
  
}



//console.log(result2.rowsAffected, "Rows Inserted");
res.redirect("/makeschedule");

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

exports.allot=async(res)=>{

  let connection;

try {

  connection = await oracledb.getConnection();

  console.log("Successfully connected to Oracle Database");
  result = await connection.execute(
    'select * from ot',
    []);


res.render('adminpage/ot_list', {row:result.rows});
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

