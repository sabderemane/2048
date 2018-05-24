<template>
	<div>
		<div class="flex">
			<p id="chrono"><span id="minutes">00</span>:<span id="seconds">00</span></p>
			<p>Score : {{grid.points}}</p>
		</div>
		<table>
			<tr v-for='(line, index) in grid.squares' :key='index' :line='line'>
				<td v-for='(col, index) in line' :key='index' :col='col' :style="{backgroundColor: caseColor}">{{col}}</td>
			</tr>
			<p v-if='over.length > 0'>
				<span>{{over}}</span>
				<span>score : {{game.score}}</span>
			</p>
		</table>
		<button @click='setTimer' v-if='isTimer'>Start</button>
		<button @click='clearTimer' v-if='!isTimer'>Finish</button>
	</div>
</template>

<script>
import Vue from 'vue'
import Board from '@/utils/board'

export default {
	name: 'Grid',
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
			console.log(minutesLabel.innerHTML+':'+secondsLabel.innerHTML)
			this.game.time = minutesLabel.innerHTML+':'+secondsLabel.innerHTML
			this.game.score = this.grid.points
			console.log(this.game)
		},
		changeGrid(key) {
			return key != '' ? this.grid.move(key) : null
		},
		move: function (event) {
    		let arrow = event.key.slice(0,5)
    		let key = event.key.replace(arrow, '').toLowerCase()
    		console.log(key)
    		this.changeGrid(key)
    		console.log(this.grid)
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
		reverseGrid() {
			return this.grid.squares.reverse()
		},
		isTimer: {
			get: function() {
				return this.timeOff
			}
		},
		caseColor: {
			get: function() {
				return this.col == '0' ? "#ffffff"
				       : this.col == '2' ?  "#fff2e6"
				       : this.col == 4 ?  "#ffe6cc"
				       : this.col == 8 ? "#ffd9b3"
				       : this.col == 12 ? "#ffcc99"
				       : this.col == 32 ? "#cc6600"
				       : this.col == 64 ? "#df5020"
				       : this.col == 128 ? "#ec4913"
				       : this.col > 128 ? "#ec1313"
				       : "white"
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
	}
</style>