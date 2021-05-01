//Create variables here
var dog,dogimg,happydogimg
var foodStock, foodS;
var database;
var feed,addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  //load images here
  dogimg= loadImage("Dog.png");
  happydogimg=loadImage("happy dog.png");
}

async function setup() {
  createCanvas(1000, 600);
  database = firebase.database();
  dog = createSprite(700,300);
  dog.addImage("dog",dogimg);
  dog.scale =0.5;
  
  feed=createButton("Feed the dog"); 
  feed.position(350,95); 
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food"); 
  addFood.position(450,95); 
  addFood.mousePressed(addFoods);

  foodStock = await database.ref('food').once("value",function(data){
    foodS = data.val();
    console.log(foodS);
  });

  foodObj = new Food(foodS,lastFed);
  foodObj.display();
}

//function to update food stock and last fed time 
function feedDog(){ 
  dog.addImage("dog",happydogimg); 
  foodObj.display();
  //foodObj.deductFood();
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({ 
    food:foodObj.getFoodStock(),
    feedtime:hour()
  })
  foodObj.display();
} 
//function to add food in story' 
function addFoods(){ 
  foodS++; 
  database.ref('/').update({ 
    food:foodS 
  }) 
  foodObj.display();
} 


function draw() {  
  background(46,139,87);
  
  fedTime = database.ref('feedtime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill("black");
  textSize(30);
 
  text("Food Available:" + foodS,200,500);
  drawSprites();
  //add styles here
  if(foodObj)
  foodObj.display();
  fill(255,255,254); 
  textSize(15); 
  if(lastFed>=12){ 
    text("Last Feed : "+ lastFed%12 + " PM", 350,30); 
  }else if(lastFed==0){ 
    text("Last Feed : 12 AM",350,30); 
  }else{ 
    text("Last Feed : "+ lastFed + " AM", 350,30); 
  } 
  
}