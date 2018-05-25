<template>
	<div>
		<h2>Best 30 scores from AI and Humans</h2>
		<router-link to='/'>Return to the game</router-link>

		<table>
			<tr>
				<th><h4>Humans scores</h4></th>
			</tr>
			<tr>
				<th>Rank</th>
				<th>Nickname</th>
				<th>Score</th>
				<th>Time</th>
			</tr>
			<tr v-for='(score, index) in scoresReverse' :key='index' :index='index'>
				<td>{{index + 1}}</td>
				<td>{{score.nickname}}</td>
				<td>{{score.score}}</td>
				<td>{{score.time}}</td>
			</tr>
		</table>

		<table>
			<tr>
				<th><h4>AIs scores</h4></th>
			</tr>
			<tr>
				<th>Rank</th>
				<th>Nickname</th>
				<th>Score</th>
				<th>Time</th>
			</tr>
			<tr v-for='(score, index) in AIReverse' :key='index' :index='index'>
				<td>{{index + 1}}</td>
				<td>{{score.nickname}}</td>
				<td>{{score.score}}</td>
				<td>{{score.time}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
import Vue from 'vue'
import http from '@/utils/http'

export default {
	name: 'Score',
	computed: {
		AIReverse() {
			let AItable = this.scores.filter(s => s.nickname.indexOf("[AI]") != -1)
			AItable.sort(function(a, b) {
			  return a.score - b.score;
			})
			return AItable.reverse().slice(0,15)
		},
		scoresReverse() {
			let table = this.scores.filter(s => s.nickname.indexOf("[AI]") == -1)
			table.sort(function(a, b) {
			  return a.score - b.score;
			})
			return table.reverse().slice(0,15)
		}
	},
	created() {
		http
			.get('json')
			.then(response => {
				console.log(response.data)
				this.scores = response.data
			})
			.catch(error => console.log(error))
	},
	data() {
		return {
			scores: []
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
	table {
		margin-top: 1em;
	}
</style>