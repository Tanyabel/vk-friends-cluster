var findFriends = function (token) {
	return $.ajax({
        type: 'GET',
		dataType: 'jsonp',
        data: {},        
        url: 'https://api.vk.com/method/friends.get?order=name&fields=nickname,photo_200_orig,education&access_token=' + token     
    });
};

var findCommonFriends = function(token, friendUid) {
	return $.ajax({
	        type: 'GET',
			dataType: 'jsonp',
	        data: {},
	        async: false,
	        url: 'https://api.vk.com/method/friends.getMutual?target_uid=' + friendUid + '&access_token=' + token 
    });	
};