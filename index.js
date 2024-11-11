// import express from "express";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// const __dirname = dirname(fileURLToPath(import.meta.url));

// const app = express();
// const port = 3000;

// app.use(express.static('public')); 

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";  // Import dotenv
dotenv.config();  // Load environment variables

const app = express();
const port = 3000;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // Use the env variable

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));  // Serve static files like chat.js and styles.css

// Serve the index page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// API endpoint to interact with OpenAI
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",  // Ensure correct model name
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      })
    });
  
    if (!response.ok) {
      throw new Error(`OpenAI API returned an error: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    console.log(data);  // Log the full response to inspect the structure
  
    if (data.choices && data.choices.length > 0) {
      // Correctly access the message content
      const messageContent = data.choices[0].message.content;
      if (messageContent) {
        res.json({ reply: messageContent.trim() });  // Send the response after trimming
      } else {
        res.status(500).json({ error: "No message content found in OpenAI response" });
      }
    } else {
      res.status(500).json({ error: "No choices found in OpenAI response" });
    }
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Error with OpenAI API", details: error.message });
  }  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
