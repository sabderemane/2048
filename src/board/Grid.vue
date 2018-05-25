<template>
	<main class="flex center">
		<div class="block">
			<!-- timer and points -->
			<div class="flex">
				<p id="chrono"><span id="minutes">00</span>:<span id="seconds">00</span></p>
				<p>Score : {{grid.points}}</p>
			</div>
			<!-- grid -->
			<table>
				<tr v-for='(line, index) in grid.squares' :key='index' :line='line'>
					<td v-for='(col, index) in line' :key='index' :col='col' :style="{backgroundColor: caseColor(col)}">{{col}}</td>
				</tr>
			</table>
			<div v-if='over.length > 0'>
				<p class="over">{{over}}</p>
			</div>
			<div class="flex">
				<button @click='playManual' v-if='isTimer && !over.length > 0'>Start</button>
				<button @click='autoPlay' v-if='isTimer && !over.length > 0'>Autoplay</button>
				<button @click='reset' v-else-if='!isTimer && isSent'>Restart</button>
			</div>
		</div>
		<!-- scores -->
		<div class="block">
			<h3>TOP 10 Best Scores</h3>
			<score @update='loadScores' :scores='scores'></score>
			<router-link to='scores'>View others scores</router-link>
		</div>
	</main>
</template>

<script>
import Vue from 'vue'
import Board from '@/utils/board'
import http from '@/utils/http'
import Score from '@/scores/Score'

export default {
	name: 'Grid',
	components: { Score },
	created() {
		this.grid.init(4)
		console.log(this.grid)
		this.getScores()
	},
	methods: {
		playManual() {
			this.auto = false
			this.setTimer()
		},
		autoPlay() {
			let keys = ['right','left','up','down']
			this.auto = true
			this.setTimer()
			if (!this.grid.over && !this.isSent) {
				// while (!this.grid.over) {
				// 	let i = 0
				// 	if (this.grid.hasMoved == false) {
				// 		i += 1
				// 		this.changeGrid(keys[i])
				// 	}
				// 	setInterval(function(){ this.changeGrid(keys[i]) }, 500);
				// }
			}
			else if (this.grid.over && !this.isSent) {
	        	this.clearTimer('[AI] Sarah')
	        	this.isSent = true
	        	this.$emit('update')
	        	this.over = 'Game Over'
		        this.$forceUpdate()
		    }

		},
		setTimer() {
			let minutesLabel = document.getElementById("minutes")
			let secondsLabel = document.getElementById("seconds")
			let totalSeconds = 0
			this.timeOff = false
			this.timer = setInterval(setTime, 1000)

			function setTime() {
				++totalSeconds
				secondsLabel.innerHTML = pad(totalSeconds % 60)
				minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60))
			}

			function pad(val) {
				let valString = val + ""
				if (valString.length < 2) {
					return "0" + valString
				} else {
					return valString
				}
			}
		},
		clearTimer(name) {
			let minutesLabel = document.getElementById("minutes")
			let secondsLabel = document.getElementById("seconds")
			clearInterval(this.timer)
			let time = Number(minutesLabel.innerHTML) * 60 + Number(secondsLabel.innerHTML)
			this.game.time = time
			this.game.score = this.grid.points
			this.game.nickname = name
			console.log(this.game)
			http
				.get(`${this.game.nickname}/${this.game.score}/${this.game.time}`)
				.then(response => {
					console.log(response.data)
				})
				.catch(error => console.log(error))
		},
		reset() {
			let minutesLabel = document.getElementById("minutes")
			let secondsLabel = document.getElementById("seconds")

			this.grid.init(4)
			this.over = ''
			this.$forceUpdate() 
			this.timeOff = false
			this.isSent = false
			minutesLabel.innerHTML = '00'
			secondsLabel.innerHTML = '00'
			this.setTimer()
		},
		changeGrid(key) {
			return key != '' ? this.grid.move(key) : null
		},
		move: function (event) {
    		let arrow = event.key.slice(0,5)
    		let key = event.key.replace(arrow, '').toLowerCase()
    		// get key and change key because grid is not well displayed
    		let reverseKey = this.arrowKey(key)
    		this.changeGrid(reverseKey)
    		console.log(this.grid)
		},
		caseColor(col) {
			return col === 2 || col === 4 ? '#FFCF3F' 
                : col === 8 || col === 16 ? '#FF6F00' 
                : col === 32 || col === 64 ? '#E65100' 
                : col === 128 || col === 256 ? '#BF360C'
                : col === 512 || col === 1024 ? '#5D4037'
                : '#A5A3A3'
		},
		arrowKey(key) {
			return key == 'down' ? 'right'
				: key == 'right' ? 'down'
				: key == 'left' ? 'up'
				: 'left'
		},
		getScores() {
			http
				.get('json')
				.then(response => {
					this.scores = response.data
				})
				.catch(error => console.log(error))
		},
		loadScores() {
			this.getScores()
		}
	},
	mounted() {
		// After hook created and compile template (vue.js)
	    let self = this 
		window.addEventListener('keyup', function(event) {
			if(self.timeOff == false && self.auto == false) {
		        self.move(event)
		        if (self.grid.over && !self.isSent) {
		        	self.clearTimer('sarah')
		        	self.isSent = true
		        	self.$emit('update')
		        	self.over = 'Game Over'
		        }
		        self.$forceUpdate() 
	        }
	    });
	},
	computed: {
		isTimer: {
			get: function() {
				return this.timeOff
			}
		}
	},
	data() {
		return {
			grid: Board,
			over: '',
			timeOff: true,
			timer: '',
			game: {},
			isSent: false,
			auto: false,
			scores: []
		}
	}
}
</script>

<style scoped>
	.flex {
		display: flex;
		flex-direction: row;
	}
	.center {
		justify-content: center;
	}
	#chrono {
		padding-right: 10px;
	}
	.over {
		color: red;
    	font-weight: bold;
	}
	.block {
		display: flex;
	    flex-direction: column;
	    align-items: center;
	    margin: 1em;
	}
	td {
		width: 50px;
	    height: 50px;
	    padding: 0;
	    border: 1px solid grey;
	    color: white;
	    font-weight: bold;
	}
	h3 {
		margin-top: 0.5em;
	}
</style>