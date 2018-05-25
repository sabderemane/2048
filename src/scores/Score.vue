<template>
	<div>
		<table>
			<tr>
				<th>Rank</th>
				<th>Nickname</th>
				<th>Score</th>
				<th>Time</th>
			</tr>
			<tr v-for='(score, index) in myScore()' :key='index' :index='index'>
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
	props: ['scores'],
	methods: {
		myScore() {
			let table = this.scores.filter(s => s.nickname == 'sarah')
			table.sort(function(a, b) {
			  return a.score - b.score;
			})
			return table.reverse().slice(0,10)
		}
	},
	data() {
		return {}
	}

}
</script>

<style>
	
</style>