<template>
	<div id="vue-instance" class="app">
		<h1>Random Word</h1>
		<button id="btn-get-random-word" @click="getRandomWord">Get Random Word</button>
		<p>{{randomWord}}</p>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				randomWord: '',
				words: [
                'formidable',
                'gracious',
                'daft',
                'mundane',
                'onomatopoeia'
        ]
			}
		},
		methods: {
			getRandomWord: function() {

				this.$http.get('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
				.then(function(response){
					this.randomWord = response.data.word;
				}, function(error){
					console.log(error);
					var randomIndex = Math.floor(Math.random() * this.words.length);
					this.randomWord = this.words[randomIndex];
				});
			}
		}
	}
</script>
