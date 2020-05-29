const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

//Idea Service
class IdeaService{
	constructor(){
		this.ideas = []
	}
	async find(){
		return this.ideas;
	}
	async create(data){
		const idea = {
			id:this.ideas.length,
			text: data.text,
			tech:data.tech,
			viewer: data.viewer
		}
		idea.time = moment().format('h:mm:ss a');
		this.ideas.push(idea);
		return idea;
	}
}



const app = express(feathers());

//Parse Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Configure SocketIO with realtime APIs
app.configure(socketio());

//Enable REST Services
app.configure(express.rest());

//Register services
app.use('/ideas',new IdeaService());

// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

//New connections connect to the stream channel
app.on('connection', connection =>
  app.channel('stream').join(connection)
);

//Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening',()=>
	console.log(`Feathers server listening on PORT: ${PORT}`)
);

app.service('ideas').create({
	text:'Building an app',
	tech:'Feathers JS',
	viewer:'Ujjawal',
	time: moment().format('h:mm:ss a')
});