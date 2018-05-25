<template>
	<div>
		<div class="flex">
			<p id="chrono"><span id="minutes">00</span>:<span id="seconds">00</span></p>
			<p>Score : {{grid.points}}</p>
		</div>
		<table>
			<tr v-for='(line, index) in grid.squares' :key='index' :line='line'>
				<td v-for='(col, index) in line' :key='index' :col='col' :style="{backgroundColor: caseColor(col)}">{{col}}</td>
			</tr>
		</table>
		<div v-if='over.length > 0'>
			<p class="over">{{over}}</p>
		</div>
		<button @click='setTimer' v-if='isTimer && !over.length > 0'>Start</button>
		<button @click='clearTimer' v-else-if='!isTimer && !over.length > 0'>Finish</button>
		<button @click='reset' v-else-if='!isTimer && over.length > 0'>Restart</button>
		<div>
			<h3>My Bests score</h3>
			<score></score>
			<router-link to='scores'>View others scores</router-link>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import Board from '@/utils/board'
import Score from '@/scores/Score'

export default {
	name: 'Grid',
	components: { Score },
	created() {
		this.grid.init(4)
		console.log(this.grid)
	},
	methods: {
		setTimer() {
			let minutesLabel = document.getElementById("minutes")
			let secondsLabel = document.getElementById("seconds")
			let totalSeconds = 0
			this.timeOff = false
			this.$forceUpdate()
			this.timer = setInterval(setTime, 1000)

			function setTime() {
			  ++totalSeconds
			  secondsLabel.innerHTML = pad(totalSeconds % 60)
			  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60))
			}

			function pad(val) {
			  var valString = val + ""
			  if (valString.length < 2) {
			    return "0" + valString
			  } else {
			    return valString
			  }
			}
		},
		clearTimer() {
			let minutesLabel = document.getElementById("minutes")
			let secondsLabel = document.getElementById("seconds")
			clearInterval(this.timer)
			this.game.time = minutesLabel.innerHTML+':'+secondsLabel.innerHTML
			this.game.score = this.grid.points
			console.log(this.game)
		},
		reset() {
			let minutesLabel = document.getElementById("minutes")
			let secondsLabel = document.getElementById("seconds")

			this.grid.init(4)
			this.over = ''
			this.$forceUpdate() 
			this.timeOff = false
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
    		//console.log(this.grid)
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
		}
	},
	mounted() {
		// After hook created and compile template (vue.js)
	    let self = this 
		window.addEventListener('keyup', function(event) {
			if(self.timeOff == false) {
		        self.move(event)
		        self.$forceUpdate() 
		        if (self.grid.over) {
		        	self.clearTimer()
		        	self.over = 'Game Over'
		        }
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
			game: {}
		}
	}
}
</script>

<style scoped>
	.flex {
		display: flex;
		flex-direction: row;
	}
	#chrono {
		padding-right: 10px;
	}
	.over {
		color: red;
    	font-weight: bold;
	}
	div {
		display: flex;
	    flex-direction: column;
	    align-items: center;
	}
	td {
		width: 50px;
	    height: 50px;
	    padding: 0;
	    border: 1px solid grey;
	    color: white;
	    font-weight: bold;
	}
</style>