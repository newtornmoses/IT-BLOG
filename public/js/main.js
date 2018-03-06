var addarticle = $('.Formcontent');
var addarticlebtn = $('#addarticle');
var canclebtn = $('.Formcontent').find('form').find('input.cancle');
var createArticle = $('.Formcontent').find('form').find('input.create')
var addArticleform = $('.Formcontent').find('form');

// open addarticle model
addarticlebtn.on('click', (e) => {
    e.preventDefault();
    addarticle.modal();
});
// cancle addarticle model

canclebtn.on('click', (e) => {
    e.preventDefault();
    addarticle.modal('hide');
});
var imageToUpload;
var Imagefile;

$('#image').on('change', function(event) {
    Imagefile = event.target.files[0];
    console.log(Imagefile)

});


// ajax add new article
addArticleform.submit((e) => {
    var url = addArticleform.attr('action');
    imageToUpload = new FormData();
    imageToUpload.append('image', Imagefile);
    imageToUpload.append('title', $('#title').val());
    imageToUpload.append('description', $('#description').val());
    imageToUpload.append('blog', $('#blog').val());



    console.log(url)
    var homecontent = $('.allposts')

    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: url,
        data: imageToUpload,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            //const addData = document.createElement('Div');

            var addData =

                `
    <a href="/api/blog/${data.article._id}">

        <div class="col-md-12 article">
            <h1 class="text-center">${data.article.title}</h1>
            <img src="${data.article.image}" class="allImages img-responsive" alt="">

            <h5 class="text-center">${data.article.description}</h5>
    </a>

    <a href="/api/blog/${data.article._id}" id="button" class="btn btn-success readmore">read More</a>
    

    </div>
   
            `;

            homecontent.append(addData);
        }

    })
    addarticle.modal('hide');
});



//Author Image
var authorImage = $('.authorImage');
authorImage.submit((e) => {
    e.preventDefault()
    console.log(authorImage.attr('action'))
})


//slice post update time
var updatedDatecontainer = document.querySelectorAll('.updatedDate');
for (let i = 0; i < updatedDatecontainer.length; i++) {
    var updatedDate = updatedDatecontainer[i].textContent;

    var updatedDateSliced = updatedDate.slice(0, -41);
    console.log(updatedDateSliced)
    updatedDatecontainer[i].textContent = updatedDateSliced;
}


// convert time to moment 
var time = document.querySelectorAll('.time');
time.forEach(timeT => {
    var elapsedTime = moment(timeT.textContent).fromNow();

    timeT.textContent = ' ' + elapsedTime
});


// get search form with ajax call


var Searchform = $('#search');


// form submit
Searchform.submit(function(e) {
    e.preventDefault();

    var input = $('.inputSearch');
    var searchformatrr = Searchform.attr('action');
    var results = $('.searchResults');
    var closebtn = $('.closebtn')



    //   hide the content form
    closebtn.click(() => {
        results.hide(() => {
            closebtn.hide();
        });
    });

    console.log(input.val())
    results.html(' ');
    results.show();
    //  change url dynamically
    var newurl = searchformatrr.replace('search', input.val());
    if (input.val('')) {
        console.log('no input provided');
        input.val('No input provided !!!')
    }

    searchformatrr = newurl;





    // ajax call
    $.ajax({
        contentType: 'application/json',
        url: searchformatrr,
        data: { data: input.val() },
        success: function(data) {
            if (data.data.length === 0) {
                results.html('<p>No results found </P>')

            }

            console.log(data);

            data.data.forEach(newdata => {

                results.append('<p> <a href=/api/blog/' + newdata._id + '>' + newdata.title + '</a></P>')
            });

            input.val('');


        }



    });


    closebtn.show();

})









//post comment ajax data

$(function() {
    var form = $('.commentForm').find('form');
    var input = form.find('#comment');
    var url = form.attr('action');
    var ul = $('#comment_row');
    var commentBtn = $('#commentBtn');

    commentBtn.on('click', (e) => {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: url,
            data: { comment: input.val() },
            success: function(data) {
                const comment = document.createElement('Div');
                comment.innerHTML = `
                <li class='l'>


                <h5 id='comment_username' class='badge pull-left'>${data.creator.username}</h5>
                <br>
                <h4 id='comment_comment'>${data.comment}</h4>
                <p class='titme' id='comment_time'> Commented: <i class='fa fa-clock-o time'>  ${data.createdat}</i> </p>

                
               
                
                <div class='commenttools'>
                    <form action='/article/commentLikes/${data._id}' method='post'>
                    <i class='fa fa-hand-o-right'>
                       <button type='submit' class='btn btn-default'>Like</button> </i>|
                    </form>
                    
                    <i class='fa fa-mail-reply reply' id='reply'>Reply</i> |
               \
               ${data.likes} people like this comment
                    
       \
 
       
                          
                           
             
            </li>`
                ul.append(comment)

                input.val('');

            }
        })
    })

});







//post comment reply ajax data


// comments reply

var reply = document.querySelectorAll('.reply');
var commentreply = document.querySelectorAll('.commentReply');
var form = $('.commenttools').find('.replyform').find('.commentReply');
var input = form.find('textarea');
var url = form.attr('action');


