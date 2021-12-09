var repoNameEl = document.querySelector("#repo-name");
// reference to the issue container
var issueContainerEl = document.querySelector("#issues-container");
// DOM reference to <div id="limit-warning">
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    

    // conditional statement to check for valid values before passing them into their respective function calls
    if(repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        
        getRepoIssues(repoName);
    } else { // if repo name doesn't exist, direct back to the homepage to try again
        document.location.replace("./index.html");
    }

};

var getRepoIssues = function(repo) {
    // specifies sort order, Github returns request results in descending order by their created date
    //this option reverses it -> ?direction=asc
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc"; // format the github api url
    
    // make a get request to url
    fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayIssues(data);
  
        // check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      // if not successful, redirect to homepage
      document.location.replace("./index.html");
    }
    });
};    

var displayIssues = function(issues) {
    // This code will display a message in the issues container,
    // letting users know there are no open issues for the given repository.
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // loop over given issues
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title - creates the <a> element
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
        } else {
        typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    
    // create a link element, append a link element with an href attribute
    var linkEl = document.createElement("a");
        linkEl.textContent = "See More Issues on GitHub.com";
        linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
        linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};



getRepoName();