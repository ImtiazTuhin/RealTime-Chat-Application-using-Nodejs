// var dbUrl = 'mongodb+srv://imtuhin143:epoknQE9hpmCBTn4@mycluster.oztqqax.mongodb.net/'

var express = require('express')
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser')  
var app = express();

var mongoose = require('mongoose');


// //https
// var https = require('https').Server(app);  
// //socket for realtime communication
// var io = require('socket.io')(https);


const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};


const server = https.createServer(httpsOptions, app);

var io = require('socket.io')(server);



// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



app.use(express.static(__dirname));

//body parser
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message', {
  name: String,
  message: String
})


//Connection string
var dbUrl = 'mongodb+srv://imtuhin143:epoknQE9hpmCBTn4@mycluster.oztqqax.mongodb.net/'

//Endpoints
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({ name: user }, (err, messages) => {
    res.send(messages);
  })
})

app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);
    await message.save()
    console.log('saved');
    var censored = await Message.findOne({ message: 'badword' });
    if (censored)
      await Message.remove({ _id: censored.id })
    else
      io.emit('message', req.body);
    res.sendStatus(200);
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }
  finally {
    console.log('Message Posted')
  }

})





// Endpoint to retrieve messages from the "chat" collection
app.get('/getMessages', async (req, res) => {
  try {
    const messages = await Message.find({}, { _id: 0, __v: 0 }); // Exclude _id and __v fields
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('Error retrieving messages:', error);
  }
});



 //New messages created by the user
 
//  app.post('/messages', (req, res) => {  
//     var message = new Message(req.body);  
//     message.save((err) =>{  
//       if(err)  
//         sendStatus(500);  
//         io.emit('message', req.body);
//       res.sendStatus(200);  
//     })  
//   })

// Use the HTTPS server for socket.io
io.attach(server);

//User connecting
io.on('connection', (socket) =>{  
  console.log('a user is connected')  
})



// Start the server
const PORT = process.env.PORT || 3098;


//db connection

mongoose.connect(dbUrl)
    .then(() => {
        console.log('mongodb connected');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
   
// Server running in the port
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
