// chrome.runtime.onMessage.addListener(function(request, sender) {
// 	// chrome.tabs.update(sender.tab.id, { url: request.redirect });
// 	console.log("sending.....................");
//   	chrome.tabs.update(sender.tab.id, { url: "https://www.airbnb.com" });
// });

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) { 
//   	console.log(details);

//     return { redirectUrl: "https://www.yelp.com" };
//   },
//   {urls: ["http://*/", "https://*/"]},
//   ["blocking"]
// );


const queryString = 'q=pv%2F';
const host = 'http://localhost:3000';
const remoteHost = 'https://shorturlfirebase-334920.wl.r.appspot.com'
const apiEndPoint = "/get_redirect/"

chrome.webNavigation.onBeforeNavigate.addListener(
	async function(details) {
		console.log(details);

		const detailsUrl = details.url;
		const firstIndex = detailsUrl.indexOf(queryString) + queryString.length;

		let endIndex = firstIndex + 1;
		while (endIndex < detailsUrl.length && detailsUrl.charAt(endIndex) != '&') {
			endIndex++;
		}

		const urlKeyWord = detailsUrl.substring(firstIndex, endIndex);

		const newUrl = 
		await fetch(remoteHost + apiEndPoint + urlKeyWord)
			.then(response => response.json())
			.then(data => {
				return data.url;
			});
		chrome.tabs.update(details.tabId, {url: newUrl});

	},
	{url: 
		[
			{queryContains: queryString}
		]
	}
);
