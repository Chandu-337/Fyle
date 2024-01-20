$(document).ready(function() {

  $('#myForm').on('submit', function(e){
    e.preventDefault();
    $('#ghapidata').html('<div id="loader" class="spinner"></div>');

    var username = $('#ghusername').val();
    var requri   = 'https://api.github.com/users/'+username;
    var repouri  = 'https://api.github.com/users/'+username+'/repos';

    requestJSON(requri, function(json) {
      if(json.message == "Not Found" || username === '') {
        $('#ghapidata').html("<h2>No User Info Found</h2>");
      } else {
        // Display user info
        var fullname   = json.name || username;
        var aviurl     = json.avatar_url;
        var profileurl = json.html_url;
        var followersnum = json.followers;
        var followingnum = json.following;
        var reposnum     = json.public_repos;

        var outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
        outhtml += '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
        outhtml += '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
        outhtml += '<div class="repolist clearfix">';

        // Fetch user repositories
        $.ajax({
          url: repouri,
          dataType: 'json',
          success: function(repositories) {
            if(repositories.length === 0) {
              outhtml += '<p>No repos!</p></div>';
            } else {
              outhtml += '<p><strong>Repos List:</strong></p>';
              outhtml += '<input type="text" id="repoSearch" placeholder="Search Repositories">';
              outhtml += '<ul>';
              $.each(repositories, function(index) {
                outhtml += '<li><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a></li>';
              });
              outhtml += '</ul></div>';
            }
            $('#ghapidata').html(outhtml);

            // Add event listener for repository search
            $('#repoSearch').on('input', function() {
              var searchTerm = $(this).val().toLowerCase();
              var filteredRepos = repositories.filter(function(repo) {
                return repo.name.toLowerCase().includes(searchTerm);
              });
              displayFilteredRepos(filteredRepos);
            });
          },
          error: function() {
            $('#ghapidata').html('<p>Error fetching repositories</p>');
          }
        });
      }
    });
  });

  function displayFilteredRepos(repos) {
    var outhtml = '<ul>';
    $.each(repos, function(index) {
      outhtml += '<li><a href="'+repos[index].html_url+'" target="_blank">'+repos[index].name + '</a></li>';
    });
    outhtml += '</ul>';
    $('.repolist').html(outhtml);
  }

  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        callback(data);
      },
      error: function() {
        $('#ghapidata').html('<p>Error fetching user data</p>');
      }
    });
  }

});
