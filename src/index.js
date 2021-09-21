const express = require("express");
const { json } = require('express');

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepoAccount(request, response, next){
  const { title } = request.headers;

  const tite = repositories.find((tite) => tite.title === title);
  
  if(!tite){
    return response.status(404).json({error: "Repositorio nao foi achado"});
  }

  request.tite = tite;

  next();

}
function checkuuid (request, response, next){

  const { id } = request.params;

  if(!validate(id)){
    return response.status(404).json({error: "Id format invalid!"})

    
  }
  next();
}
function checkRepoExistByID(request, response, next){
 const { id } = request.params;
 

 const repo = repositories.find((repo) => repo.id === id);
 
  if(!repo){
    return response.status(404).json({error: "Repo not found"})
  }


  request.repo = repo
  next();
}


app.get("/repositories" ,(request, response) => {
  
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  

  const repoAlreadyExist = repositories.some((repo) => repo.title === title);

  if(repoAlreadyExist){
      return response.status(400).json({error: "User already Exists!"});
  }

  const repositoryOperation = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  
  repositories.push(repositoryOperation);

  return response.status(201).json(repositories);
});

app.put("/repositories/:id" ,checkRepoExistByID, checkuuid,(request, response) => {
  
  const { repo } = request;
  const {title, url, techs} = request.body;

  
  repo.title = title;
  repo.url = url;
  repo.techs = techs;
  
  return response.json(repo);
});

app.delete("/repositories/:id" ,checkRepoExistByID, checkuuid, (request, response) => {
  const { repo } = request;


  repositories.splice(repo, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like" ,checkRepoExistByID, (request, response) => {
  const { repo } = request;

  repo.likes = repo.likes + 1;

  return response.status(201).json(repo);
});
app.post("/repositories/:id/unlike" ,checkRepoExistByID, (request, response) => {
  const { repo } = request;

 

  if(repo.likes < 0 ){
    repo.likes = 0;
    return response.status(404).json({error: "Limite 0 para like"})
  }

  repo.likes = repo.likes - 1;
  

  return response.json(repo);
});

module.exports = app;
