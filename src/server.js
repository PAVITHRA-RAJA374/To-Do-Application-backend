const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.json({
        ok: true,
        message: "API is up"
    });
});

let tasks = [];
let nextId = 1;

app.get("/tasks", (req,res) => {
    res.json(tasks);
});

app.post("/tasks", (req, res)=>{
    const {title} = req.body;
    if(!title) return res.status(400).json({error: "title is required"});
    const task = {
        id: nextId++,
        title,
        done: false,
        createdAt : new Date().toISOString(),
        updatedAt : null
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.patch("/tasks/:id", (req,res)=>{
    const id = Number(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id===id);

    if(taskIndex ===-1 ) return res.status(404).json({error: "not found"});
    const task = tasks[taskIndex];
    if(req.body.title!= undefined) task.title = req.body.title;
    if(req.body.done !== undefined) task.done = !!req.body.done;
    task.updatedAt = new Date().toISOString();
    tasks[taskIndex] = task;
    res.json(task);
}); 

app.put("/tasks/:id", (req,res) =>{
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if(taskIndex === -1){
        return res.status(404).json({error: "not found"});
    }

    const {title, done} = req.body;
    if(title === undefined || done === undefined){
        return res.status(400).json({error: "title and done are required"});
    }

    const updatedTask = {
        id,
        title,
        done: !!done,
        createdAt : tasks[taskIndex].createdAt,
        updatedAt : new Date().toISOString()
    }

    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
});

app.delete("/tasks/:id", (req,res) => {
    const id = Number(req.params.id);
    const idx = tasks.findIndex(t => t.id === id);
    if(idx === -1) return res.status(404).json({error : "not found"});

    const[removed] = tasks.splice(idx,1);
    res.json(removed);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
    console.log(`Server listening on http://localhost:${PORT}`);
});

