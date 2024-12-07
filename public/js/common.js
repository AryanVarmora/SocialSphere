$("#postTextArea").keyup(event => {
    var textbox = $(event.target); 
    var value = textbox.val().trim();

    var submitbutton = $("#submitPostButton");
    
    if(submitbutton.length == 0) return alert("no submitbutton found");

    if (value == "") {
        submitbutton.prop("disabled", true);
        return;
    }
    submitbutton.prop("disabled", false);
})

$("#submitPostButton").click(() => {
    var button = $(event.target);
    var textbox = $("#postTextArea");

    var data = {
        content: textbox.val()
    }

    $.post("/api/posts", data, postData => {
        var html = createPostHtml(postData);
        $(".postContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

$(document).on("click", ".likeButton",(event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    
    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        suuccess: (postData) => {
            console.log(postData);
        }
    })
    
})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot ? element: element.closest(".post");
    var postId = rootElement.data().id;


    if (postId === undefined) return("Post ID Undefined");


    return postId;
}

function createPostHtml(postData){

    var postedBy = postData.postedBy;

    if(postedBy._id == undefined){
        return console.log("user object not populated")
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    return `<div class='post' data-id = '${postData._id}'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href= '/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class = 'postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class = 'postFooter'> 
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="fa-solid fa-retweet"></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button class='likeButton'>
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
} 


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 <30) return "Just Now";
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}