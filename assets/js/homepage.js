var getUserRepos = function(user) {
    // format the github api url
    var apiURL = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch("https://api.github.com/users/octocat/repos");

    var response = fetch("https://api.github.com/users/octocat/repos");
    console.log(response);

    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
    
};
  
  getUserRepos();