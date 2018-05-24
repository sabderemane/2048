<template>
	<div>
		<p><span id="minutes">00</span>:<span id="seconds">00</span></p>
		<table>
			<tr v-for='(line, index) in grid.squares' :key='index' :line='line'>
				<td v-for='(col, index) in line' :key='index'>{{col}}</td>
			</tr>
		</table>
		<button @click='setTimer'>Start</button>
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
			let minutesLabel = document.getElementById("minutes");
			let secondsLabel = document.getElementById("seconds");
			var totalSeconds = 0;
			setInterval(setTime, 1000);

			function setTime() {
			  ++totalSeconds;
			  secondsLabel.innerHTML = pad(totalSeconds % 60);
			  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
			}

			function pad(val) {
			  var valString = val + "";
			  if (valString.length < 2) {
			    return "0" + valString;
			  } else {
			    return valString;
			  }
			}
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
	    let self = this; 
		window.addEventListener('keyup', function(event) {
	        self.move(event)
	        self.$forceUpdate() 
	    });
	},
	computed: {
		points: {
			get: function() {
				return this.grid.points
			}
		}
	},
	data() {
		return {
			grid: Board,
		}
	}
}
</script>

<style scoped>
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