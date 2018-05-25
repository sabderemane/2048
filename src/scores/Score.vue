<template>
	<div>
		<table>
			<tr>
				<th>Rank</th>
				<th>Nickname</th>
				<th>Score</th>
				<th>Time</th>
			</tr>
			<tr v-for='(score, index) in myScore' :key='index' :index='index'>
				<td>{{index}}</td>
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
		myScore() {
			let table = this.score.filter(s => s.nickname == 'sarah')
			table.sort(function(a, b) {
			  return a.score - b.score;
			})
			return table.reverse().slice(0,10)
		}
	},
	created() {
		http
			.get('json')
			.then(response => {
				console.log(response.data)
				this.score = response.data
			})
			.catch(error => console.log(error))
	},
	data() {
		return {
			score: []
		}
	}

}
</script>

<style>
	
</style>