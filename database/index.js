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

const getClasses = (firstName, lastName, res) => {
  const sqlGetClasses1 = `SELECT class_id FROM student_classes WHERE student_id=(SELECT student_id FROM student WHERE first_name=\'${firstName}\' AND last_name=\'${lastName}\')`;

  client.query(sqlGetClasses1, (err, results) => {
    const resultArray = [];
    for (var i = 0; i < results.rows.length; i++) {
      resultArray.push(results.rows[i].class_id);
    }
    let resultChecker = '(' + resultArray.join(',') + ', 51)';
    const sqlGetClasses2 = `SELECT * FROM classes WHERE class_id NOT IN ${resultChecker}`;
    client.query(sqlGetClasses2, (err, results) => {
      res.send(results.rows);
    })
  });
};

const enrollClasses = (className, firstName, lastName, res) => {
  const sqlGetStudentId = `SELECT student_id FROM student WHERE first_name=\'${firstName}\' AND last_name=\'${lastName}\'`;
  const sqlGetClassId = `SELECT class_id FROM classes WHERE class_name=\'${className}\'`;
  client.query(sqlGetStudentId, (err, studentResult) => {
    if (err) {
      console.log(err);
    }
    client.query(sqlGetClassId, (err, classResult) => {
      if (err) {
        console.log(err);
      }
      const sqlEnrollClass = `INSERT INTO student_classes (student_id, class_id) VALUES (${studentResult.rows[0].student_id}, ${classResult.rows[0].class_id})`;
      client.query(sqlEnrollClass, (err, results) => {
        if (err) {
          console.log(err);
        }
        res.send(results);
      })
    });
  });
};

const createClass = (name, startDate, endDate, days, rate, res) => {
  client.query(`INSERT INTO classes (class_name, start_date, end_date, days, rate, expert_id, expert_zoom) VALUES (\'${name}\', \'${startDate}\', \'${endDate}\', \'${days}\', \'${rate}\', 51, 'https://zoom.us/?pwd=WXQ3Qit1UXBaVy82elBlRHdHVStqQT09')`, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
  })
};

module.exports.connection = client;
module.exports.getUserInfo = getUserInfo;
module.exports.deleteClass = deleteClass;
module.exports.getClasses = getClasses;
module.exports.enrollClasses = enrollClasses;
module.exports.createClass = createClass;
