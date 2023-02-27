$(function () 
{
    $.ajaxSetup({cache: false}); // may need to turn off browser cache
    // use jQuery event delegation to handle all <a> tags on the list
    $("#students-ul").on("click", "a", ReadStudentDetailsClick);
});

function ReadStudentDetailsClick(e) 
{
    // here 'this' is the <a> tag the user clcked on and we can read 
    // the sudent id from its data attribute
    let id = $(this).attr('data-id');

    // redirect to the window that displays the student details
    window.location.replace(`http://localhost:81/readstudent/${id}`);
    e.preventDefault();
    return false;
}