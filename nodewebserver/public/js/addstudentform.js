$(function() 
{
    $.ajaxSetup({cache: false});
    $("#add-button").click(AddStudentClick);
});

function AddStudentClick(e)
{

    let json = {
        name: $("#name-textbox").val(),
        age: parseInt($("#age-numberbox").val()),
        course: $("#course-textbox").val()
    };

    $.ajax({
        cache: false,
        type: "POST",
        url: 'http://localhost:1339/students',
        data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (json, status, req) => console.log("Added Student"),
        error: (req, status, error) => console.log("Failed to add studen")
    });
    e.preventDefault();
    return false;
}