for (let i = 0; i < reply.length; i++) {
    reply[i].addEventListener('click', function showform() {

            commentreply[i].classList.toggle('showreplyForm');

        }

    );
}



$(document).ready(function() {
    var btnreply = document.querySelectorAll('.btnreply')
    var replyText = document.querySelectorAll('.replyText');
    var url;
    var content = document.querySelectorAll('.dynamicviews');
    // alert modal
    var alertmodal = $('.alertmodal');
    var cancleModel = $('#cancleModel');

    //close alertModel
    cancleModel.click(function() {
        alertmodal.modal('hide');
    });

    for (let i = 0; i < btnreply.length; i++) {

        btnreply[i].addEventListener('click', function(e) {
            e.preventDefault();
            url = commentreply[i].getAttribute('action')
            id = commentreply[i].dataset.commentid;
            console.log(id);

            $.ajax({
                method: 'POST',
                url: url,
                data: { reply: replyText[i].value },
                success: function(data) {

                    if (data === 'please login') {
                        alertmodal.modal();
                    }
                    console.log(data)
                    var mydata = document.createElement('Div');

                    mydata.innerHTML = `
   <div class="replyView">
   <div class='replymsg'>
    <span class='replybadge'>${data.savedReply.creator.username}</span>
   <i class='replies'>${data.savedReply.reply}
    <p class='repliedTime'> Replied: <i class='fa fa-clock-o time replied'> ${data.savedReply.createdat}</i> </p>
    </i>
    </div>
    </div>
             `;


                    content[i].append(mydata);
                }
            })

            commentreply[i].classList.remove('showreplyForm');

            replyText[i].value = '';


        })

    }
});



// make ajax call for comment  likes
var likeBtn = document.querySelectorAll('.likeBtn');
var likeForm = document.querySelectorAll('.commentLikesForm');
var likesForm = $('.commenttools').find('form');
var likesbtn = $('.commenttools').find('form').find('i').find('.likeBtn');

for (let i = 0; i < likeBtn.length; i++) {



    likeBtn[i].addEventListener('click', function(event) {
        event.preventDefault();

        var formUrl = likeForm[i].getAttribute('action');
        var totalLikes = document.querySelectorAll('.totalLikes')
        var LikesNumber = Number(totalLikes[i].textContent);

        $.ajax({
            method: 'POST',
            url: formUrl,
            success: function(data) {
                console.log(data)
                totalLikes[i].textContent = LikesNumber + data;
            }
        })
    })
}


// post likes ajax call
var Postlikebtn = document.querySelector('.Postlikebtn');
//var likeform = document.querySelector('.postlikesForm').getElementById('postForm');
var likeform = $('.postlikesForm').find('form')
var likecontent = document.querySelector('.totalPostLikes');
var likevalue = Number(likecontent.textContent);
// alert modal
var alertmodal = $('.alertmodal');
var cancleModel = $('#cancleModel');

//close alertModel
cancleModel.click(function() {
    alertmodal.modal('hide');
});

var posturl = likeform.attr('action')
Postlikebtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log(likevalue);



    $.ajax({
        method: 'POST',
        url: posturl,
        success: function(data) {
            console.log(data);
            if (data === 'please login') {
                alertmodal.modal();
            }
            likecontent.textContent = data.likes;
        }
    })

})


// edit post ajax call

var postEditForm = $('#editForm')
var Editbtn = $('.btn.btn-primary.editBtn');
var cancleEdit = postEditForm.find('form').find('#cancleEdit');
var savePost = postEditForm.find('form').find('.savePost');
var editform = postEditForm.find('form');
var editUrl = editform.attr('action');
var container = $('.actualPost');
var deleteBtn = $('.deleteBtn');

// call edit model on click 
Editbtn.on('click', () => {

    postEditForm.modal();
});

// cancle edit form
cancleEdit.on('click', () => {

    postEditForm.modal('hide');
});

var newImage;
$('#Editimage').on('change', function(event) {
    newImage = event.target.files[0];
    console.log(newImage)

});


// edit a post on save btn
savePost.on('click', (e) => {
    e.preventDefault();
    var dataToUpload = new FormData();
    dataToUpload.append('image', newImage);
    dataToUpload.append('title', $('#Edittitle').val());
    dataToUpload.append('description', $('#Editdescription').val());
    dataToUpload.append('blog', $('#Editblog').val());
    var request = null;
    if (request !== null) {
        request.load();
    }
    request = $.ajax({
        method: 'PUT',
        url: editUrl,
        data: dataToUpload,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            container.html(
                `
                   <div class="col-md-12">

                   <h4 > Updated on: <i class="updatedDate"> ${data.updatedAt}</i></h4>
            <h1 class="text-center">${data.title}</h1>

            <span class="badge"></span>
            </h4>
            <img src="${data.image}" class="img-responsive">

            <h5 class="text-center">${data.description}</h5>
            <p class="text-center">${data.blog}</p>
       
        </div>
                   `
            )
        }

    });

    postEditForm.modal('hide');
    alert('post edited successfully');
});