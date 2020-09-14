const { Client } = require('pg');
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "learning_pod",
});
client.connect();

const getUserInfo = (userType, firstName, lastName, res) => {
  // change the below to reflect different userTypes, only valid on student so far

  const sqlParentFirst = `SELECT student_id, first_name, last_name, pod FROM student WHERE student_id=(SELECT student_id FROM parent WHERE first_name=\'${firstName}\' AND last_name=\'${lastName}\')`;
  const sqlStudentFirst = `SELECT student_id, pod FROM student WHERE first_name=\'${firstName}\' AND last_name=\'${lastName}\'`
  const sqlStudentSecond = `SELECT * FROM classes INNER JOIN student_classes ON student_classes.class_id=classes.class_id where student_id=(SELECT student_id FROM student WHERE first_name=\'${firstName}\' AND last_name=\'${lastName}\')`;
  // update queries to use studentFirst or parentFirst
  client.query(userType === 'student' ? sqlStudentFirst : sqlParentFirst, (err, results) => {
    if (err) {
      console.log(err);
    }
    const sqlParentSecond = `SELECT * FROM classes INNER JOIN student_classes ON student_classes.class_id=classes.class_id where student_id=${results.rows[0].student_id}` || null;

    client.query(userType === 'student' ? sqlStudentSecond : sqlParentSecond, (err, results2) => {
      if (err) {
        console.log(err);
      }
      results2.rows.push(results.rows[0].pod);
      if (userType === 'parent') {
        results2.rows.push(results.rows[0].first_name);
        results2.rows.push(results.rows[0].last_name);
      }
      res.send(results2.rows);
    });
  });
};

const deleteClass = (className, firstName, lastName, res) => {
  const sqlDeleteClass = `DELETE FROM student_classes WHERE student_id=(SELECT student_id FROM student WHERE first_name=\'${firstName}\' AND last_name=\'${lastName}\') AND class_id=(SELECT class_id FROM classes WHERE class_name=\'${className}\')`;
  client.query(sqlDeleteClass, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
  })
};

module.exports.connection = client;
module.exports.getUserInfo = getUserInfo;
module.exports.deleteClass = deleteClass;
