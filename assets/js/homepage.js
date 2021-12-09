// variables to store reference to the <form> element
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

// variables to reference the DOM elements in index.html
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// variable for the search by topic buttons
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    // format the github api url
    var apiURL = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    // fetch("https://api.github.com/users/octocat/repos");

    // var response = fetch("https://api.github.com/users/octocat/repos");

    fetch(apiURL)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
            console.log(data);
            displayRepos(data, user);
            });
        } else {
          alert("Error: GitHub User Not Found"); // HTTP request will still be made but instead of an attempt to display the repository data, an alert will appear
          // can also be written as alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) { // api's way of handling network errors - When we use fetch() to create a request, the request might go one of two ways: the request may find its destination URL and attempt to get the data in question, which would get returned into the .then() method; or if the request fails, that error will be sent to the .catch() method.
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to Github");
    });
    
};

// this function will accept both the array of repository data and the term we searched for as parameters
var displayRepos = function(repos, searchTerm) {
    
    // create a link for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
    // check if api returned any repos - check for empty arrays and let's the user know if there's nothing to display
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);

    repoSearchTerm.textContent = searchTerm;
    
    // loop over repos - we're taking each repository (repos[i]) and writing some of its data to the page
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo - convert the list of repos into a list of links
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html")
        
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }

    // when the response data is converted to JSON, it will be sent from getUserRepos() to displayRepos()
    // response.json().then(function(data) {
    // displayRepos(data, user);
    // });
    
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        } else {
          alert('Error: GitHub User Not Found');
        }
    });
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);

    // call getFeaturedRepos() function and pass value retrieved from data-language
    if (language) {
        getFeaturedRepos(language);
      
        // clear old content - clear out any remaining text from the repo container
        repoContainerEl.textContent = "";
    }
};

//submit function - When we submit the form we get value from the <input> element via the nameInputEl DOM variable and store the value in its own variable called username
var formSubmitHandler = function(event) {
    // prevents the page from refreshing
    event.preventDefault();
    // console.log(event);
    // get value from input element
    var username = nameInputEl.value.trim(); // .trim() is useful when we leave a leading or trailing space in the <input> element

    if (username) {
        getUserRepos(username);
        
        // clear old content
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
        // repoSearchTerm.textContent = searchTerm;
    } else {
        alert("Please enter a Github username");
    }
};
  
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);