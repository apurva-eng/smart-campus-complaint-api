const express = require("express");
const app = express();

app.use(express.json());

const ADMIN_TOKEN = "admin123";

let complaints = [
{
id: 1,
student: "Apurva",
department: "CSE",
issue: "WiFi not working",
status: "Pending"
}
];

app.get("/", (req,res)=>{
res.json({
project:"Smart Campus Complaint API",
status:"Running"
});
});

app.post("/login",(req,res)=>{

const {username,password}=req.body;

if(username==="admin" && password==="admin123"){
return res.status(200).json({
message:"Login Successful",
token:ADMIN_TOKEN
});
}

res.status(401).json({
message:"Invalid Credentials"
});
});

app.get("/complaints",(req,res)=>{
res.status(200).json(complaints);
});

app.get("/complaints/:id",(req,res)=>{

const complaint=complaints.find(
c=>c.id==req.params.id
);

if(!complaint){
return res.status(404).json({
message:"Complaint Not Found"
});
}

res.json(complaint);

});

app.post("/complaints",(req,res)=>{

const {student,department,issue}=req.body;

if(!student || !department || !issue){

return res.status(400).json({
message:"All fields are required"
});

}

const newComplaint={
id:complaints.length+1,
student,
department,
issue,
status:"Pending"
};

complaints.push(newComplaint);

res.status(201).json({
message:"Complaint Registered",
data:newComplaint
});

});

app.put("/complaints/:id",(req,res)=>{

const token=req.headers.authorization;

if(token!==ADMIN_TOKEN){
return res.status(403).json({
message:"Access Denied"
});
}

const complaint=complaints.find(
c=>c.id==req.params.id
);

if(!complaint){
return res.status(404).json({
message:"Complaint Not Found"
});
}

complaint.status=req.body.status;

res.status(200).json({
message:"Status Updated",
data:complaint
});

});

app.delete("/complaints/:id",(req,res)=>{

const token=req.headers.authorization;

if(token!==ADMIN_TOKEN){
return res.status(403).json({
message:"Access Denied"
});
}

const index=complaints.findIndex(
c=>c.id==req.params.id
);

if(index===-1){
return res.status(404).json({
message:"Complaint Not Found"
});
}

complaints.splice(index,1);

res.status(200).json({
message:"Complaint Deleted"
});

});

app.listen(5000,()=>{
console.log("Server Running On Port 5000");
});