import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const API_URL = "https://image-charts.com";
const questionAnswerPairs = [
];



app.get("/", (req, res) => {
    const huntFinalized = false;
    const data = questionAnswerPairs;
     res.render("index.ejs", {data: data , huntFinalized: huntFinalized});
});

app.post("/submit", async (req, res) => {
    const id = Date.now().toString();
    const order =  questionAnswerPairs.length + 1;
    const qrSvg = await generateQRCode(
    `http://localhost:3000/hunt/${id}`
  );
    const entry = {
        id: id,
        order: order,
        Question: req.body.question,
        Answer: req.body.answer,
        qrCode: qrSvg,
    };
  
    questionAnswerPairs.push(entry);
    res.redirect("/");
});


//finalize hunt//

  app.get("/finalize", async (req, res) => {
  const huntFinalized = true;

    const data = questionAnswerPairs;

  res.render("index.ejs", { data: data, huntFinalized: huntFinalized });    

});

   //Get by id//
app.get("/hunt/:id", (req, res) => {
  const { id } = req.params;

  // Find the current clue by ID
  const clue = questionAnswerPairs.find(item => item.id === id);

  if (!clue) {
    return res.status(404).send("Clue not found");
  }

  res.render("hunt.ejs", { clue });
});


//creates QR code but getting it from charts API//
async function generateQRCode(id) {
  const response = await axios.get(`${API_URL}/chart?chs=150x150&cht=qr&chl=http://localhost:3000/hunt/${id}&choe=UTF-8&chof=.svg` 
);
  return response.data; 
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});