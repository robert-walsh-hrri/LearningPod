const faker = require('faker');
const { Client } = require('pg');
const client = new Client({
  user: "postgres",
  password: "password",
  database: "learning_pod"
});
client.connect((err, results) => {
  if (err) {
    console.log(err);
  }
  console.log('connected to pg');
});

var data = ["Arguing with Judge Judy: Popular Logic on TV Judge Shows","The Adultery Novel In and Out of Russia","The Vampire in Literature and Cinema","Invented Languages: Klingon and Beyond","Elvish, the language of \"Lord of the Rings\"","Harry Potter Lit","Those Sexy Victorians","The Living and UnDead: An Inquiry into Zombies in Cinema and Literature","History","The Phallus","American Degenerates","Comparative History of Organized Crime","European Witchcraft","Sex, Rugs, Salt & Coal","Age of Piracy","Sociology, Psychology and Anthropology","The Lucifer Effect: Understanding How Good People Turn Evil","Border Crossings, Borderlands: Transnational Feminist Perspectives on Immigration","The American Vacation","Mail Order Brides? Understanding the Philippines in Southeast Asian Context","Whiteness: The Other Side of Racism","Alien Sex","Daytime Serials: Family and Social Roles","Its the End of the World as We Know It (And I Feel Fine)","Purity and Porn in America","UFOs In American Society","The Good, the Bad, and the Revolting","Science","The Science of Superheroes","The Science of Harry Potter","Joy of Garbage","\"Far Side\" Entomology","Facial Reconstruction","The Amazing World of Bubbles","FemSex","Technology","The Strategy of Starcraft","Cyberporn and Society","Cyberfeminism","Learning from YouTube","Personal Robots","Human Computer Interaction","The Anthropology of Computing","Lego Robotics","Human Beings and the Machines of Sunshine","Street-Fighting Mathematics","Games and Civic Engagement","Philosophy","The Simpsons and Philosophy","Philosophy and Star Trek","Star Trek and Religion","Myth and Science Fiction: Star Wars, The Matrix, and Lord of the Rings","Taking Marx Seriously","Music","Queer Musicology","History of Electronic Dance Music","The Beatles","Nuthin but a G Thang","Introduction to Turntablism","Visual Arts","Underwater Basket Weaving","Muppet Magic: Jim Hensons Art","Dirty Pictures","The Horror Film in Context","The Road Movie","The Art of Sin and the Sin of Art","The Art of Warcraft: A Closer Look at the Virtual World Phenomenon","Physical Education and Recreation","PE for ME","Xtreme Lit","Whitewater Skills","Circus Stunts","The Art of Walking","Tree Climbing","American Golf: Aristocratic Pastime or the Peoples Game?","Knitting for Noobs","Golf Course Management","Popular Culture","Oprah Winfrey: The Tycoon","How to Watch Television","Through the Darkness of Future-Past: An Exploration of David Lynchs Twin Peaks","Breaking the Rules: An Intellectual Discussion of Fight Club","Video Game History: Rise of a New Medium","The Future is Lost: TV Series as Cultural Phenomenon","Goldbergs Canon: Makin Whoopi","Chosen: Buffy the Vampire Slayer","The Office: Awesome, Awkward, & Addicting","Calvin & Hobbes","Superheroes","American Pro Wrestling","American Soap Operas","Its News to Me: the Role of Media in Your Life","Zombies in Popular Media","Food and Drink","Food and Power in the Twentieth Century","Kitchen Chemistry","Cultural Aspects of Food","Campus Culture and Drinking","From Ban to Bar: The History, Politics, & Taste of Chocolate","Maple Syrup: The Real Thing","Life Skills","Tightwaddery, or The Good Life on a Dollar a Day","Finding Dates Worth Keeping","Field Equipment Operation","Getting Dressed","Biblical Model for Home and Family","Furniture Making","How to Learn (Almost) Anything","Miscellaneous","Nonviolent Responses to Terrorism","Stupidity","Daylighting"];

var days = ['TH', 'MWF', 'MW', 'MTWHF'];

var zoom = 'https://zoom.us/?pwd=WXQ3Qit1UXBaVy82elBlRHdHVStqQT09'

const classesVar = `DROP TABLE IF EXISTS classes CASCADE;
  CREATE TABLE IF NOT EXISTS classes (
  class_id integer GENERATED ALWAYS AS IDENTITY,
  class_name varchar(100) NOT NULL CHECK (class_name <> ''),
  start_date varchar(60),
  end_date varchar(60),
  days varchar(40),
  rate integer,
  expert_id integer,
  expert_zoom varchar(256),
  PRIMARY KEY(class_id),
  CONSTRAINT fk_expert
     FOREIGN KEY (expert_id)
        REFERENCES expert(expert_id)
           ON UPDATE CASCADE ON DELETE SET NULL
)`;

