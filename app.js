const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const { clear } = require("console");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});



app.get("/", (req, res)=>{
    res.send("working");
});

// INDEX ROUTE (CREATE ROUTE)
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});
// SHOW ROUTE (READ ROUTE)
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
   res.render("listings/show.ejs", { listing });
});


// NEW ROUTE
app.get("/listing/new", (req, res)=>{
    res.render("listings/new.ejs")
})

// CREATE ROUTE
app.post("/listings", async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});



// EDIT ROUTE
app.get("/listings/:id/edit", async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

// UPDATE ROUTE
app.put("/listings/:id", async (req, res)=>{
   let { id } = req.params; 
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
})

// DELETE ROUTE
app.delete("/listings/:id", async (req, res)=>{
    let { id } = req.params; 
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
})



















// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "by the beach",
//         price: 200,
//         location: "Nashik",
//         country: "india",
//     });
//  await sampleListing.save();
//         console.log("sample was saved");
//         res.send("successful testing");
// });




app.listen(8080);



