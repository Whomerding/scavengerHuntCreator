import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const API_URL = "https://image-charts.com";
const questionAnswerPairs = [
];

app.get("/", (req, res) => {
    const data = questionAnswerPairs;
     res.render("index.ejs", {data: data});
});

app.post("/submit", async (req, res) => {
    console.log('Received Data:', req.body);
    const id = Date.now().toString();
    console.log('Generated ID:', id);
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
    

    // 3. Push object into the array
    questionAnswerPairs.push(entry);

    // Optional: Log current array to console
     
    res.redirect("/");
});

app.set("view engine", "ejs");





async function generateQRCode(id) {
  const response = await axios.get(`${API_URL}/chart?chs=150x150&cht=qr&chl=http://localhost:3000/hunt/${id}&choe=UTF-8&chof=.svg` 
//     {
//     params: {
//       chs: "200x200",
//       cht: "qr",
//       chl: id,
//       choe: "UTF-8",
//       chof: "svg",
//     },
//     responseType: "text",
//   }
);
    console.log(response.data);
  return response.data; // SVG string
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});