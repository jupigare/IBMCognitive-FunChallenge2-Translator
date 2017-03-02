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
		tone_user: "{username}",
		tone_pass: "{password}",
		translate_user: "{username}",
	    translate_pass: "{password}",
	}
}
