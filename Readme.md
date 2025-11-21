

Rest api endpoints

Router

1. ChatRouter

BaseURL=https://ats-backend-api-1.onrender.com
 
 path : /chat
 request : POST,
 paylod={
    quiestion : string
 }

 response={
    answer:string
 }

 2 ScoreRouter

 path : /score
 request : POST,
 payload ={
    jd : File,
    resume : File
 }

 response={
    matchscore:number,
    gaps:[],
    strengths=[]
 }

 library used

 pdf-parse : for parsing pdf files into text plain
 groq-sdk : for auto chat completion ai based feature
 xenova/transformers : for embeddings processing


 services :

 embedding service
 rag service
 


 
