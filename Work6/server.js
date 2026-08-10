const exp = require("express")
const app = exp()
const port = 3000

stds = [
    {"name": "Alice","id": "1","major": "Computer Science"},
    {"name": "Eve","id": "2","major": "Computer Graphic"},
    {"name": "Adam","id": "3","major": "Computer Application"}
]

// ws1
app.get('/', function(req, res) {
    res.send("Hello Express")
})

// ws2
app.get('/about', function(req, res) {
    res.send("about!")
})

app.get('/contact', function(req, res) {
    res.send("contact!")
})

// ws3
app.get('/students', function(req, res) {
    res.json(stds)
})

// ws4
app.get('/student/:id', function(req, res) {
    const id = req.params.id
    const std = stds.find(i => i.id === id)

    res.json(std)
})

// ws5
app.get('/square', function(req, res) {
  const num = parseInt(req.query.number)
  const square = num * num

  res.send(`Square = ${square}`)
})

// ws6
app.get('/grade', function(req, res) {
  const score = parseInt(req.query.score)
  let grade = ''

  if (score >= 80 && score <= 100) {
    grade = 'A'
  } else if (score >= 70 && score <= 79) {
    grade = 'B'
  } else if (score >= 60 && score <= 69) {
    grade = 'C'
  } else if (score >= 50 && score <= 59) {
    grade = 'D'
  } else {
    grade = 'F'
  }

  res.send(`Grade = ${grade}`)
})

app.listen(port, function() {console.log("Connect to server.js")})

