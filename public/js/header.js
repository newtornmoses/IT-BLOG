// get search form with ajax call


var form = $('#search');
var mybtnbtn = $('button.closebtn');
var input = $('.inputSearch');
var formatrr = form.attr('action');
var results = $('.searchResults');
// form submit
form.submit(function(e) {
    e.preventDefault();



    var req = null;

    console.log(input.val())
    results.html('');
    results.show();
    //  change url dynamically
    var newurl = formatrr.replace('search', input.val());
    formatrr = newurl;


    // ajax call
    req = $.ajax({
        contentType: 'application/json',
        url: formatrr,
        data: { data: input.val() },
        success: function(data) {
            if (data.data.length === 0 || !data) {
                results.html('<p>No results found </P>')

            }

            console.log(data);

            data.data.forEach(newdata => {
                results.append('<p> <a href=/api/blog/' + newdata._id + '>' + newdata.title + '</a></P>')
            });

            input.val('');


        }



    });


    mybtnbtn.show();

})

//   hide the content form
mybtnbtn.click((e) => {
    e.preventDefault()
    results.hide(() => {
        mybtnbtn.hide();
    });
});