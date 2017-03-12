/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
		this.bindEvents();
		//this.setupVue();
    },
	
	bindEvents: function(){
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
	
	// Update DOM on a Received Event
	receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    setupVue: function(id) {
        var vueIns = new Vue({
			el: '#vue-instance',
			data: {
				randomWord: '',
				words: [
                    'formidable',
                    'gracious',
                    'daft',
                    'mundane',
                    'onomatopoeia'
                ]
			},
			methods: {
				getRandomWord: function() {
					//var randomIndex = Math.floor(Math.random() * this.words.length);
                    //this.randomWord = this.words[randomIndex];
					this.$http.get('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
					.then(function(response){
						this.randomWord = response.data.word;
					}, function(error){
						alert(error.data);
					});
				}
			}
		});
    }
};

app.initialize();