const experts = `DROP TABLE IF EXISTS expert CASCADE;
  CREATE TABLE IF NOT EXISTS expert (
  expert_id integer GENERATED ALWAYS AS IDENTITY,
  first_name varchar(40) NOT NULL CHECK (first_name <> ''),
  last_name varchar(40) NOT NULL CHECK (last_name <> ''),
  credentials varchar(60),
  expert_zoom varchar(100),
  PRIMARY KEY(expert_id)
)`;

const parents = `DROP TABLE IF EXISTS parent CASCADE;
  CREATE TABLE IF NOT EXISTS parent (
  parent_id integer GENERATED ALWAYS AS IDENTITY,
  first_name varchar(40) NOT NULL CHECK (first_name <> ''),
  last_name varchar(40) NOT NULL CHECK (last_name <> ''),
  student_id integer,
  pod varchar(40),
  PRIMARY KEY(student_id),
  CONSTRAINT fk_student
     FOREIGN KEY (student_id)
        REFERENCES student(student_id)
           ON DELETE SET NULL
)`;

const children = `DROP TABLE IF EXISTS student CASCADE;
  CREATE TABLE IF NOT EXISTS student (
  student_id integer GENERATED ALWAYS AS IDENTITY,
  first_name varchar(40) NOT NULL CHECK (first_name <> ''),
  last_name varchar(40) NOT NULL CHECK (last_name <> ''),
  pod varchar(40),
  PRIMARY KEY(student_id)
)`;

const classes_children = `DROP TABLE IF EXISTS student_classes CASCADE;
  CREATE TABLE IF NOT EXISTS student_classes (
  student_id integer REFERENCES student(student_id) ON UPDATE CASCADE ON DELETE CASCADE,
  class_id integer REFERENCES classes(class_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT classes_children_pkey PRIMARY KEY (student_id, class_id)
)`;

client.query(experts)
  .then(() => {
    client.query(children)
      .then(() => {
        client.query(parents)
          .then(() => {
            client.query(classesVar)
            .then(() => {
              client.query(classes_children)
              .then(() => {
                for (var i = 1; i < 201; i++) {
                  client.query(`INSERT INTO student (first_name, last_name, pod) VALUES (${'\'' + faker.name.firstName() + '\''}, ${'\'' + faker.name.lastName().replace('\'', '') + '\''}, ${'\'' + new String(faker.address.city()).replace('\'', '') + '\''})`, ((err, results) => {
                    if (err) {
                      console.log(err);
                    }
                  }));
                }
              }).then(() => {
                for (var j = 1; j < 201; j++) {
                  client.query(`INSERT INTO parent (first_name, last_name, student_id, pod) VALUES (${'\'' + faker.name.firstName() + '\''}, ${'\'' + faker.name.lastName().replace('\'', '') + '\''}, ${'\'' + j + '\''}, ${'\'' + new String(faker.address.city()).replace('\'', '') + '\''})`, ((err, results) => {
                    if (err) {
                      console.log(err);
                    }
                  }));
                }
              }).then(() => {
                for (var k = 1; k < 51; k++) {
                  client.query(`INSERT INTO expert (first_name, last_name, credentials, expert_zoom) VALUES (${'\'' + faker.name.firstName() + '\''}, ${'\'' + faker.name.lastName().replace('\'', '') + '\''}, ${'\'' + faker.name.jobTitle().replace('\'', '') + '\''}, ${'\'' + zoom + '\''})`, ((err, results) => {
                    if (err) {
                      console.log(err);
                    }
                  }));
                }
              }).then(() => {
                for (var l = 0; l < 100; l++) {
                  client.query(`INSERT INTO classes (class_name, start_date, end_date, days, rate, expert_id, expert_zoom) VALUES (${'\'' + data[l] + '\''}, ${'\'' + faker.date.soon() + '\''}, ${'\'' + faker.date.soon() + '\''}, ${'\'' + days[Math.floor(Math.random() * 3)] + '\''}, ${'\'' + Math.ceil(Math.random() * 25) + '\''}, ${'\'' + Math.ceil(Math.random() * 50) + '\''}, ${'\'' + zoom + '\''})`, (err, results) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                }
              }).then(() => {
                var childDuplicateHolder = {};
                var classDuplicateHolder = {};
                for (var m = 1; m < 301; m++) {
                  var randomChild = Math.ceil(Math.random() * 200);
                  var randomClass = Math.ceil(Math.random() * 100 * 5 / 4) > 100 ? Math.ceil(Math.random() * 100) : Math.ceil(Math.random() * 100);
                  if (childDuplicateHolder[randomChild] = undefined) {
                    childDuplicateHolder[randomChild] = randomChild;
                  } else while (childDuplicateHolder[randomChild]){
                    randomChild = Math.ceil(Math.random() * 200);
                  }

                  client.query(`INSERT INTO student_classes (student_id, class_id) VALUES (${randomChild}, ${randomClass})`, ((err, results) => {
                    if (err) {
                      console.log(err);
                    }
                  }));
                }
              })
              .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
          }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));

