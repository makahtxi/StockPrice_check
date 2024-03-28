import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config"

const port = 3000;
const app = express();

const API_URL = "https://financialmodelingprep.com/api/v3";
const API_KEY = `${process.env.STOCK_API_KEY}`

function shortenToFirstSentence(text) {
    
    const sentenceEndRegex = /(?<!\b[a-z])(?<!Inc)(?<!Ltd)[\.\?!](\s|$)/;
    const match = sentenceEndRegex.exec(text);
    if (match) {
      return text.substring(0, match.index + 1);
    }
    return text;
}

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


app.get("/", (req, res) =>{
    res.render("index.ejs")
})

app.post("/submit", async (req, res) => {
    const stockToCheck = req.body.stock
    try {
        const response = await axios.get(API_URL + "/profile/"+ stockToCheck + API_KEY);
        const result = response.data
        console.log(result[0])
        const name = result[0].companyName
        const image = result[0].image
        const price = result[0].price
        const ticker = result[0].symbol
        const change = result[0].changes
        const mktCap = result[0].mktCap
        const sector = result[0].sector
        const sectorCap = sector.toUpperCase()
        const description = shortenToFirstSentence(result[0].description)
        console.log(name)
        res.render("index.ejs", {
           name: name, image: image, price: price, ticker: ticker, change : change, description: description, mktCap: mktCap, sector: sectorCap
        })
    } catch(error){
        console.log(error.message)
    }
});



app.listen(3000, () => {
    console.log(`Server is live on port ${port}`)
})