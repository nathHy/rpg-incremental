"use strict";
var ENEMY_HP_EXPONENT=1.15;
var XP_EXPONENT=2;
var enemy={
	maxHP:10,
	HP:10,
	name:''
};

var enemyOrder=[
	wood,
	stone,
	animals,
	people
]
var currentEnemyType = 0;
var enemyIndex = 0;
var playerStats = {
	str:1,
	agi:1,
	luck:1,
	gold:0,
}

var playerInfo={
	goldMultiplier:1,
	totalEnemiesKilled:0,
	damage:2,
	xp:0,
	level:1,
	nextLevel:100,
	prevLevel:0,
	baseXp:100,
	levelUps:0
}
$(document).ready(function() {
	updateEnemyHud()
	var enemyTypes = enemyOrder[currentEnemyType]	
	generateEnemy();
	$("#attack").click(function(){
		if (enemy.HP - playerInfo.damage <1) {
			playerInfo.totalEnemiesKilled++;
			incrementGold();
			incrementXP(enemy.xp);
			generateEnemy();
			return // dont do damage to next enemy
		} 
		enemy.HP -= playerInfo.damage;

	})

	$("body").on('click','.buyItem',function (e) {
		var cost = e.target.attributes.cost
		console.log(cost);
	})

	$('#tabs a').click(function (e) {
		console.log('tab clicked!')
	  e.preventDefault()
	  $(this).tab('show')
	})


	// Update hud every 100 milliseconds
	setInterval(updateHud,100);
})


function updateHud () {
	$('#enemyHP').text(Math.round(enemy.HP))
	$('#level').text(playerInfo.level)
	$('#enemiesKilled').text(playerInfo.totalEnemiesKilled)
	for ( var key in playerStats) {
		$("#" + key).text(Math.round(playerStats[key]))
	}
}

function incrementGold() {
	playerStats.gold+= 1 * playerInfo.goldMultiplier * playerStats.luck;
}

function generateEnemy() {
	console.log('Generating Enemy')
	// var enemyTypes
	// if (playerInfo.level <  5 )
	// 	enemyTypes=wood;
	// else if (playerInfo.level < 10 ) 
	// 	enemyTypes=stone;
	// else if (playerInfo.level < 15 )
	// 	enemyTypes=animals;
	// else if (playerInfo.level < 20 )
	// 	enemyTypes=people;

	if (playerInfo.totalEnemiesKilled % 10 == 0 && playerInfo.totalEnemiesKilled != 0) {
		enemyIndex++;
		if (enemyIndex > enemyTypes.names.length) {
			currentEnemyType++;
		}
	}
	// var index=getRandomIntInclusive(0,enemyTypes.names.length-1);
	var index=enemyIndex;
	// var currentEnemy=enemyTypes
	var currentEnemy=enemyOrder[currentEnemyType]
	// var hp = (enemy.maxHP + (currentEnemy.healthScale * index)) * Math.pow(playerInfo.level,ENEMY_HP_EXPONENT)
	var hp = (10 + currentEnemy.healthScale * index) * Math.pow(playerInfo.level,ENEMY_HP_EXPONENT)
	enemy.maxHP=hp;
	enemy.HP=hp;
	enemy.name=currentEnemy.names[index];
	enemy.xp=(10 + currentEnemy.xpScale * index) * Math.pow(playerInfo.level,ENEMY_HP_EXPONENT)
	updateEnemyHud()
	console.log(enemy)
}

function incrementXP( amount ) {
	playerInfo.xp+=amount;
	if ( playerInfo.xp >= playerInfo.nextLevel ) {
		// New Level!
		// Trigger + icons to appear
		playerInfo.levelUps++;
		if (playerInfo.levelUps != 0)
			$(".level-up").removeClass('hidden');

		playerInfo.level++;
		playerInfo.prevLevel=playerInfo.nextLevel;
		playerInfo.nextLevel=playerInfo.baseXp * Math.pow(playerInfo.level,XP_EXPONENT)
		console.log("Set next level to " +  playerInfo.nextLevel)
	}
	// XP bar represents current level
	// Work out how much we currently have in that level
	// and how much we will need
	var currentXp=playerInfo.xp-playerInfo.prevLevel
	var totalXpNeededToLevel=playerInfo.nextLevel-playerInfo.prevLevel
	var barWidth=currentXp/totalXpNeededToLevel * 100;
	$(".xp").css("width",barWidth + "%")
}

function updateEnemyHud() {
	$("#enemyName").text(enemy.name)
}


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateShop() {
	$("#shopData").html('')
	for (var i = 0; i < items.length-1; i++) {
		var damage,cost;
		damage=Math.round(10 * i * Math.pow(2,1.15)) +1
		cost=Math.round(10 * i * Math.pow(2,1.5)) + 1
		var html = "<tr><td class='itemName'>" + items[i] + "</td>"
		html    += "<td class='itemStats'>Damage:" + damage + "</td>"
		html    += "<td class='buyItem'>Cost:" + cost + "<button cost=" + cost + " class='btn pull-right buyItem'>Buy!</button></td></tr>"
		$("#shopData").append(html)
		
	};
}


function levelUpStr() {
	playerStats.str+=1;
	playerInfo.levelUps--;
	if (playerInfo.levelUps == 0)
		$(".level-up").addClass('hidden');
}
function levelUpAgi() {
	playerStats.agi+=1;
	playerInfo.levelUps--;
	if (playerInfo.levelUps == 0)
		$(".level-up").addClass('hidden');
}
function levelUpLuck() {
	playerStats.luck+=1;
	playerInfo.levelUps--;
	if (playerInfo.levelUps == 0)
		$(".level-up").addClass('hidden');
}