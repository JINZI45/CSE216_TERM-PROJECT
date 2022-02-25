const oracledb = require('oracledb');


const connect= async()=> {

  try {

  await oracledb.createPool({
  user: "tfuser7",
  password: "f7c97a09", 
  connectString: "103.94.135.201/ORCLCDB.LOCALDOMAIN",
  // poolAlias: 'MYpool'
  poolIncrement : 0,
  poolMax       : 4,
  poolMin       : 4
});
} catch (err) {
    console.error(err);
  
  }

  // let connection;

  // try {

  //   connection = await oracledb.getConnection();

  //   console.log("Successfully connected to Oracle Database");

  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   if (connection) {
  //     try {
  //       await connection.close();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }
}
module.exports=connect;
  