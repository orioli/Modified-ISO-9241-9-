const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // choose your preferred port

// Path to your CSV file
const csvFilePath = path.join(__dirname, 'box_test_v2.csv');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like your HTML, CSS, and client-side JS) from a "public" folder
app.use(express.static('public'));



app.post('/save_mouse_data', (req, res) => {
  console.log("Mouse tracking data received");

  const { participantId, mouseData } = req.body;
  if (!participantId || !mouseData || !mouseData.length) {
      return res.status(400).send("Invalid data");
  }

  // Format data as CSV: participantId, time, x, y
  let rows = mouseData.map(({ time, x, y }) => 
      [participantId, time, x, y].join(",") + "\n"
  );

  // Path to the CSV file
  const mouseCsvFilePath = path.join(__dirname, 'mouse_tracking_data.csv');

  // Append data to file
  fs.appendFile(mouseCsvFilePath, rows.join(""), (err) => {
      if (err) {
          console.error("Error saving mouse tracking data:", err);
          return res.status(500).send("Error saving data");
      }
      res.send("Mouse tracking data saved successfully");
  });
});




app.post('/save_results', (req, res) => {
    console.log("Request Body:", req.body);
  
    const { participantId, mouseType, run1Valid, run1Errors, run2Valid, run2Errors } = req.body;
  
    // Convert the comma-separated strings into arrays
    const run1ValidArr = run1Valid.split(",");
    const run1ErrorsArr = run1Errors.split(",");
    const run2ValidArr = run2Valid.split(",");
    const run2ErrorsArr = run2Errors.split(",");
  
    // Get current date in YYYY-MM-DD format
    now = new Date();
    // Get current date in YYYY-MM-DD format
     currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  
    // Build an array of rows. For each time in each array, create a new row.
    // Row format: participantId, runWidth, mouseType, currentDate, time, type
    let rows = [];
    // For Run 1 (width = 100 or 50)
    run1ValidArr.forEach(time => {
      rows.push([participantId, "50", mouseType, currentDate, time, "valid"].join(",") + "\n");
    });
    run1ErrorsArr.forEach(time => {
      rows.push([participantId, "50", mouseType, currentDate, time, "error"].join(",") + "\n");
    });
  
    // For Run 2 (width = 50 or 12)
    run2ValidArr.forEach(time => {
      rows.push([participantId, "12", mouseType, currentDate, time, "valid"].join(",") + "\n");
    });
    run2ErrorsArr.forEach(time => {
      rows.push([participantId, "12", mouseType, currentDate, time, "error"].join(",") + "\n");
    });
  
    // Concatenate all rows into a single string
    const newRows = rows.join("");
    console.log("Appending rows:\n", newRows);
  
    fs.appendFile(csvFilePath, newRows, (err) => {
      if (err) {
        console.error("Error appending rows: ", err);
        return res.status(500).send("Error saving file");
      }
      // Redirect the participant to thankyou.html after successful saving
      res.redirect('/thankyou.html');
    });
  });
    
  
  app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
