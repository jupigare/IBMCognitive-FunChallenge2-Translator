// ------------------------------------
// Exports
// ------------------------------------

const APIService = {
	credentials
};

export default APIService;

// ------------------------------------
// Public
// ------------------------------------

function credentials() {
	return {
		tone: {
			username: "{username}",
			password: "{password}",
		  	version: 'v3',
		  	version_date: '2016-05-19'
		},
		translate: {
			username: "{username}",
		    password: "{password}",
			version: 'v2',
			url: 'https://gateway.watsonplatform.net/language-translator/api/'			
		},
		db: {
		    username: "{username}",
		    password: "{password}",
	        host: "{username}.cloudant.com",
	        port: "{port}",
	        url: "https://{username}:{password}@{username}.cloudant.com"			
		}
	}
}