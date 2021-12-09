// reference to the issue container
var issueContainerEl = document.querySelector("#issues-container");


var getRepoIssues = function(repo) {
    console.log(repo);
    // specifies sort order, Github returns request results in descending order by their created date
    //this option reverses it -> ?direction=asc
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc"; 

    fetch(apiUrl)
        .then(function(response){
            //request was succesful
            if(response.ok) {
                response.json().then(function(data){
                    // pass response data to DOM function
                    displayIssues(data);
                    console.log(data);
                });
            } else {
                alert("There was a problem with your request!");
            }
        });
};

getRepoIssues("facebook/react");

var displayIssues = function(issues) {
    // This code will display a message in the issues container,
    // letting users know there are no open issues for the given repository.
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

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