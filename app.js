const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path"); //core module
const nodemailer = require("nodemailer");

const app = express();

//VIEW ENGINE SET UP
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//STATIC FOLDER
app.use("/public", express.static(path.join(__dirname, "public")));

//BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

//INDEX ROUTE
app.get("/", (req, res) => {
  res.render("contact", { layout: false });
});

app.post("/send", (req, res) => {
  //console.log(req.body);
  const output = `
  <h3>New contact</h3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Company: ${req.body.company}</li>
  <li>Email: ${req.body.email}</li>
  <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3> Message: </h3>
  <p> ${req.body.message} </p>
  `;

  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      service: "gmail",
      auth: {
        user: "youremail@gmail.com",
        pass: "password", 
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Nodemailer Contact 👻" <youremail@gmail.com>', // sender address
      to: "email@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "", // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
  main().catch(console.error);

  res.render("contact", { layout: false, msg: "Email has been sent!" });
  
});

app.listen(3000, () => console.log("Server started on port 3000"));
